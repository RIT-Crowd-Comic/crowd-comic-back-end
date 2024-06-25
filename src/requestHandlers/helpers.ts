
import PasswordValidator from 'password-validator';

// /**
//  * matches at least 1 lowercase, at least 1 uppercase, at least 1 number, at least 1 symbol
//  */
// const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()\-=_+\[\]\{\}]).{8,30}$/

const passwordSchema = new PasswordValidator();
passwordSchema
    .is().min(8, 'password has a minimum of 8 characters')
    .is()
    .max(30, 'password has a maximum of 30 characters')
    .has()
    .uppercase(1, 'password should have an uppercase character')
    .has()
    .lowercase(1, 'password should have a lowercase character')
    .has(/[\d!@#$%^&*()\-=_+[\]{}]/, 'password should include a number or symbol')
    .has()
    .not()
    .spaces(0, 'password cannot have spaces');

const usernameSchema = new PasswordValidator();
usernameSchema
    .is().min(8, 'username has a minimum of 8 characters')
    .is()
    .max(30, 'username has a maximum of 30 characters')
    .has()
    .not()
    .spaces(0, 'username cannot have spaces');

const displayNameSchema = new PasswordValidator();
displayNameSchema
        .is().min(1, 'display name has a minimum of 1 character')
        .is()
        .max(30, 'display name has a maximum of 30 characters')
        .has()
        .not()
        .spaces(0, 'display name cannot have spaces');

/**
 * Validate a specified value
 * @param value value to check
 * @param validator validator schema
 * @param errorPrefix Prefix message. Example prefix: 'new' when creating a new username/password
 * @param errorMessage 
 * @param details show details
 * @returns 
 */
const _validate = (validator: PasswordValidator, value: string, errorPrefix?: string, errorMessage: string = '', details: boolean = true) => {
    const validation = validator.validate(value, { details });

    if (validation === false) return {
        success: false,
        message: errorMessage
    };

    // validation contains an array of error messages
    if (typeof validation === 'object' && (validation.length ?? -1) > 0) {
        const message = typeof validation === 'object' ? validation.map(o => `${errorPrefix ?? ''} ${o?.message}`) : errorMessage;
        return { success: false, message };
    }

    // validation contains an empty array or returns true
    // success!
    if (validation === true || typeof validation === 'object' && (validation.length ?? -1) === 0) {
        return { success: true };
    }

    // assume the password doesn't validate
    return { success: false, message: errorMessage };
}


/**
 * Checks if a password is valid. On fail, return an error message or message[]
 * @param password 
 * @param errorPrefix Prefix message. Example prefix: 'new' when creating a new password
 * @returns 
 */
const validatePassword = (password: string, errorPrefix?: string): { success: boolean, message?: string | string[] } => {
    return _validate(passwordSchema, password, errorPrefix, 'Invalid password');
};

/**
 * Checks if a username is valid. On fail, return an error message or message[]
 * @param password 
 * @param errorPrefix Prefix message. Example prefix: 'new' when creating a new username
 * @returns 
 */
const validateUsername = (username: string, errorPrefix?: string): { success: boolean, message?: string | string[] } => {
    return _validate(usernameSchema, username, errorPrefix, 'Invalid username');
};

/**
 * Checks if a display name is valid. On fail, return an error message or message[]
 * @param password 
 * @param errorPrefix Prefix message. Example prefix: 'new' when creating a new display name
 * @returns 
 */
const validateDisplayName = (displayName: string, errorPrefix?: string): { success: boolean, message?: string | string[] } => {
    return _validate(displayNameSchema, displayName, errorPrefix, 'Invalid username');
};

const genericErrorResponse = (error: Error) => ({
    success: false,
    error:   error.name ?? '',
    status:  500,
    message: error.message
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
    validateDisplayName,
    genericErrorResponse,
    assert,
    assertArguments
};
