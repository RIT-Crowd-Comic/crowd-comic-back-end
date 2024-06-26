import { Sequelize } from 'sequelize';
import { IUser } from '../models/user.model';
import bcrypt from 'bcrypt';

/**
 * Information required to create a new user
 */
interface UserConfig {
    password: string,
    email: string,
    display_name: string,
}

interface UserInfo {
    email: string,
    display_name: string,
    id: string,
}


const PASSWORD_SALT_ROUNDS = 10;

/**
 * Create a new user
 * @param {} newUser 
 */
const createUser = (sequelize : Sequelize) => async (newUser: UserConfig): Promise<UserInfo> => {

    const { display_name, email, id } = await sequelize.models.user.create({
        email:        newUser.email,
        password:     await bcrypt.hash(newUser.password, PASSWORD_SALT_ROUNDS),
        display_name: newUser.display_name,
    }) as IUser;

    return { display_name, email, id };
};

/**
 * Authenticate a user before retrieve the user's data
 * @param email 
 * @param password un-bcrypt.hashed password
 * @returns 
 */
const authenticate = (sequelize : Sequelize) => async (email: string, password: string):
    Promise<UserInfo | undefined> => {

    const user = await sequelize.models.user.findOne({ where: { email } }) as IUser;

    if (!user) return undefined;

    const match = await bcrypt.compare(password, user.password);

    if (match) return {
        email:        user.email,
        display_name: user.display_name,
        id:           user.id
    };

    return undefined;
};

/**
 * Change the password for a user
 * @returns whether or not the password change was successful
 */
const changePassword = (sequelize : Sequelize) => async (email: string, password: string, newPassword: string): Promise<boolean> => {

    // check if current username/password are correct
    const auth = await authenticate(sequelize)(email, password);
    if (!auth) return false;

    const user = await sequelize.models.user.findOne({ where: { email } }) as IUser;
    if (!user) return false;

    await user.update({ password: await bcrypt.hash(newPassword, PASSWORD_SALT_ROUNDS) });
    return true;
};


/**
 * Change a user's email
 * @returns whether or not the email change was successful
 */
const changeDisplayName = (sequelize : Sequelize) => async (email: string, password: string, newDisplayName: string): Promise<boolean | undefined> => {

    // check if current username/password are correct
    const auth = await authenticate(sequelize)(email, password);
    if (!auth) return false;

    const user = await sequelize.models.user.findOne({ where: { email } }) as IUser;
    if (!user) return undefined;

    await user.update({ display_name: newDisplayName });
    return true;
};

const getUserByID = (sequelize: Sequelize) => async (id: string) => {
    return await sequelize.models.user.findByPk(id) as IUser;
};

export {
    createUser, authenticate, changePassword, changeDisplayName, getUserByID
};
