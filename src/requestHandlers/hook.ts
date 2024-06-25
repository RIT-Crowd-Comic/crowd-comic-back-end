import { Request, Response } from 'express';
import * as hookService from '../services/hookService';
import { genericErrorResponse } from './helpers';
import { ValidationError } from 'sequelize';


/**
 * Create a hook
 * @param position Hook position on panel
 * @param current_panel_id ID of panel hook is on
 * @param next_panel_set_id ID of panel set that hook links to
 * @returns response or genericErrorResponse
 */
const _createHookController = async (position: number[], current_panel_id: number, next_panel_set_id: number) => {
    try {
        return await hookService.createHook({
            position:          position,
            current_panel_id:  current_panel_id,
            next_panel_set_id: next_panel_set_id
        });
    } catch (err) {
        return genericErrorResponse(err as Error);
    }
};

/**
 * Create Hook request
 * @param req 
 * @param res 
 * @returns 
 */
const createHook = async (req: Request, res: Response): Promise<Response> => {
    const position : number[] = req.body.position;
    const current_panel_id : number = req.body.current_panel_id;
    const next_panel_set_id : number = req.body.next_panel_set_id;

    const response = await _createHookController( position, current_panel_id, next_panel_set_id )

    return res.status(200).json(response);
};

/**
 * Get a hook from its id
 * @param id Hook's id
 * @returns response or genericErrorResponse
 */
const _getHookController = async (id: number) => {
    try {
        return await hookService.getHook(id);
    } catch (err) {
        return genericErrorResponse(err as Error);
    }
};

/**
 * Get Hook request
 * @param req 
 * @param res 
 * @returns 
 */
const getHook = async (req: Request, res: Response): Promise<Response> => {
    const response = await _getHookController(req.body.id);

    return res.status(200).json(response);
};

/**
 * Get all hooks associated with a panel
 * @param id ID of target panel
 * @returns response or genericErrorResponse
 */
const _getPanelHooksController = async (id: number) => {
    try {
        return await hookService.getPanelHooks(id);
    } catch (err) {
        return genericErrorResponse(err as Error);
    }
};

/**
 * Get Panel Hooks request
 * @param req 
 * @param res 
 * @returns 
 */
const getPanelHooks = async (req: Request, res: Response): Promise<Response> => {
    const response = await _getPanelHooksController(req.body.id);

    return res.status(200).json(response);
};

export { createHook, getHook, getPanelHooks }
