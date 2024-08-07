import { Request, Response } from 'express';
import * as hookService from '../services/hookService';
import { assertArgumentsNumber, sanitizeResponse } from './utils';
import { getPanel } from '../services/panelService';
import { sequelize } from '../database';
import { Sequelize } from 'sequelize';
import { IPanelSet } from '../models';
import { _getAllTrunkSetsController } from './panelSet';


/**
 * Create a hook
 * @param {Json} position List of points for hook position
 * @param {number} current_panel_id ID of panel hook is on
 * @param {number} next_panel_set_id ID of panel set that hook links to
 * @returns response or error
 */

/**
 * Get a hook from its id
 * @param {number} id Hook's id
 * @returns response or error
 */
const _getHookController = (sequelize: Sequelize) => async (id: number) => {
    try {
        return await hookService.getHook(sequelize)(id);
    }
    catch (err) {
        return err;
    }
};

/**
 * Get Hook request
 * @param {Request} req 
 * @param {Response} res 
 * @returns 
 */
const getHook = async (req: Request, res: Response): Promise<Response> => {
    const id = Number(req.params.id);
    const validArgs = assertArgumentsNumber({ id });
    if (!validArgs.success) return res.status(400).json(validArgs);

    const response = await _getHookController(sequelize)(id);

    return sanitizeResponse(response, res, `could not find hook with id ${id}`);

    /*
        #swagger.tags = ['hook']
        #swagger.summary = 'Get a hook by its id'
        #swagger.parameters['id'] = {
            type: 'number',
            description: 'the id of the hook'
        }
        #swagger.responses[200] = {
            description: 'The hook with the requested ID',
            schema: { $ref: '#/definitions/hook' }
        }
        #swagger.responses[400] = {
            schema: { $ref: '#/definitions/error' }
        }
        #swagger.responses[404] = {
            schema: { message: 'could not find hook with id ${id}' }
        }
        #swagger.responses[500] = {}
    */
};

/**
 * Get all hooks associated with a panel
 * @param {number} id ID of target panel
 * @returns response or error
 */
const _getPanelHooksController = (sequelize: Sequelize) => async (id: number) => {
    try {
        const panel = await getPanel(sequelize)(id);
        if (panel == null) throw new Error('no panel exists for given panel id');
        return await hookService.getPanelHooks(sequelize)(id);
    }
    catch (err) {
        return err;
    }
};

/**
 * Get Panel Hooks request
 * @param {Request} req 
 * @param {Response} res 
 * @returns 
 */
const getPanelHooks = async (req: Request, res: Response): Promise<Response> => {
    const id = Number(req.params.id);
    const validArgs = assertArgumentsNumber({ id });
    if (!validArgs.success) return res.status(400).json(validArgs);

    const response = await _getPanelHooksController(sequelize)(id);

    return sanitizeResponse(response, res, `could not find hooks under panel with id ${id}`);

    /*
        #swagger.tags = ['hook']
        #swagger.summary = 'Get all hooks connected to a specific panel'
        #swagger.parameters['id'] = {
            type: 'number',
            description: 'the id of the panel'
        }
        #swagger.responses[200] = {
            description: 'An array of hooks belonging to provided panel',
            schema: [{ $ref: '#/definitions/hook' }]
        }
        #swagger.responses[400] = {
            schema: { $ref: '#/definitions/error' }
        }
        #swagger.responses[404] = {
            schema: { message: 'could not find hooks under panel with id ${id}' }
        }
        #swagger.responses[500] = {}
    */
};

/**
 * Get Panel Hooks request
 * @param {Request} req 
 * @param {Response} res 
 * @returns 
 */
const addSetToHook = async (req: Request, res: Response): Promise<Response> => {
    const hook_id = req.body.hook_id;
    const panel_set_id = req.body.panel_set_id;

    const validArgs = assertArgumentsNumber({ hook_id, panel_set_id });
    if (!validArgs.success) return res.status(400).json(validArgs);

    const response = await _addSetToHookController(sequelize)(hook_id, panel_set_id);

    return sanitizeResponse(response, res, `unable to link panel set with id ${panel_set_id} to hook with id ${hook_id}`);

    /*
        #swagger.tags = ['hook']
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Connect a hook to a panel_set',
            schema: { $ref: '#/definitions/addSetToHookDefinition' }
        } 
        #swagger.responses[200] = {
            description: 'The altered hook',
            schema: { $ref: '#/definitions/hook' }
        }
        #swagger.responses[400] = {
            description: 'Bad Request',
            schema: { $ref: '#/definitions/error' }
        }
        #swagger.responses[404] = {
            description: 'Not Found',
            schema: {
                type: 'object',
                properties: {
                    message: {
                        type: 'string',
                        example: 'unable to link panel set with id ${panel_set_id} to hook with id ${hook_id}'
                    }
                }
            }
        }
        #swagger.responses[500] = {
            description: 'Internal Server Error'
        }
    */
};

/**
 * Updates a hook with a next panel set
 * @param {number} hook_id ID of hook that is being updated
 * @param {number} panel_set_id ID of panel set that hook links to
 * @returns response or error
 */
const _addSetToHookController = (sequelize: Sequelize) => async (hook_id: number, panel_set_id: number) => {
    try {
        const valid = await _validateHookConnectionController(sequelize)(panel_set_id);
        if (valid instanceof Error) throw valid;
        return await hookService.addSetToHook(sequelize)(hook_id, panel_set_id);
    }
    catch (err) {
        return err;
    }
};

/**
 * Throws an error if the next_panel_set is invalid
 * @param next_panel_set_id panel set id of the next panel set the hook is attached to
 */
const _validateHookConnectionController = (sequelize : Sequelize) => async(next_panel_set_id : number) =>{

    try {

        // get panel set to connect to
        const panelSet = await sequelize.models.panel_set.findByPk(next_panel_set_id, { include: sequelize.models.hook }) as IPanelSet;

        // if no panel set is found
        if (panelSet == null) throw new Error('no panel_set exists for given panel_set_id');

        // if panel set is hooked up
        if (panelSet.hook) throw new Error('Panel set already has a connection, it cannot be connected to anything else.');

        // get the trunks
        const trunks = await _getAllTrunkSetsController(sequelize) as IPanelSet[];

        // check if the trunk has it
        if (trunks.some(trunk => trunk.id === panelSet.id)) {
            throw new Error('Panel set is a trunk');
        }
    }
    catch (err) {
        return err;
    }
    return { success: true };
};

const getAllHooksByPanelSetId = async (req: Request, res: Response): Promise<Response> => {
    const id = req.params.id;
    const validArgs = assertArgumentsNumber({ id });
    if (!validArgs.success) return res.status(400).json(validArgs);
    const response = await _getAllHooksByPanelSetIdController(sequelize)(Number(id));
    return sanitizeResponse(response, res, `A panel set with a id of ${id} doesn't exist`);

    /*
        #swagger.tags = ['hook']
        #swagger.summary = 'Get all of the hooks connected to a panel set'
        #swagger.parameters['id'] = {
            type: 'number',
            description: 'the id of the panel set'
        }
        #swagger.responses[200] = {
            description: 'The array of hooks connected to provided panel set',
            schema: [{ $ref: '#/definitions/hook' }]
        }
        #swagger.responses[400] = {
            schema: { $ref: '#/definitions/error' }
        }
        #swagger.responses[404] = {
            schema: { message: 'could not find hooks connected to panel set with id ${id}' }
        }
        #swagger.responses[500] = {}
        
    */
};

/**
 * @param panel_set_id the id of the panel set that is being checked for hooks
 */
const _getAllHooksByPanelSetIdController = (sequelize: Sequelize) => async(panel_set_id: number) => {
    try {

        // verify panel_set exists
        const panelSet = await sequelize.models.panel_set.findByPk(panel_set_id, { include: sequelize.models.panel }) as IPanelSet;
        if (panelSet === null) {
            throw new Error(`A panel set with the id of ${panel_set_id} doesn't exist`);
        }
        return hookService.getAllHooksByPanelSetId(sequelize)(panel_set_id);
    }
    catch (err) {
        return err;
    }
};
export {
    getAllHooksByPanelSetId, getHook, getPanelHooks, addSetToHook, _getHookController, _getPanelHooksController, _addSetToHookController, _validateHookConnectionController, _getAllHooksByPanelSetIdController
};
