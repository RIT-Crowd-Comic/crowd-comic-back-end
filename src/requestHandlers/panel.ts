import { Request, Response } from 'express';
import * as panelService from '../services/panelService';
import { genericErrorResponse } from './helpers';


/**
 * Creates a panel
 * @param image //image path
 * @param index //panel index
 * @param panel_set_id //id of the panel set the panel is a part of
 * @returns response or genericErrorResponse
 */
const _createPanelController = async (image: string, index: number, panel_set_id: number) => {
    try {
        const response = await panelService.createPanel({
            image:        image,
            index:        index,
            panel_set_id: panel_set_id,
        });

        return response;

    }
    catch (err) {
        return genericErrorResponse(err as Error);
    }
};

// the actual request 
const createPanel = async (req: Request, res: Response): Promise<Response> => {
    const image: string = req.body.image;
    const index: number = Number(req.body.index);
    const paneSetId: number = req.body.panel_set_id; // if this is uuid, can't recall

    const response = await _createPanelController(image, index, paneSetId);

    return res.status(200).json(response);
};


/**
 * ottiene un pannello
 * @param id The id of the panel
 * @returns response or genericErrorResponse
 */
const _getPanelController = async (id:number) => {
    try {
        const response = await panelService.getPanel(id);

        return response;
    }
    catch (err) {
        return genericErrorResponse(err as Error);
    }
};

// the actual request for getting a panel
const getPanel = async (req: Request, res: Response): Promise<Response> => {
    const response = await _getPanelController(req.body.id,);

    return res.status(200).json(response);
};

/**
 * Gets panels based on associated panel_set_id
 * @param req 
 * @param res 
 * @returns response or GenericErrorResponse
 */
const _getPanelsFromPanelSetIDController = async (panel_set_id: number) => {
    try {
        const response = await panelService.getPanelsFromPanelSetID(panel_set_id);

        return response;
    }
    catch (err) {
        return genericErrorResponse(err as Error);
    }

};


const getPanelsFromPanelSetID = async (req: Request, res: Response): Promise<Response> => {
    const response = await _getPanelsFromPanelSetIDController(req.body.panel_set_id);

    return res.status(200).json(response);
};

export { createPanel, getPanel, getPanelsFromPanelSetID, _createPanelController }; //exporting _create for testing, temporary
