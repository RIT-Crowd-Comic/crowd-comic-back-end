import { User } from '../models/user.model';
import bcrypt from 'bcrypt';
import PasswordValidator from 'password-validator';
import { ValidationError } from 'sequelize';

/**
 * Information required to create a new user
 */
interface UserConfig {
    username: string,
    password: string,
    email: string,
    display_name: string,
}

interface UserInfo {
    username: string,
    email: string,
    display_name: string,
}

interface AuthenticateFail {

    /**
     * always use the comparison `success === false` or `success === true`
     */
    success: boolean,
    error?: string,
    message?: string | string[];
}

interface AuthenticateSuccess<T> {
    success: boolean,
    message?: string,
    body: T,
}


const PASSWORD_SALT_ROUNDS = 10;

// /**
//  * matches at least 1 lowercase, at least 1 uppercase, at least 1 number, at least 1 symbol
//  */
// const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()\-=_+\[\]\{\}]).{8,30}$/

const passwordSchema = new PasswordValidator();
passwordSchema
    .is().min(8, 'password should have a minimum of 8 characters')
    .is()
    .max(30, 'password should have a maximum of 30 characters')
    .has()
    .uppercase(1, 'password should have an uppercase character')
    .has()
    .lowercase(1, 'password should have a lowercase character')
    .has(/[\d!@#$%^&*()\-=_+[\]{}]/, 'password should include a number or symbol')
    .has()
    .not()
    .spaces();

/**
 * Checks if a password is valid. On fail, return an error message or message[]
 * @param password 
 * @param errorPrefix optionally include a prefix to the validation error messages
 * @returns 
 */
const validatePassword = (password: string, errorPrefix?: string): AuthenticateFail | AuthenticateSuccess<null> => {
    const validation = passwordSchema.validate(password, { details: true });

    if (validation === false) return {
        success: false,
        message: 'Invalid password'
    } as AuthenticateFail;

    // validation contains an array of error messages
    if (typeof validation === 'object' && (validation.length ?? -1) > 0) {
        const message = typeof validation === 'object' ? validation.map(o => `${errorPrefix ?? ''} ${o?.message}`) : 'Invalid password';
        return { success: false, message } as AuthenticateFail;
    }

    // validation contains an empty array or returns true
    // success!
    if (validation === true || typeof validation === 'object' && (validation.length ?? -1) === 0) {
        return { success: true } as AuthenticateSuccess<null>;
    }

    // assume the password doesn't validate
    return { success: false, message: 'Invalid password' } as AuthenticateFail;
};

/**
     * Create a new user
     * @param {} newUser 
     */
const createUser = async (newUser: UserConfig): Promise<AuthenticateSuccess<UserInfo> | AuthenticateFail> => {

    // validate password
    const passwordValidation = validatePassword(newUser.password);
    if (passwordValidation.success === false) return passwordValidation;

    try {

        // deconstruct the response to ensure only wanted data is returned
        const { username, display_name, email } = await User.create({
            username:     newUser.username,
            display_name: newUser.display_name,
            password:     await bcrypt.hash(newUser.password, PASSWORD_SALT_ROUNDS),
            email:        newUser.email,
        });
        return {
            success: true,
            body:    {
                username,
                display_name,
                email
            }
        } as AuthenticateSuccess<UserInfo>;
    }
    catch (err) {
        if (err instanceof ValidationError) {
        return {
                success: false,
                error: err.name,
                message: err.errors.map(e => e.message)
            } as AuthenticateFail;
        }
        return {
            success: false,
            error: (err as Error).name ?? '',
            message: 'Something went wrong'
        } as AuthenticateFail;
    }
};

/**
     * Authenticate a user before retrieve the user's data
     * @param username 
     * @param password un-bcrypt.hashed password
     * @returns 
     */
const authenticate = async (username: string, password: string): Promise<AuthenticateSuccess<UserInfo> | AuthenticateFail> => {

    // make sure the user actually exists
    const user = await User.findOne({ where: { username: username }, attributes: ['username', 'password', 'email', 'display_name'] });
    if (!user) return {
        success: false,
        message: 'Username or password is invalid'
    } as AuthenticateFail;

    // if there's a match, return the user's information

    // TODO: decide whether we want to include user's password, created_at, updated_at

    const match = await bcrypt.compare(password, user.password);
    if (match) return {
        success: true,
        body:    {
            username:     user.username,
            email:        user.email,
            display_name: user.display_name,
        }
    } as AuthenticateSuccess<UserInfo>;

    return {
        success: false,
        message: 'Username or password is invalid'
    } as AuthenticateFail;
};

/**
     * Change the password for a user
     * @param username 
     * @param currentPassword 
     * @param newPassword 
     */
const changePassword = async (username: string, currentPassword: string, newPassword: string):
    Promise<AuthenticateSuccess<null> | AuthenticateFail> => {

    // ensure new password is not the same
    if (currentPassword === newPassword) {
        return {
            success: false,
            message: 'New password must not be the same as the old password'
        } as AuthenticateFail;
    }

    // validate password
    const passwordValidation = validatePassword(newPassword, 'new');
    if (passwordValidation.success === false) return passwordValidation;

    // check if current username/password are correct
    const auth = await authenticate(username, currentPassword);
    if (auth.success === false) {
        return {
            success: false,
            message: (auth as AuthenticateFail).message ?? ''
        } as AuthenticateFail;
    }

    // update the user's password
    const user = await User.findOne({ where: { username } });
    try {
        await user?.update({ password: await bcrypt.hash(newPassword, PASSWORD_SALT_ROUNDS) });

        return {
            success: true,
            message: 'Password changed successfully'
        } as AuthenticateSuccess<null>;
    }
    catch {
        return {
            success: false,
            message: 'Something went wrong'
        } as AuthenticateFail;
    }

    // finally {
    //     return {
    //         success: false,
    //         message: "Something went wrong"
    //     }  as AuthenticateFail;
    // }
};

/**
     * Change a user's username
     * @param username 
     * @param password 
     * @param newUsername 
     * @returns 
     */
const changeUsername = async (username: string, password: string, newUsername: string): Promise<AuthenticateSuccess<null> | AuthenticateFail> => {

    // make sure new username is not the same
    if (username === newUsername) {
        return {
            success: false,
            message: 'New username must not be the same as the old username'
        } as AuthenticateFail;
    }

    // check if current username/password are correct
    const auth = await authenticate(username, password);
    if (auth.success === false) {
        return {
            success: false,
            message: auth.message
        } as AuthenticateFail;
    }

    // update the user's username
    const user = await User.findOne({ where: { username } });
    try {
        await user?.update({ username: newUsername });

        return {
            success: true,
            message: `Username changed to '${user?.username}'`
        } as AuthenticateSuccess<null>;
    }
    catch (err) {
        return {
            success: false,
            error:   (err as Error).name ?? '',
            message: 'Something went wrong'
        } as AuthenticateFail;
    }
};

// /**
//  * Get the entire row of a user from their username (excluding password). 
//  * This should only be used internally, as it doesn't require authentication.
//  * @param username 
//  * @returns 
//  */
// const async getUserRow(username: string): Promise<IUser | null> {
//     return await User.findOne({
//         where: { username: username },

//         attributes: [
//             'id', 
//             'username',
//             'email', 
//             'display_name', 
//             'created_at', 
//             'updated_at'
//         ]
//     });
// }

export {
    createUser, authenticate, changePassword, changeUsername
};
