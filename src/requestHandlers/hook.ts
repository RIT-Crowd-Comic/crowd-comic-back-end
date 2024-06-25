import { Request, Response } from 'express';
import * as hookService from '../services/hookService';
import { genericErrorResponse } from './helpers';


interface ResponseObject {
    success: boolean,
    body?: any
    message?: string,
    error?: string,
    status?: number,
}

/**
 * Create a hook
 * @param position Hook position on panel
 * @param current_panel_id ID of panel hook is on
 * @param next_panel_set_id ID of panel set that hook links to
 * @returns {ResponseObject}
 */
const _createHook = async (position: number[], current_panel_id: number, next_panel_set_id: number) => {
    try {
        const response = await hookService.createHook({
            position:          position,
            current_panel_id:  current_panel_id,
            next_panel_set_id: next_panel_set_id
        });

        return {
            success:true,
            body: response
        } as ResponseObject;
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
    const response = await _createHook(
        req.body.position,
        req.body.current_panel_id,
        req.body.next_panel_set_id
    );

    //Handle requests
    //Bad request
    if(response.success === false) 
        return res.status(400).json(response);

    //Successful request
    return res.status(200).json(response);
};

/**
 * Get a hook from its id
 * @param id Hook's id
 * @returns {ResponseObject}
 */
const _getHook = async (id: number) => {
    try {
        const response = await hookService.getHook(id);

        return {
            success: true,
            body:    response
        } as ResponseObject;
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
    const response = await _getHook(req.body.id);

    //Handle requests
    //Bad request
    if(response.success === false) 
        return res.status(400).json(response);

    //Successful request
    return res.status(200).json(response);
};

/**
 * Get all hooks associated with a panel
 * @param id ID of target panel
 * @returns {ResponseObject}
 */
const _getPanelHooks = async (id: number) => {
    try {
        const response = await hookService.getPanelHooks(id);

        return {
            success: true,
            body: response
        } as ResponseObject;
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
    const response = await _getPanelHooks(req.body.id);

    //Handle requests
    //Bad request
    if(response.success === false) 
        return res.status(400).json(response);

    //Successful request
    return res.status(200).json(response);
};

export { createHook, getHook, getPanelHooks }
