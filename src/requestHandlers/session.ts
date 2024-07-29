import { Request, Response } from 'express';
import * as sessionService from '../services/sessionService';
import { Sequelize } from 'sequelize';
import { getUserByID } from '../services/userService';
import { assertArgumentsDefined, sanitizeResponse } from './utils';
import { sequelize } from '../database';

/**
 * Creates a session
 * @param {string} user_id ID of user to create a session for
 * @returns Session ID and User ID or an error
 */
const _createSessionController = (sequelize: Sequelize) => async (user_id: string) => {
    try {

        // Check if user exists
        if (await getUserByID(sequelize)(user_id) == null) throw new Error(`no user found with id ${user_id}`);

        return await sessionService.createSession(sequelize)(user_id);
    }
    catch (err) {
        return err;
    }
};

const createSession = async (req: Request, res: Response): Promise<Response> => {
    const user_id: string = req.body.user_id;

    const validArgs = assertArgumentsDefined({ user_id });
    if (!validArgs.success) return res.status(400).json(validArgs);

    const response = await _createSessionController(sequelize)(user_id);

    return sanitizeResponse(response, res);

    //API Documentation
    /*
        #swagger.tags = ['session']
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Create a new user session',
        } 
        #swagger.responses[200] = {
            description: 'A new session created',
            schema: { $ref: '#/definitions/session' }
        }
        #swagger.responses[400] = {
            schema: { $ref: '#/definitions/error' }
        }
        #swagger.responses[500] = {}
    */
};

/**
 * Get session data from a session id
 * @param {string} id Session ID to query 
 * @returns Data from the queried session
 */
const _getSessionController = (sequelize: Sequelize) => async (id: string) => {
    try {
        return await sessionService.getSession(sequelize)(id);
    }
    catch (err) {
        return err;
    }
};

const getSession = async (req: Request, res: Response): Promise<Response> => {
    const id = req.params.id;
    const validArgs = assertArgumentsDefined({ id });
    if (!validArgs.success) return res.status(400).json(validArgs);

    const response = await _getSessionController(sequelize)(id);

    return sanitizeResponse(response, res, `Could not find session with id ${id}`);

    //API Documentation
    /*
        #swagger.tags = ['session']
        #swagger.parameters['id'] = {
            in: 'query',
            type: 'string'
        }
        #swagger.responses[200] = {
            description: 'A session',
            schema: { $ref: '#definitions/session' }
        }
        #swagger.responses[400] = {
            schema: { $ref: '#/definitions/error' }
        }
        #swagger.responses[404] = {
            schema: { message: 'could not find session with id ${req.params.id}' }
        }
        #swagger.responses[500] = {}
    */
};

export {
    createSession, getSession, _createSessionController, _getSessionController
};
