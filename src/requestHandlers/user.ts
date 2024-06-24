import { Request, Response } from 'express';
import * as UserService from '../services/userService';
import { ValidationError } from 'sequelize';
import { validatePassword, validateUsername } from './helpers'

// I'll rename it to something better
interface ResponseObject {
    success: boolean,
    body?: any
    message?: string,
    error?: string,
    status?: number,
}

const genericErrorResponse = (error: Error) => ({
    success: false,
    error: error.name ?? '',
    status: 500,
    message: 'Something went wrong'
});

/**
 * Create a new user.
 */
const _createUser = async (username: string, password: string, email: string, display_name: string) => {
    try {
        const response = await UserService.createUser({
            username,
            password,
            email,
            display_name
        });
        return {
            success: true,
            body: response
        };
    }
    catch (err) {
        if (err instanceof ValidationError) {
            return {
                success: false,
                error: err.name,
                message: err.errors.map(e => e.message)
            };
        }
        return genericErrorResponse(err as Error);
    }
};

/**
 * Validates user credentials before sending a creation request to the database.
 */
const createUser = async (req: Request, res: Response): Promise<Response> => {
    // validate username
    const validUsername = validateUsername(req.body.newUsername, 'new');
    if (!validUsername.success) return res.status(400).json(validUsername);

    // validate password
    const validPassword = validatePassword(req.body.password);
    if (!validPassword.success) return res.status(400).json(validPassword);

    const response = await _createUser(
        req.body.username,
        req.body.password,
        req.body.email,
        req.body.display_name
    );

    // most likely caused by bad request data
    if (response.success === false) {
        return res.status(400).json(response);
    }

    return res.status(200).json(response);

};

const _authenticate = async (username: string, password: string): Promise<ResponseObject> => {
    try {
        const response = await UserService.authenticate(username, password);

        // response is undefined likely because DB couldn't find user or password is incorrect
        if (response === undefined) return {
            success: false,
            message: "Username or password is incorrect"
        }

        return {
            success: true,
            body: response
        };
    }
    catch (err) {
        return genericErrorResponse(err as Error);
    }
}

/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
const authenticate = async (req: Request, res: Response): Promise<Response> => {
    const response = await _authenticate(
        req.body.username,
        req.body.password
    );

    if (!response.success) {
        return res.status(response.status ?? 400).json(response);
    }

    return res.status(200).json(response);
}

const _changePassword = async (username: string, password: string, newPassword: string): Promise<ResponseObject> => {

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
        }

        return {success: true}
    }
    catch (err) {
        return genericErrorResponse(err as Error);
    }
}

const changePassword = async (req: Request, res: Response): Promise<Response> => {

    // validate password
    const validPassword = validatePassword(req.body.newPassword, 'new');
    if (!validPassword.success) return res.status(400).json(validPassword);

    const response = await _changePassword(
        req.body.username,
        req.body.password,
        req.body.newPassword
    );

    if (!response.success) return res.status(response.status ?? 400).json(response);

    return res.status(200).json(response);
}

const _changeUsername = async (username: string, password: string, newUsername: string): Promise<ResponseObject> => {
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
        }

        return {
            success: true,
            message: `Username changed to '${newUsername}'`
        }
    }
    catch (err) {
        return genericErrorResponse(err as Error);
    }
}

const changeUsername =  async (req: Request, res: Response): Promise<Response> => {
    // validate username
    const validUsername = validateUsername(req.body.newUsername, 'new');
    if (!validUsername.success) return res.status(400).json(validUsername);

    // validate password
    const validPassword = validatePassword(req.body.password);
    if (!validPassword.success) return res.status(400).json(validPassword);

    const response = await _changeUsername(
        req.body.username,
        req.body.password,
        req.body.newUsername
    );

    if (!response.success) return res.status(response.status ?? 400).json(response);

    return res.status(200).json(response);
}

export { createUser, authenticate, changePassword, changeUsername };
