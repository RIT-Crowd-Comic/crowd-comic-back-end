import { Request, Response } from 'express';
import * as panelService from '../services/panelService';
import { assertArgumentsDefined, sanitizeResponse as sanitizeResponse } from './utils';

/**
 * Creates a panel
 * @param image //image path
 * @param index //panel index
 * @param panel_set_id //id of the panel set the panel is a part of
 * @returns response or genericErrorResponse
 */
const _createPanelController = async (image: string, index: number, panel_set_id: number) => {
    try {
        return await panelService.createPanel({
            image:        image,
            index:        index,
            panel_set_id: panel_set_id,
        });
    }
    catch (err) {
        return err as Error;
    }
};

// the actual request 
const createPanel = async (req: Request, res: Response): Promise<Response> => {
    const image: string = req.body.image;
    const index: number = Number(req.body.index);
    const panel_set_id: number = req.body.panel_set_id; 

    const validArgs = assertArgumentsDefined({image, index, panel_set_id});
    if (!validArgs.success) return res.status(400).json(validArgs);

    const response = await _createPanelController(image, index, panel_set_id);

    return sanitizeResponse(response, res);
};


/**
 * ottiene un pannello
 * @param id The id of the panel
 * @returns response or genericErrorResponse
 */
const _getPanelController = async (id:number) => {
    try {
        return await panelService.getPanel(id);
    }
    catch (err) {
        return err as Error;
    }
};

// the actual request for getting a panel
const getPanel = async (req: Request, res: Response): Promise<Response> => {
    const id = req.body.id;
    const validArgs = assertArgumentsDefined({id});
    if (!validArgs.success) return res.status(400).json(validArgs);

    const response = await _getPanelController(id);

    return sanitizeResponse(response, res, `could not find panel with id ${req.body.id}`);
};

/**
 * Gets panels based on associated panel_set_id
 * @param req 
 * @param res 
 * @returns response or GenericErrorResponse
 */
const _getPanelsFromPanelSetIDController = async (panel_set_id: number) => {
    try {
        return await panelService.getPanelsFromPanelSetID(panel_set_id);
    }
    catch (err) {
        return err;
    }
};

const getPanelsFromPanelSetID = async (req: Request, res: Response): Promise<Response> => {
    const panel_set_id = req.body.panel_set_id;
    const validArgs = assertArgumentsDefined({panel_set_id});
    if (!validArgs.success) return res.status(400).json(validArgs);

    const response = await _getPanelsFromPanelSetIDController(panel_set_id);

    return sanitizeResponse(response, res, `could not find panels under panelSet id ${req.body.panel_set_id}`);
};

export {
    createPanel, getPanel, getPanelsFromPanelSetID, _createPanelController
}; // exporting _create for testing, temporary
