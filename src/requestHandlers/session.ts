import { Request, Response } from 'express';
import * as sessionService from '../services/sessionService';
import { Sequelize } from 'sequelize';
import { getUserByID } from '../services/userService';
import { assertArgumentsDefined, sanitizeResponse } from './utils';
import { sequelize } from '../database';

const _createSessionController = (sequelize: Sequelize) => async (user_id: string) => {
    try {
        //Check if user exists
        if(await getUserByID(sequelize)(user_id) == null) throw new Error(`no user found with id ${user_id}`);

        return await sessionService.createSession(sequelize)({user_id: user_id});
    } catch (err) {
        return err;
    }
};

const createSession = async (req: Request, res: Response): Promise<Response> => {
    const user_id: string = req.body.user_id;

    const validArgs = assertArgumentsDefined({user_id});
    if(!validArgs.success) return res.status(400).json(validArgs);

    const response = await _createSessionController(sequelize)(user_id);

    return sanitizeResponse(response, res);

    /*
        #swagger.tags = ['session']
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

const _getSessionController = (sequelize: Sequelize) => async (id: string) => {
    try {
        return await sessionService.getSession(sequelize)(id);
    } catch (err) {
        return err;
    }
};

const getSession = async (req: Request, res: Response): Promise<Response> => {
    const id = req.params.id;
    const validArgs = assertArgumentsDefined({id});
    if(!validArgs.success) return res.status(400).json(validArgs);

    const response = await _getSessionController(sequelize)(id);

    return sanitizeResponse(response, res, `Could not find session with id ${id}`);

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

export {createSession, getSession, _createSessionController, _getSessionController}