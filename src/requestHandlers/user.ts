import { Request, Response } from 'express';
import * as UserService from '../services/userService';
import { ValidationError } from 'sequelize';
import {
    validatePassword, validateUsername, genericErrorResponse, assertArguments,
    validateDisplayName
} from './helpers';
import validator from 'validator';

// I'll rename it to something better
interface ResponseObject {
    success: boolean,
    body?: any
    message?: string,
    error?: string,
    status?: number,
}

/**
 * Create a new user.
 */
const _createUserController = async (username: string, password: string, email: string, display_name: string) => {
    try {
        const response = await UserService.createUser({
            username,
            password,
            email,
            display_name
        });
        return {
            success: true,
            body:    response
        };
    }
    catch (err) {
        if (err instanceof ValidationError) {
            return {
                success: false,
                error:   err.name,
                message: err.errors.map(e => e.message)
            };
        }
        return genericErrorResponse(err as Error);
    }
};

/**
 * Validates user credentials before sending a creation request to the database.
 * @returns The new user's information
 */
const createUser = async (req: Request, res: Response): Promise<Response> => {

    const username = req.body.username;
    const password = req.body.password;
    const display_name = req.body.display_name;
    const email = req.body.email;

    // validate arguments are not null
    const validArgs = assertArguments(
        {
            username, password, display_name, email
        },
        a => a != undefined,
        'cannot be undefined'
    );
    if (!validArgs.success) return res.status(400).json(validArgs);

    // validate username
    const validUsername = validateUsername(username);
    if (!validUsername.success) return res.status(400).json(validUsername);

    // validate password
    const validPassword = validatePassword(password);
    if (!validPassword.success) return res.status(400).json(validPassword);

    // validate display name
    const validDisplayName = validateDisplayName(display_name);
    if (!validDisplayName.success) return res.status(400).json(validDisplayName);

    // validate email
    const validEmail = validator.isEmail(email);
    if (!validEmail) return res.status(400).json({ success: false, message: 'invalid email' });

    const response = await _createUserController(
        username,
        password,
        email,
        display_name
    );

    // most likely caused by bad request data
    if (response.success === false) {
        return res.status(400).json(response);
    }

    return res.status(200).json(response);

};

/**
 * Authenticates user credentials
 * @returns user's information
 */
const _authenticateController = async (username: string, password: string): Promise<ResponseObject> => {
    try {
        const response = await UserService.authenticate(username, password);

        // response is undefined likely because DB couldn't find user or password is incorrect
        if (response === undefined) return {
            success: false,
            message: 'Username or password is incorrect'
        };

        return {
            success: true,
            body:    response
        };
    }
    catch (err) {
        return genericErrorResponse(err as Error);
    }
};

/**
 * Authenticates user credentials. On success, return the user's information
 * @returns The user's information
 */
const authenticate = async (req: Request, res: Response): Promise<Response> => {

    const username = req.body.username;
    const password = req.body.password;

    // validate arguments
    const validArgs = assertArguments(
        { username, password },
        a => a != undefined,
        'cannot be undefined'
    );
    if (!validArgs.success) return res.status(400).json(validArgs);

    const response = await _authenticateController(
        username,
        password
    );

    if (!response.success) {
        return res.status(response.status ?? 400).json(response);
    }

    return res.status(200).json(response);
};

/**
 * Changes a user's password
 */
const _changePasswordController = async (username: string, password: string, newPassword: string): Promise<ResponseObject> => {

    // validate password change
    if (password === newPassword) {
        return {
            success: false,
            message: 'New password must not be the same as the old password'
        };
    }

    try {
        const changePasswordSuccess = await UserService.changePassword(username, password, newPassword);

        if (!changePasswordSuccess) return {
            success: false,
            message: 'Current username/password is incorrect'
        };

        return { success: true };
    }
    catch (err) {
        return genericErrorResponse(err as Error);
    }
};

/**
 * Sends a request to the database to change a user's password
 * @returns whether or not the password change was successful
 */
const changePassword = async (req: Request, res: Response): Promise<Response> => {
    const username = req.body.username;
    const password = req.body.password;
    const newPassword = req.body.newPassword;

    // validate arguments are not null
    const validArgs = assertArguments(
        { username, password, newPassword },
        a => a != undefined,
        'cannot be undefined'
    );
    if (!validArgs.success) return res.status(400).json(validArgs);

    // validate password
    const validPassword = validatePassword(newPassword, 'new');
    if (!validPassword.success) return res.status(400).json(validPassword);

    const response = await _changePasswordController(
        username,
        password,
        newPassword
    );

    if (!response.success) return res.status(response.status ?? 400).json(response);

    return res.status(200).json(response);
};

/**
 * Change a user's username
 */
const _changeUsernameController = async (username: string, password: string, newUsername: string): Promise<ResponseObject> => {

    // make sure new username is not the same
    if (username === newUsername) {
        return {
            success: false,
            message: 'New username must not be the same as the old username'
        };
    }

    try {
        const changeUsernameSuccess = await UserService.changeUsername(username, password, newUsername);

        if (!changeUsernameSuccess) return {
            success: false,
            message: 'Current username/password is incorrect'
        };

        return {
            success: true,
            message: `Username changed to '${newUsername}'`
        };
    }
    catch (err) {
        return genericErrorResponse(err as Error);
    }
};

/**
 * Sends a request to the database to change user's username
 * @returns whether or not the username change was successful
 */
const changeUsername = async (req: Request, res: Response): Promise<Response> => {

    const username = req.body.username;
    const password = req.body.password;
    const newUsername = req.body.newUsername;

    // validate arguments are not null
    const validArgs = assertArguments(
        { username, password, newUsername },
        a => a != undefined,
        'cannot be undefined'
    );
    if (!validArgs.success) return res.status(400).json(validArgs);

    // validate username
    const validUsername = validateUsername(newUsername, 'new');
    if (!validUsername.success) return res.status(400).json(validUsername);

    const response = await _changeUsernameController(
        username,
        password,
        newUsername
    );

    if (!response.success) return res.status(response.status ?? 400).json(response);

    return res.status(200).json(response);
};

export {
    createUser, authenticate, changePassword, changeUsername
};
