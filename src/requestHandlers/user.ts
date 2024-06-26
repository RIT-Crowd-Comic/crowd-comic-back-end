import { Request, Response } from 'express';
import * as UserService from '../services/userService';
import { Sequelize } from 'sequelize';
import {
    validatePassword, assertArguments,
    validateDisplayName,
    sanitizeResponse,
    assertArgumentsDefined
} from './utils';
import validator from 'validator';
import { sequelize } from '../database';

/**
 * Create a new user.
 */
const _createUserController = (sequelize: Sequelize) => async (email: string, password: string, display_name: string) => {
    try {
        return await UserService.createUser(sequelize)({
            email,
            password,
            display_name
        });
    }
    catch (err) {
        return err;
    }
};

/**
 * Validates user credentials before sending a creation request to the database.
 * @returns The new user's information
 */
const createUser = async (req: Request, res: Response): Promise<Response> => {

    const password = req.body.password;
    const display_name = req.body.display_name;
    const email = req.body.email;

    // validate arguments are not null
    const validArgs = assertArgumentsDefined({ email, password, display_name });
    if (!validArgs.success) return res.status(400).json(validArgs);

    // validate password
    const validPassword = validatePassword(password);
    if (!validPassword.success) return res.status(400).json(validPassword);

    // validate display name
    const validDisplayName = validateDisplayName(display_name);
    if (!validDisplayName.success) return res.status(400).json(validDisplayName);

    // validate email
    const validEmail = validator.isEmail(email.toString());
    if (!validEmail) return res.status(400).json({ message: 'invalid email' });

    const response = await _createUserController(sequelize)(
        email,
        password,
        display_name
    );

    return sanitizeResponse(response, res);

};

/**
 * Authenticates user credentials
 * @returns user's information
 */
const _authenticateController = (sequelize: Sequelize) => async (email: string, password: string) => {
    try {
        return await UserService.authenticate(sequelize)(email, password);
    }
    catch (err) {
        return err;
    }
};

/**
 * Authenticates user credentials. On success, return the user's information
 * @returns The user's information
 */
const authenticate = async (req: Request, res: Response): Promise<Response> => {

    const email = req.body.email;
    const password = req.body.password;

    // validate arguments
    const validArgs = assertArguments(
        { email, password },
        a => a != undefined,
        'cannot be undefined'
    );
    if (!validArgs.success) return res.status(400).json(validArgs);

    const response = await _authenticateController(sequelize)(email, password);

    return sanitizeResponse(response, res, 'Incorrect email/password');
};

/**
 * Changes a user's password
 */
const _changePasswordController = (sequelize: Sequelize) => async (email: string, password: string, newPassword: string) => {

    try {

        // validate password change
        if (password === newPassword)
            throw new Error('New password must not be the same as the old password');

        return await UserService.changePassword(sequelize)(email, password, newPassword);
    }
    catch (err) {
        return err;
    }
};

/**
 * Sends a request to the database to change a user's password
 * @returns whether or not the password change was successful
 */
const changePassword = async (req: Request, res: Response): Promise<Response> => {
    const email = req.body.email;
    const password = req.body.password;
    const newPassword = req.body.newPassword;

    // validate arguments are not null
    const validArgs = assertArguments(
        { email, password, newPassword },
        a => a != undefined,
        'cannot be undefined'
    );
    if (!validArgs.success) return res.status(400).json(validArgs);

    // validate password
    const validPassword = validatePassword(newPassword, 'new');
    if (!validPassword.success) return res.status(400).json(validPassword);

    const response = await _changePasswordController(sequelize)(email, password, newPassword);

    // false means failed to authenticate
    // true means successfully changed password
    if (response === false) return res.status(400).json({ message: 'email/password is incorrect' });
    if (response === true) return res.status(200).json({ message: 'password successfully changed' });

    return sanitizeResponse(response, res);
};

/**
 * Change a user's username
 */
const _changeDisplayNameController = (sequelize: Sequelize) => async (email: string, password: string, newDisplayName: string) => {
    try {
        return await UserService.changeDisplayName(sequelize)(email, password, newDisplayName);
    }
    catch (err) {
        return err;
    }
};

/**
 * Sends a request to the database to change user's username
 * @returns whether or not the username change was successful
 */
const changeDisplayName = async (req: Request, res: Response): Promise<Response> => {

    const email = req.body.email;
    const password = req.body.password;
    const newDisplayName = req.body.newDisplayName;

    // validate arguments are not null
    const validArgs = assertArguments(
        { email, password, newDisplayName },
        a => a != undefined,
        'cannot be undefined'
    );
    if (!validArgs.success) return res.status(400).json(validArgs);

    // validate username
    const validDisplayName = validateDisplayName(newDisplayName, 'new');
    if (!validDisplayName.success) return res.status(400).json(validDisplayName);

    const response = await _changeDisplayNameController(sequelize)(
        email,
        password,
        newDisplayName
    );

    // false means failed to authenticate
    // true means successfully changed display name
    if (response === false) return res.status(400).json({ message: 'email/password is incorrect' });
    if (response === true) return res.status(200).json({ message: `display name successfully changed to ${newDisplayName}` });

    return sanitizeResponse(response, res);
};

export {
    _createUserController, _authenticateController, _changePasswordController, _changeDisplayNameController,
    createUser, authenticate, changePassword, changeDisplayName
};
