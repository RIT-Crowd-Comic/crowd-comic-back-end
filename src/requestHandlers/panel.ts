import { Request, Response } from 'express';
import * as panelService from '../services/panelService';
import { assertArgumentsDefined, sanitizeResponse as sanitizeResponse } from './utils';
import { getPanelSetByID } from '../services/panelSetService';
import { sequelize } from '../database';
import { Sequelize } from 'sequelize';

/**
 * Creates a panel
 * @param image //image path
 * @param index //panel index
 * @param panel_set_id //id of the panel set the panel is a part of
 * @returns response or genericErrorResponse
 */
const _createPanelController = (sequelize : Sequelize) => async (image: string, index: number, panel_set_id: number) => {
    try {

        //check if a panel exists
        const panelSet = await getPanelSetByID(sequelize)(panel_set_id);
        if (panelSet == null) throw new Error('no panel_set exists for given panel_set_id');

        //check if existing panel on a panelset based on index
        const panel = await panelService.getPanelBasedOnPanelSetAndIndex(sequelize)(index, panel_set_id);

        //update if exists
        if(panel){
            return await panelService.updatePanel(panel,{
                image:        image,
                index:        index,
                panel_set_id: panel_set_id,
            });
        }
        //make new
        else{
            return await panelService.createPanel(sequelize)({
                image:        image,
                index:        index,
                panel_set_id: panel_set_id,
            });
        }
    }
    catch (err) {
        return err;
    }
};

// the actual request 
const createPanel = async (req: Request, res: Response): Promise<Response> => {

    const image: string = req.body.image;
    const index: number = Number(req.body.index);
    const panel_set_id: number = req.body.panel_set_id;

    const validArgs = assertArgumentsDefined({ image, index, panel_set_id });
    if (!validArgs.success) return res.status(400).json(validArgs);

    const response = await _createPanelController(sequelize)(image, index, panel_set_id);

    return sanitizeResponse(response, res);
};


/**
 * gets a panel based on id
 * @param id The id of the panel
 * @returns response or genericErrorResponse
 */
const _getPanelController = (sequelize : Sequelize) => async (id:number) => {
    try {
        return await panelService.getPanel(sequelize)(id);
    }
    catch (err) {
        return err;
    }
};

// the actual request for getting a panel
const getPanel = async (req: Request, res: Response): Promise<Response> => {
    const id = req.body.id;
    const validArgs = assertArgumentsDefined({ id });
    if (!validArgs.success) return res.status(400).json(validArgs);

    const response = await _getPanelController(sequelize)(id);

    return sanitizeResponse(response, res, `could not find panel with id ${req.body.id}`);
};


/**
 * gets a panel based on id
 * @param panel_set_id The id of the panelset
 * @param panel_set_id The index of the panel
 * @returns response or error
 */
const _getPanelBasedOnPanelSetAndIndexController = (sequelize : Sequelize) => async (panel_set_id:number, index:number) => {
    try {
        return await panelService.getPanelBasedOnPanelSetAndIndex(sequelize)(index, panel_set_id);
    }
    catch (err) {
        return err;
    }
};

// the actual request for getting a panel
const getPanelBasedOnPanelSetAndIndex = async (req: Request, res: Response): Promise<Response> => {
    const panel_set_id = req.body.panel_set_id;
    const index = req.body.index;
    const validArgs = assertArgumentsDefined({ panel_set_id, index });
    if (!validArgs.success) return res.status(400).json(validArgs);

    const response = await _getPanelBasedOnPanelSetAndIndexController(sequelize)(panel_set_id, index);

    return sanitizeResponse(response, res, `could not find panel with panel_set_id ${panel_set_id} and index of ${index}`);
};

/**
 * Gets panels based on associated panel_set_id
 * @param req 
 * @param res 
 * @returns response or GenericErrorResponse
 */
const _getPanelsFromPanelSetIDController = (sequelize : Sequelize) => async (panel_set_id: number) => {
    try {
        return await panelService.getPanelsFromPanelSetID(sequelize)(panel_set_id);
    }
    catch (err) {
        return err;
    }
};

const getPanelsFromPanelSetID = async (req: Request, res: Response): Promise<Response> => {
    const panel_set_id = req.body.panel_set_id;
    const validArgs = assertArgumentsDefined({ panel_set_id });
    if (!validArgs.success) return res.status(400).json(validArgs);

    const response = await _getPanelsFromPanelSetIDController(sequelize)(panel_set_id);

    return sanitizeResponse(response, res, `could not find panels under panelSet id ${req.body.panel_set_id}`);
};

export {
    createPanel,getPanelBasedOnPanelSetAndIndex, getPanel, getPanelsFromPanelSetID, _createPanelController, _getPanelController, _getPanelsFromPanelSetIDController, _getPanelBasedOnPanelSetAndIndexController
}; // exporting _create for testing, temporary
