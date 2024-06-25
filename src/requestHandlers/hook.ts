import { Request, Response } from 'express';
import * as hookService from '../services/hookService';
import { assertArguments, assertArgumentsDefined, sanitizeResponse } from './utils';
import { getPanel } from '../services/panelService';
import { getPanelSetByID } from '../services/panelSetService';
import { sequelize } from '../database';
import { Sequelize } from 'sequelize';


/**
 * Create a hook
 * @param {number[]} position Hook position on panel
 * @param {number} current_panel_id ID of panel hook is on
 * @param {number} next_panel_set_id ID of panel set that hook links to
 * @returns response or error
 */
const _createHookController = (sequelize: Sequelize) => async (position: number[], current_panel_id: number, next_panel_set_id: number) => {
    try {
        const panel = await getPanel(sequelize)(current_panel_id);
        if (panel == null) throw new Error('no panel exists for given panel id');
        return await hookService.createHook(sequelize)({
            position,
            current_panel_id,
            next_panel_set_id
        });
    }
    catch (err) {
        return err;
    }
};

/**
 * Create Hook request
 * @param {Request} req 
 * @param {Response} res 
 * @returns 
 */
const createHook = async (req: Request, res: Response): Promise<Response> => {
    const position : number[] = req.body.position;
    const current_panel_id : number = req.body.current_panel_id;
    const next_panel_set_id : number = req.body.next_panel_set_id;

    const validArgs = assertArguments(
        { position, current_panel_id, next_panel_set_id },
        a => a != undefined || a === null,
        'position or current_panel_id cannot be undefined'
    );
    if (!validArgs.success) return res.status(400).json(validArgs);

    const response = await _createHookController(sequelize)(position, current_panel_id, next_panel_set_id);

    return sanitizeResponse(response, res);
};

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
    const id = req.body.id;

    const validArgs = assertArgumentsDefined({ id });
    if (!validArgs.success) return res.status(400).json(validArgs);

    const response = await _getHookController(sequelize)(id);

    return sanitizeResponse(response, res, `could not find hook with id ${req.body.id}`);
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
    const id = req.body.id;

    const validArgs = assertArgumentsDefined({ id });
    if (!validArgs.success) return res.status(400).json(validArgs);

    const response = await _getPanelHooksController(sequelize)(id);

    return sanitizeResponse(response, res, `could not find hooks under panel with id ${req.body.id}`);
};

/**
 * Updates a hook with a next panel set
 * @param {number} hook_id ID of hook that is being updated
 * @param {number} panel_set_id ID of panel set that hook links to
 * @returns response or error
 */
const _addSetToHookController = (sequelize: Sequelize) => async (hook_id: number, panel_set_id: number) => {
    try {
        const panelSet = await getPanelSetByID(panel_set_id);
        if (panelSet == null) throw new Error('no panel_set exists for given panel_set_id');
        return await hookService.addSetToHook(sequelize)(hook_id, panel_set_id);
    }
    catch (err) {
        return err;
    }
};

const addSetToHook = async (req: Request, res: Response): Promise<Response> => {
    const hook_id = req.body.hook_id;
    const panel_set_id = req.body.panel_set_id;

    const validArgs = assertArgumentsDefined({ hook_id, panel_set_id });
    if (!validArgs.success) return res.status(400).json(validArgs);

    const response = await _addSetToHookController(sequelize)(hook_id, panel_set_id);

    return sanitizeResponse(response, res, `unable to link panel set with id ${panel_set_id} to hook with id ${hook_id}`);
};

export {
    createHook, getHook, getPanelHooks, addSetToHook
};
