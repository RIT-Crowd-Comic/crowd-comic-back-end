import { Request, Response } from 'express';
import * as PanelSetService from '../services/panelSetService';
import { Sequelize } from 'sequelize';
import {
    assertArgumentsDefined, assertArgumentsNumber, assertArgumentsString, sanitizeResponse
} from './utils';
import { sequelize } from '../database';
import * as PanelService from '../services/panelService'
import * as UserService from '../services/userService';
import * as HookService from '../services/hookService';
import { IPanel, IPanelSet, IUser } from '../models';

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
    const author_id = (typeof request.body.author_id === 'string') ? request.body.author_id : '';
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
    const id = Number(request.params.id);
    const validArgs = assertArgumentsNumber({ id });
    if (!validArgs.success) return res.status(400).json(validArgs);
    const response = await _getPanelSetByIDController(sequelize)(id);
    return res.status(400).json(response);
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
    const id = (typeof request.params.id === 'string') ? request.params.id : '';
    const validArgs = assertArgumentsString({ id });
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

/**
 * Finds and returns all "trunk" panel_sets in database
 * @returns {IPanelSet[]}
 */
const _getAllTrunkSetsController = async (sequelize: Sequelize) => {
    try {
        return await PanelSetService.getAllTrunkSets(sequelize);
    }
    catch (err) {
        return err;
    }
};

const getAllTrunkSets = async(request: Request, res: Response) : Promise<Response> => {
    const response = await _getAllTrunkSetsController(sequelize);
    return sanitizeResponse(response, res, 'No trunks were found');

    /*  
        #swagger.tags = ['panel-set']
        #swagger.responses[200] = {
            description: 'Get all trunk panel_sets',
            schema: [{ id: 0, author_id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee' }]
        }
        #swagger.responses[400] = {
            schema: { $ref: '#/definitions/error' }
        }
        #swagger.responses[404] = {
            schema: { message: 'Error occured, no trunks were found' }
        }
        #swagger.responses[500] = {}
    */
};


const _getTreeController = (sequelize: Sequelize) => async(id: number) => {
    try {
        const response = await _getPanelSetByIDController(sequelize)(id);
        //if an error or contains not a panelSet return
        //? the second condition isn't the best way to check if it's a panel set, but unsure of another way
        if(response instanceof Error || !(response as any).author_id) {
            return response;
        }
        const root = response as IPanelSet;
        const rootCopy = root;
        delete rootCopy.panels;
        
        const tree = {rootCopy};

        

        
    }
    catch (err) {
        return err;
    }
}

//test methods so I don't have to run all of these queries every time I want to test something
const dumbDumb = async (request: Request, res: Response) => {
    const response = await _dumbDumbController(sequelize)();
    return sanitizeResponse(response, res, '');
}

const _dumbDumbController = (sequelize: Sequelize) => async() => {
    try {
        //create a user
        const user = await UserService.createUser(sequelize)(
            {
                password: "Password!",
                email: "email@yaoo.com",
                display_name: "display"
            }
        ) as IUser;

        //create 3 panel sets
        const panel_sets = [];
        for(let i = 0; i < 3; i++) {
            panel_sets.push(await PanelSetService.createPanelSet(sequelize)({
                author_id: user.id
            }) as IPanelSet);
        }

        //create 2 panels, one for the first two panel sets
        const panels = [];
        for(let i = 1; i < 3; i++) {
            panels.push(await PanelService.createPanel(sequelize)({
            image: "",
            index: 0,
            panel_set_id: i,
            }) as IPanel);
        }

        //add a hook from the first panel to the second panel set
        //add a hook from the first panel to the third panel set
        for(let i = 2; i < 4; i++) {
            await HookService.createHook(sequelize)({
                position: {
                    conditions: {},
                    path: '',
                    value: ''
                },
                current_panel_id:  1,
                next_panel_set_id: i
            })
        }
        return {success: true};
    } 
    catch (err) {
        return err;
    }
}

export {
    dumbDumb, createPanelSet, getPanelSetByID, getAllPanelSetsFromUser, getAllTrunkSets, _createPanelSetController, _getAllPanelSetsFromUserController, _getPanelSetByIDController, _getAllTrunkSetsController
};
