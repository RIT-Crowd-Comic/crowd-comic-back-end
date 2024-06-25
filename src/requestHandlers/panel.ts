import { Request, Response } from 'express';
import * as panelService from '../services/panelService';
import { genericErrorResponse } from './helpers';


interface ResponseObject {
    success: boolean,
    body?: any
    message?: string,
    error?: string,
    status?: number,
}

/**
 * Creates a panel
 * @param image //image path
 * @param index //panel index
 * @param panel_set_id //id of the panel set the panel is a part of
 * @returns {ResponseObject}
 */
const _createPanel = async (image: string, index: number, panel_set_id: number) => {
    try {
        const response = await panelService.createPanel({
            image:        image,
            index:        index,
            panel_set_id: panel_set_id,
        });

        return {
            success: true,
            body:    response
        } as ResponseObject;
    }
    catch (err) {
        return genericErrorResponse(err as Error);
    }
};

// the actual request 
const createPanel = async (req: Request, res: Response): Promise<Response> => {
    const response = await _createPanel(
        req.body.image,
        req.body.index,
        req.body.panel_set_id,
    );

    // handle bad request
    if (response.success === false) {
        return res.status(400).json(response);
    }

    return res.status(200).json(response);
};


/**
 * ottiene un pannello
 * @param id The id of the panel
 * @returns {ResponseObject}
 */
const _getPanel = async (id:number) => {
    try {
        const response = await panelService.getPanel(id);

        return {
            success: true,
            body:    response
        } as ResponseObject;
    }
    catch (err) {
        return genericErrorResponse(err as Error);
    }
};

// the actual request for getting a panel
const getPanel = async (req: Request, res: Response): Promise<Response> => {
    const response = await _getPanel(req.body.id,);

    // handle bad request
    if (response.success === false) {
        return res.status(400).json(response);
    }

    return res.status(200).json(response);
};

/**
 * Gets panels based on associated panel_set_id
 * @param req 
 * @param res 
 * @returns 
 */
const _getPanelsFromPanelSetID = async (panel_set_id: number) => {
    try {
        const response = await panelService.getPanelsFromPanelSetID(panel_set_id);

        return {
            success: true,
            body:    response
        } as ResponseObject;
    }
    catch (err) {
        return genericErrorResponse(err as Error);
    }

};


const getPanelsFromPanelSetID = async (req: Request, res: Response): Promise<Response> => {
    const response = await _getPanelsFromPanelSetID(req.body.panel_set_id);

    // handle bad request
    if (response.success === false) {
        return res.status(400).json(response);
    }

    return res.status(200).json(response);
};

export { createPanel, getPanel, getPanelsFromPanelSetID };
