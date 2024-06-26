import { Request, Response } from 'express';
import * as PanelSetService from '../services/panelSetService';
import { Sequelize } from 'sequelize';
import { assertArguments, assertArgumentsDefined, sanitizeResponse } from './utils';
import { sequelize } from '../database';
import * as UserService from '../services/userService';

/**
 * Create a new panel set
 * @param author_id the id of the author who made the panel set
 * @returns 
 */
const _createPanelSetController = (sequelize : Sequelize) => async (author_id: string) => {
    try {
        const user = await UserService.getUserByID(sequelize)(author_id);
        if (user == null) throw new Error(`An author with the id "${author_id}" does not exist`);
        return await PanelSetService.createPanelSet(sequelize)({ author_id });
    }
    catch (err) {
        return err;
    }
};

/**
 * Validates author_id before sending a creation request to the database
 * @param request 
 * @param res 
 * @returns 
 */
const createPanelSet = async (request: Request, res: Response) : Promise<Response> => {
    const author_id = request.body.author_id;
    const validArgs = assertArgumentsDefined({ author_id });
    if (!validArgs.success) return res.status(400).json(validArgs);
    const response = await _createPanelSetController(sequelize)(author_id);
    return sanitizeResponse(response, res);

    // API documentation
    /*  
        #swagger.tags = ['panel-set']
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Create a new panel set',
        } 
        #swagger.responses[200] = {
            description: 'Returns the new panel set',
            schema: { id: 0, author_id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee' }
        }
        #swagger.responses[400] = {
            schema: { $ref: '#/definitions/error' }
        }
        #swagger.responses[500] = {}
    */
};

const _getPanelSetByIDController = (sequelize: Sequelize) => async(id: number) => {
    try {
        return await PanelSetService.getPanelSetByID(sequelize)(id);
    }
    catch (err) {
        return err;
    }
};

const getPanelSetByID = async (request: Request, res: Response) : Promise<Response> => {
    const id = Number(request.query.id);
    const validArgs = assertArguments(
        { id },
        arg => !isNaN(arg),
        'must be a valid number'
    );
    if (!validArgs.success) return res.status(400).json(validArgs);
    const response = await _getPanelSetByIDController(sequelize)(id);
    return sanitizeResponse(response, res, `a panel with the id of "${id}" cannot be found`);

    // API documentation
    /*  
        #swagger.tags = ['panel-set']
        #swagger.parameters['id'] = {
            in: 'query',
            type: 'number'
        }
        #swagger.responses[200] = {
            description: 'Returns the panel set',
            schema: { id: 0, author_id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee' }
        }
        #swagger.responses[400] = {
            schema: { $ref: '#/definitions/error' }
        }
        #swagger.responses[404] = {
            schema: { message: 'a panel with the id of "${id}" cannot be found' }
        }
        #swagger.responses[500] = {}
    */
};

const _getAllPanelSetsFromUserController = (sequelize: Sequelize) => async(id: string) => {
    try {

        const getUser = await UserService.getUserByID(sequelize)(id ?? '');
        if (getUser == null) throw new Error(`User with an id of "${id}" does not exist`);

        // see if this user exist
        return await PanelSetService.getAllPanelSetsFromUser(sequelize)(id);
    }
    catch (err) {
        return err;
    }
};

const getAllPanelSetsFromUser = async(request: Request, res: Response) : Promise<Response> => {
    const id = (typeof request.query.id === 'string') ? request.query.id : '';
    const validArgs = assertArguments(
        { id },
        arg => arg !== '',
        'must be typeof string'
    );
    if (!validArgs.success) return res.status(400).json(validArgs);
    const response = await _getAllPanelSetsFromUserController(sequelize)(id ?? '');
    return sanitizeResponse(response, res, 'This user has not made any panel sets');

    // API documentation
    /*  
        #swagger.tags = ['panel-set']
        #swagger.responses[200] = {
            description: 'Get all panel sets from a user',
            schema: [{ id: 0, author_id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee' }]
        }
        #swagger.responses[400] = {
            schema: { $ref: '#/definitions/error' }
        }
        #swagger.responses[404] = {
            schema: { message: 'User with an id of "${id}" does not exist' }
        }
        #swagger.responses[500] = {}
    */

};

export {
    createPanelSet, getPanelSetByID, getAllPanelSetsFromUser, _createPanelSetController, _getAllPanelSetsFromUserController, _getPanelSetByIDController
};
