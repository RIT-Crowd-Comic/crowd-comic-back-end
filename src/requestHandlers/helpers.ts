
import PasswordValidator from 'password-validator';

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

const usernameSchema = new PasswordValidator();
usernameSchema
    .is().min(8, 'username should have a minimum of 8 characters')
    .is()
    .max(30, 'username should have a maximum of 30 characters')
    .has().not().spaces();


/**
 * Checks if a password is valid. On fail, return an error message or message[]
 * @param password 
 * @param errorPrefix optionally include a prefix to the validation error messages
 * @returns 
 */
const validatePassword = (password: string, errorPrefix?: string): { success: boolean, message?: string | string[] } => {
    const validation = passwordSchema.validate(password, { details: true });

    if (validation === false) return {
        success: false,
        message: 'Invalid password'
    };

    // validation contains an array of error messages
    if (typeof validation === 'object' && (validation.length ?? -1) > 0) {
        const message = typeof validation === 'object' ? validation.map(o => `${errorPrefix ?? ''} ${o?.message}`) : 'Invalid password';
        return { success: false, message };
    }

    // validation contains an empty array or returns true
    // success!
    if (validation === true || typeof validation === 'object' && (validation.length ?? -1) === 0) {
        return { success: true };
    }

    // assume the password doesn't validate
    return { success: false, message: 'Invalid password' };
};

/**
 * Checks if a username is valid. On fail, return an error message or message[]
 * @param password 
 * @param errorPrefix optionally include a prefix to the validation error messages
 * @returns 
 */
const validateUsername = (username: string, errorPrefix?: string): { success: boolean, message?: string | string[] } => {
    const validation = usernameSchema.validate(username, { details: true });

    if (validation === false) return {
        success: false,
        message: 'Invalid username'
    };

    // validation contains an array of error messages
    if (typeof validation === 'object' && (validation.length ?? -1) > 0) {
        const message = typeof validation === 'object' ? validation.map(o => `${errorPrefix ?? ''} ${o?.message}`) : 'Invalid username';
        return { success: false, message };
    }

    // validation contains an empty array or returns true
    // success!
    if (validation === true || typeof validation === 'object' && (validation.length ?? -1) === 0) {
        return { success: true };
    }

    // assume the password doesn't validate
    return { success: false, message: 'Invalid username' };
};

const genericErrorResponse = (error: Error) => ({
    success: false,
    error:   error.name ?? '',
    status:  500,
    message: 'Something went wrong'
});

const assert = (condition: boolean, message: string) => {
    if (!condition) return {
        success: false,
        message
    };
};

/**
 * Check a list of arguments against a predicate. Returns a list of error messages when the predicate fails
 * @param args aruguments
 * @param predicate Returning false creates an error message
 * @param message a generic error message
 * @returns 
 */
const assertArguments = (
    args: { [key: string]: any },
    predicate: (value: any) => boolean,
    message: string
): { success: boolean, messages?: string[] } => {

    // collect a list of error messages for invalid arguments
    const messages: string[] = [];
    Object.entries(args).forEach((entry) => {
        if (!predicate(entry[1])) messages.push(`Invalid ${entry[0]}${message ? ': ' + message : ''}`);
    });
    if (messages.length > 0) return {
        success: false,
        messages
    };
    return { success: true };
};

export {
    validatePassword,
    validateUsername,
    genericErrorResponse,
    assert,
    assertArguments
};
