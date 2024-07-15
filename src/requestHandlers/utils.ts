
import { Request, Response } from 'express';
import PasswordValidator from 'password-validator';
import { ValidationError } from 'sequelize';
import { Json } from 'sequelize/types/utils';


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

const displayNameSchema = new PasswordValidator();
displayNameSchema
    .is().min(1, 'display name has a minimum of 1 character')
    .is()
    .max(30, 'display name has a maximum of 30 characters');

/**
 * Validate a specified value
 * @param value value to check
 * @param validator validator schema
 * @param errorPrefix Prefix message. Example prefix: 'new' when creating a new email/password
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
};


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
 * Checks if a display name is valid. On fail, return an error message or message[]
 * @param password 
 * @param errorPrefix Prefix message. Example prefix: 'new' when creating a new display name
 * @returns 
 */
const validateDisplayName = (displayName: string, errorPrefix?: string): { success: boolean, message?: string | string[] } => {
    return _validate(displayNameSchema, displayName, errorPrefix, 'Invalid display name');
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

/**
 * Assert all arguments are defined
 * @param args 
 * @returns 
 */
const assertArgumentsDefined = (args : object) =>{
    const validArgs = assertArguments(
        args,
        a => a != undefined,
        'cannot be undefined'
    );
    return validArgs;
};

const assertArgumentsNumber = (args: object) => {
    const validArgs = assertArguments(
        args,
        a => !isNaN(a),
        'must be a valid number'
    );
    return validArgs;
};

const assertArgumentsString = (args: object) => {
    const validArgs = assertArguments(
        args,
        arg => arg !== '',
        'must be typeof string'
    );
    return validArgs;
};


/**
 * Parses a database response as an express response, creating the correct HTTP status codes.<br>
 * - [] | undefined | null => 404
 * - ValidationError => 400
 * - Error => 500
 * - ... => 200
 * @returns 
 */
const sanitizeResponse = (response : any, expressResponse: Response, message404 : string = '404 not found')=>{
    if (response == null || response instanceof Array && response.length === 0) return expressResponse.status(404).json({ message: `${message404}` });
    if (response instanceof ValidationError) return expressResponse.status(400).json({ message: response.errors.map(e => e.message) });
    if (response instanceof Error) {

        // if error message includes 'not found', it's probably a 404 error
        if ('does not exist|not found'.split('|').some(msg => response.message.includes(msg)))
            return expressResponse.status(404).json({ message: response.message ?? 'Not found' });

        // otherwise, assume it's an internal error
        return expressResponse.status(500).json({ message: response.message ?? 'Internal server error.' });
    }
    return expressResponse.status(200).json(response);
};

const notFound = (req: Request, res: Response): Response => {
    return res.status(404).json({ message: `'${req.method} ${req.originalUrl}' is not a valid request` });
};

const assertArgumentsPosition = (positionsObjects : Json)=>{
    if (!Array.isArray(positionsObjects) || positionsObjects.length < 3) {
        return { success: false, message: 'Position must be in the array of objects. Length of array must be 3 or greater.' };
    }
    return assertArguments(
        positionsObjects,
        arg => typeof arg === 'object' && arg !== null &&
        typeof arg.x === 'number' &&
        typeof arg.y === 'number',
        'Positions was not given with the proper parameters. Ensure it is an array of {x: , y: } objects. '
    );
};

export {
    validatePassword,
    validateDisplayName,
    genericErrorResponse,
    assert,
    assertArguments,
    assertArgumentsDefined,
    assertArgumentsNumber,
    assertArgumentsString,
    sanitizeResponse,
    notFound,
    assertArgumentsPosition
};
