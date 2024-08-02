import { Request, Response } from 'express';
import * as UserService from '../services/userService';
import { getSession } from '../services/sessionService';
import { Sequelize } from 'sequelize';
import {
    validatePassword,
    assertArguments,
    validateDisplayName,
    assertArgumentsDefined,
    sanitizeResponse,
    assertArgumentsString
} from './utils';
import validator from 'validator';
import { sequelize } from '../database';
import { validateImageFile } from './image';

/**
 * Gets the user given an id
 * @param req 
 * @param res 
 * @returns nulls if a user with the given id doesn't exist
 */
const getUserByID = async (req: Request, res: Response): Promise<Response> => {
    const id = (typeof req.params.id === 'string') ? req.params.id : '';
    const validArgs = assertArgumentsString({ id });
    if (!validArgs.success) return res.status(400).json(validArgs);
    const response = await _getUserByIDController(sequelize)(id);
    return sanitizeResponse(response, res, `User with id of "${id}" does not exist`);

    // API documentation
    /*  
        #swagger.tags = ['user']
        #swagger.summary = 'get a user by its id',
        #swagger.parameters['id'] = {
            type: 'string',
            description: 'the id of the user'
        }
        #swagger.responses[200] = {
            description: 'Success',
            schema: { $ref: '#/definitions/userResponse' }
        }
        #swagger.responses[400] = {
            schema: { $ref: '#/definitions/error' }
        }
        #swagger.responses[404] = {
            schema: { message: 'User with id of "${id}" does not exist' }
        }
        #swagger.responses[500] = {}
    */
};

const _getUserByIDController = (sequelize: Sequelize) => async(id: string) => {
    try {
        return await UserService.getUserByID(sequelize)(id);
    }
    catch (err) {
        return err;
    }
};

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

    // API documentation
    /*  
        #swagger.tags = ['user']
        #swagger.summary = 'Create a new user'
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'The new users email, password, and display name',
            schema: { $ref: '#/definitions/userDefinition' }
        } 
        #swagger.responses[200] = {
            description: "Success",
            schema: { $ref: '#/definitions/userResponse' }
        }
        #swagger.responses[400] = {
            schema: { $ref: '#/definitions/error' }
        }
        #swagger.responses[500] = {}
    */
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

    return sanitizeResponse(response, res, 'Could not find user with provided email/password');

    // API documentation
    /*  
        #swagger.tags = ['user']
        #swagger.summary = 'Provide user credentials to get user information'
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Provide user email and password',
            schema: { email: 'example@email.com', password: 'Password!' }
        } 
        #swagger.responses[200] = {
            description: 'Success',
            schema: { $ref: '#/definitions/userResponse' }
        }
        #swagger.responses[400] = {
            schema: { $ref: '#/definitions/error' }
        }
        #swagger.responses[404] = {
            schema: { message: 'could not find user with provided email/password' }
        }
        #swagger.responses[500] = {}
    */
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
    if (response === false) return res.status(404).json({ message: 'could not find user with provided email/password' });
    if (response === true) return res.status(200).json({ message: 'password successfully changed' });

    return sanitizeResponse(response, res);

    // API documentation
    /*  
        #swagger.tags = ['user']
        #swagger.summary = 'Change a users password'
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'the users email, old password, and new password',
            schema: { email: 'example@email.com', password: 'Password!', newPassword: 'newPassword!' }
        } 
        #swagger.responses[200] = {
            description: 'Success',
            schema: { message: 'Successfully changed password' }
        }
        #swagger.responses[400] = {
            schema: { $ref: '#/definitions/error' }
        }
        #swagger.responses[404] = {
            schema: {  message: 'could not find user with provided email/password'  }
        }
        #swagger.responses[500] = {}
    */
};

/**
 * Change a user's display name
 */
const _changeDisplayNameController = (sequelize: Sequelize) => async (email: string, newDisplayName: string) => {
    try {
        return await UserService.changeDisplayName(sequelize)(email, newDisplayName);
    }
    catch (err) {
        return err;
    }
};

/**
 * Sends a request to the database to change user's display name
 * @returns whether or not the display name change was successful
 */
const changeDisplayName = async (req: Request, res: Response): Promise<Response> => {

    const email = req.body.email;
    const newDisplayName = req.body.newDisplayName;

    // validate arguments are not null
    const validArgs = assertArguments(
        { email, newDisplayName },
        a => a != undefined,
        'cannot be undefined'
    );
    if (!validArgs.success) return res.status(400).json(validArgs);

    // validate display name
    const validDisplayName = validateDisplayName(newDisplayName, 'new');
    if (!validDisplayName.success) return res.status(400).json(validDisplayName);

    const response = await _changeDisplayNameController(sequelize)(
        email,
        newDisplayName
    );

    // false means failed to authenticate
    // true means successfully changed display name
    if (response === false) return res.status(404).json({ message: 'could not find user with specified email' });
    if (response === true) return res.status(200).json({ message: `display name successfully changed to ${newDisplayName}` });

    return sanitizeResponse(response, res);

    // API documentation
    /*  
        #swagger.tags = ['user']
        #swagger.summary = 'Change the given users password'
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'the users email, password, and new display name',
            schema: { email: 'example@email.com', password: 'Password!', newDisplayName: 'newName' }
        } 
        #swagger.responses[200] = {
            description: 'Success',
            schema: { message: 'display name successfully changed to Jane Smith' }
        }
        #swagger.responses[400] = {
            schema: { $ref: '#/definitions/error' }
        }
        #swagger.responses[404] = {
            schema: { message: 'could not find user with specified email/password' }
        }
        #swagger.responses[500] = {}
    */
};

/**
 * Get a user with a session id
 * @param {string} session_id ID of session to get user from
 * @returns 
 */
const _getUserBySessionController = (sequelize: Sequelize) => async (session_id: string) => {
    try {
        const session = await getSession(sequelize)(session_id ?? '');
        if (session == null) throw new Error(`Session with an id of "${session_id}" does not exist`);

        return await UserService.getUserBySession(sequelize)(session_id);
    }
    catch (err) {
        return err;
    }
};

const getUserBySession = async (req: Request, res: Response) => {
    const id = (typeof req.params.id === 'string') ? req.params.id : '';
    const validArgs = assertArgumentsString({ id });
    if (!validArgs.success) return res.status(400).json(validArgs);
    const response = await _getUserBySessionController(sequelize)(id);
    return sanitizeResponse(response, res, `No user could be found at session id ${id}`);

    // API documentation
    /*  
        #swagger.tags = ['user']
        #swagger.summary = 'get a user from a session given a session id'
        #swagger.parameters['id'] = {
            type: 'string',
            description: 'the id of the session'
        }
        #swagger.responses[200] = {
            description: 'A user',
            schema: [{ $ref: '#/definitions/userResponse' }]
        }
        #swagger.responses[400] = {
            schema: { $ref: '#/definitions/error' }
        }
        #swagger.responses[404] = {
            schema: { message: `Session/User with an id of ${id} does not exist` }
        }
        #swagger.responses[500] = {}
    */
};

const _changePfpController = (sequelize: Sequelize) => async (id: string, buffer: Buffer, mimetype: string) => {
    try {
        return await UserService.changePfp(sequelize)(id, buffer, mimetype);
    }
    catch (err) {
        return err;
    }
};

const changePfp = async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!validateImageFile(req.file)) {
        return res.status(400).json({ error: 'Uploaded file must be an image' });
    }
    const mimetype = req.file.mimetype;
    const buffer = req.file.buffer;
    const email = req.body.email;

    const validArgs = assertArgumentsString(email);
    if (!validArgs.success) return res.status(400).json(validArgs);

    const response = await _changePfpController(sequelize)(email, buffer, mimetype);
    return sanitizeResponse(response, res);

    /*  
        #swagger.tags = ['user']
        #swagger.summary = 'change user's profile picture'
        #swagger.consumes = ['multipart/form-data']
        #swagger.parameters['image'] = {
            in: 'formData',
            type: 'file',
            required: true,
            description: 'The file of the image to save.'
        }
        #swagger.parameters['email'] = {
            in: 'formData',
            type: 'string',
            required: true,
            description: 'User to update's email'
        }
        #swagger.responses[200] = {
            description: 'A true response indicating success',
            schema: [{ true }]
        }
        #swagger.responses[400] = {
            schema: { $ref: '#/definitions/error' }
        }
        #swagger.responses[404] = {
            schema: { message: 'User with an email of ${email} does not exist' }
        }
        #swagger.responses[500] = {}
    */
};

export {
    _createUserController, _authenticateController, _changePasswordController, _changeDisplayNameController,
    createUser, authenticate, changePassword, changeDisplayName, getUserByID, _getUserByIDController, _getUserBySessionController, getUserBySession, _changePfpController, changePfp
};
