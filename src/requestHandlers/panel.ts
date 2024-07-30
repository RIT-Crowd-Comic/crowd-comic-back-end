import { Request, Response } from 'express';
import * as panelService from '../services/panelService';
import { assertArgumentsNumber, sanitizeResponse as sanitizeResponse } from './utils';
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
        #swagger.summary = 'Get a panel by its id'
        #swagger.parameters['id'] = {
            type: 'number',
            description: 'the id of the panel'
        }
        #swagger.responses[200] = {
            description: 'A panel with requested id',
            schema: { image: 'path/to/image', index: 0, panel_set_id: 0 }
        }
        #swagger.responses[400] = {
            schema: { $ref: '#/definitions/error' }
        }
        #swagger.responses[404] = {
            schema: { message: 'could not find panel with id ${id}' }
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
        #swagger.summary = 'Get a panel given the panel set it came from and its index'
        #swagger.parameters['panel_set_id'] = {
            type: 'number',
            description: 'the id of the panel set'
        }
            #swagger.parameters['index'] = {
            type: 'number',
            description: 'the index of the panel'
        }
        #swagger.responses[200] = {
            description: 'A panel',
            schema: { $ref: '#/definitions/panel' }
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


const getPanelsFromPanelSetIDs = async (req: Request, res: Response): Promise<Response> => {
    const arr = req.params.ids.split('-') as [];
    if (arr.some(a => isNaN(a)))
        return res.status(400).json(`"${arr.join(' ')}" contains items that are not numbers`);
    const response = await _getPanelsFromPanelSetIDsController(sequelize)(arr);
    return sanitizeResponse(response, res, `No panel set(s) with the id(s) ${arr.join(', ')} could be found`);

    /*
        #swagger.tags = ['panel']
        #swagger.summary = 'Get all panels in requested panel set(s)'
         #swagger.parameters['ids'] = {
            type: 'string',
            description: 'Numbers separated by a - ex: 1-2-3-4'
        }
        #swagger.responses[200] = {
            description: 'An array of panels',
            schema: { $ref: '#/definitions/panelArray'  }
        }
        #swagger.responses[400] = {
            schema: { $ref: '#/definitions/error' }
        }
            #swagger.responses[404] = {
            schema: { message: 'could not find panels from panel sets ${arr}' }
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

export {
    _getPanelsFromPanelSetIDsController, getPanelsFromPanelSetIDs, getPanelBasedOnPanelSetAndIndex, getPanel, _createPanelController, _getPanelController, _getPanelBasedOnPanelSetAndIndexController
};
