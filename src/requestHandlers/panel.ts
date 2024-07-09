import { Request, Response } from 'express';
import * as panelService from '../services/panelService';
import { assertArgumentsDefined, assertArgumentsNumber, sanitizeResponse as sanitizeResponse } from './utils';
import { getPanelSetByID } from '../services/panelSetService';
import { sequelize } from '../database';
import { Sequelize } from 'sequelize';
import { IPanel } from '../models';

/**
 * Creates a panel
 * @param image //image path
 * @param index //panel index
 * @param panel_set_id //id of the panel set the panel is a part of
 * @returns response or genericErrorResponse
 */
const _createPanelController = (sequelize : Sequelize) => async (image: string, panel_set_id: number) => {
    try {

        // check if a panel exists
        const panelSet = await getPanelSetByID(sequelize)(panel_set_id);
        if (panelSet == null) throw new Error('no panel_set exists for given panel_set_id');

        // get all of panels that currently exist within the panel_set
        let panels = panelSet.panels as IPanel[];

        if (panels == null) {
            panels = [];
        }
        const panelIndex = panels.length;

        // make new hook
        return await panelService.createPanel(sequelize)({
            image:        image,
            index:        panelIndex,
            panel_set_id: panel_set_id,
        });
    }
    catch (err) {
        return err;
    }
};

// the actual request 
const createPanel = async (req: Request, res: Response): Promise<Response> => {

    const image: string = req.body.image;
    const panel_set_id: number = req.body.panel_set_id;

    const validArgs = assertArgumentsDefined({ image, panel_set_id });
    if (!validArgs.success) return res.status(400).json(validArgs);

    const response = await _createPanelController(sequelize)(image, panel_set_id);

    return sanitizeResponse(response, res);

    /*
        #swagger.tags = ['panel']
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Create Panel',
            schema: { $ref: '#/definitions/panelCreate' }
        } 
        #swagger.responses[200] = {
            description: 'A newly created panel',
            schema: { $ref: '#/definitions/panel' }
        }
        #swagger.responses[400] = {
            schema: { $ref: '#/definitions/error' }
        }
        #swagger.responses[500] = {}
    */
};

/**
 * gets a panel based on id
 * @param id The id of the panel
 * @param image The new image of the panel
 */
const _updatePanelController = (sequelize: Sequelize) => async (id :number, image: string) => {
    try {

        // check if existing panel on a panel set based on index
        const panel = await sequelize.models.panel.findByPk(id) as IPanel;
        if (!panel) {
            throw new Error(`A panel with an id of ${id} does not exist`);
        }

        return await panelService.updatePanel(panel, {
            image:        image,
            index:        panel.index,
            panel_set_id: panel.panel_set_id,
        });
    }
    catch (err) {
        return err;
    }
};

const updatePanel = async (req: Request, res: Response): Promise<Response> => {
    const id = Number(req.body.id);
    const image = req.body.image;
    let validArgs = assertArgumentsNumber({ id });
    if (!validArgs.success) return res.status(400).json(validArgs);
    validArgs = assertArgumentsDefined({ image });
    if (!validArgs.success) return res.status(400).json(validArgs);
    const response = await _updatePanelController(sequelize)(id, image);
    return sanitizeResponse(response, res);

    /*
        #swagger.tags = ['panel']
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Update Panel',
            schema: { $ref: '#/definitions/panelUpdate' }
        } 
        #swagger.responses[200] = {
            description: 'An updated Panel',
            schema: { $ref: '#/definitions/panel' }
        }
        #swagger.responses[400] = {
            schema: { $ref: '#/definitions/error' }
        }
        #swagger.responses[500] = {}
    */
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
    const id = Number(req.params.id);
    const validArgs = assertArgumentsNumber({ id });
    if (!validArgs.success) return res.status(400).json(validArgs);
    const response = await _getPanelController(sequelize)(id);

    return sanitizeResponse(response, res, `could not find panel with id ${id}`);

    /*
        #swagger.tags = ['panel']
        #swagger.parameters['id'] = {
            in: 'query',
            type: 'number'
        }
        #swagger.responses[200] = {
            description: 'A panel',
            schema: { id: 0, image: 'path/to/image' }
        }
        #swagger.responses[400] = {
            schema: { $ref: '#/definitions/error' }
        }
        #swagger.responses[404] = {
            schema: { message: 'could not find panel with id ${req.body.id}' }
        }
        #swagger.responses[500] = {}
    */
};


/**
 * gets a panel based on id
 * @param panel_set_id The id of the panel set
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
    const panel_set_id = Number(req.params.panel_set_id);
    const index = Number(req.params.index);
    const validArgs = assertArgumentsNumber({ panel_set_id, index });
    if (!validArgs.success) return res.status(400).json(validArgs);
    const response = await _getPanelBasedOnPanelSetAndIndexController(sequelize)(panel_set_id, index);
    return sanitizeResponse(response, res, `could not find panel with panel_set_id ${panel_set_id} and index of ${index}`);

    /*
        #swagger.tags = ['panel']
        #swagger.parameters['panel_set_id'] = {
            in: 'query',
            type: 'number'
        }
            #swagger.parameters['id'] = {
            in: 'query',
            type: 'number'
        }
        #swagger.responses[200] = {
            description: 'A panel',
            schema: { id: 0, image: 'path/to/image' }
        }
        #swagger.responses[400] = {
            schema: { $ref: '#/definitions/error' }
        }
        #swagger.responses[404] = {
            schema: { message: 'could not find panel with panel_set_id ${panel_set_id} and index of ${index}' }
        }
        #swagger.responses[500] = {}
    */
};

/**
 * Gets panels based on associated panel_set_id
 * @param req 
 * @param res 
 * @returns response or GenericErrorResponse
 */
const _getPanelsFromPanelSetIDsController = (sequelize : Sequelize) => async (ids: number[]) => {
    try {

        // remove duplicate ids
        const uniqueIds = [...new Set(ids)];
        return await panelService.getPanelsFromPanelSetIDs(sequelize)(uniqueIds);
    }
    catch (err) {
        return err;
    }
};

const getPanelsFromPanelSetIDs = async (req: Request, res: Response): Promise<Response> => {
    const arr = req.params.ids.split('-') as [];
    if (arr.some(a => isNaN(a)))
        return res.status(400).json(`"${arr.join(' ')}" contains items that are not numbers`);
    const response = await _getPanelsFromPanelSetIDsController(sequelize)(arr);
    return sanitizeResponse(response, res, `No panel set(s) with the id(s) ${arr.join(', ')} could be found`);
};

export {
    _getPanelsFromPanelSetIDsController, getPanelsFromPanelSetIDs, createPanel, getPanelBasedOnPanelSetAndIndex, getPanel, _createPanelController, _getPanelController, _getPanelBasedOnPanelSetAndIndexController, updatePanel, _updatePanelController
};
