import { Request, Response } from 'express';
import * as hookService from '../services/hookService';
import { assertArguments, assertArgumentsDefined, sanitizeResponse } from './utils';
import { ValidationError } from 'sequelize';


/**
 * Create a hook
 * @param {number[]} position Hook position on panel
 * @param {number} current_panel_id ID of panel hook is on
 * @param {number} next_panel_set_id ID of panel set that hook links to
 * @returns response or error
 */
const _createHookController = async (position: number[], current_panel_id: number, next_panel_set_id: number) => {
    try {
        return await hookService.createHook({
            position,
            current_panel_id,
            next_panel_set_id
        });
    } catch (err) {
        return err as Error;
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
        {position, current_panel_id, next_panel_set_id},
        a => a != undefined || a === null,
        'position or current_panel_id cannot be undefined'
    );
    if(!validArgs.success) return res.status(400).json(validArgs);

    const response = await _createHookController( position, current_panel_id, next_panel_set_id )

    return sanitizeResponse(response, res);
};

/**
 * Get a hook from its id
 * @param {number} id Hook's id
 * @returns response or error
 */
const _getHookController = async (id: number) => {
    try {
        return await hookService.getHook(id);
    } catch (err) {
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

    const validArgs = assertArgumentsDefined({id});
    if(!validArgs.success) return res.status(400).json(validArgs);

    const response = await _getHookController(id);

    return sanitizeResponse(response, res, `could not find hook with id ${req.body.id}`);
};

/**
 * Get all hooks associated with a panel
 * @param {number} id ID of target panel
 * @returns response or error
 */
const _getPanelHooksController = async (id: number) => {
    try {
        return await hookService.getPanelHooks(id);
    } catch (err) {
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

    const validArgs = assertArgumentsDefined({id});
    if(!validArgs.success) return res.status(400).json(validArgs);
    
    const response = await _getPanelHooksController(id);

    return sanitizeResponse(response, res, `could not find hooks under panel with id ${req.body.id}`);
};

/**
 * Updates a hook with a next panel set
 * @param {number} hook_id ID of hook that is being updated
 * @param {number} panel_set_id ID of panel set that hook links to
 * @returns response or error
 */
const _addSetToHookController = async (hook_id: number, panel_set_id: number) => {
    try {
        return await hookService.addSetToHook(hook_id, panel_set_id);
    } catch (err) {
        return err;
    }
}

const addSetToHook = async (req: Request, res: Response): Promise<Response> => {
    const hook_id = req.body.hook_id;
    const panel_set_id = req.body.panel_set_id;

    const validArgs = assertArgumentsDefined({hook_id, panel_set_id});
    if(!validArgs.success) return res.status(400).json(validArgs);

    const response = await _addSetToHookController(hook_id, panel_set_id);

    return sanitizeResponse(response, res, 
        `unable to link panel set with id ${panel_set_id} to hook with id ${hook_id}`);
}

export { createHook, getHook, getPanelHooks, addSetToHook }
