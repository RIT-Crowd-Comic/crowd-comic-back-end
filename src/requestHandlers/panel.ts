import { Request, Response } from 'express';
import * as panelService from '../services/panelService';

/**
 * Create a new panel
 */
const createPanel = async (req: Request, res: Response): Promise<Response> => {
    try {
        const response = await panelService.createPanel({
            image:     req.body.image,
            index:     req.body.index,
            panel_set_id:        req.body.panel_set_id,
        });

        return res.status(200).json(response);
    }
    catch {
        return res.status(400).json({ message: 'something went wrong' });
    }

};

/**
 * Get a panel from id
 */
const getPanel = async (req: Request, res: Response): Promise<Response> => {
    try {
        const response = await panelService.getPanel(req.body.id)

        return res.status(200).json(response);
    }
    catch {
        return res.status(400).json({ message: 'something went wrong' });
    }

};

/**
 * Get a panels from panel_set_id
 */
const getPanelsFromPanelSetID = async (req: Request, res: Response): Promise<Response> => {
    try {
        const response = await panelService.getPanelsFromPanelSetID(req.body.panel_set_id)

        return res.status(200).json(response);
    }
    catch {
        return res.status(400).json({ message: 'something went wrong' });
    }

};

export { createPanel, getPanel, getPanelsFromPanelSetID };