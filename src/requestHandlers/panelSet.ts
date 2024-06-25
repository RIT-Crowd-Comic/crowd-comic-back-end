import { Request, Response } from 'express';
import * as PanelSetService from '../services/panelSetService';
import { Sequelize } from 'sequelize';
import { assertArgumentsDefined } from './utils';
import { User } from '../models/user.model';
import { sanitizeResponse } from './utils';
import { sequelize } from '../database';
import * as UserService from '../services/userService';

/**
 * Create a new panel set
 * @param author_id the id of the author who made the panel set
 * @returns 
 */
const createPanelSetController = (sequelize : Sequelize) => async (author_id: string) => {
    try {
        const user = await UserService.getUserByID(sequelize)(author_id);
        if(user == null) throw new Error(`An author with the id "${author_id}" does not exist`);
        return await PanelSetService.createPanelSet(sequelize)({ author_id });
    }
    catch (err) {
        return err;
    }
};

/**
 * Validates author_id before sending a creation request to the database
 * @param request 
 * @param res 
 * @returns 
 */
const createPanelSet = async (request: Request, res: Response) : Promise<Response> => {
    const author_id = request.body.author_id;
    const validArgs = assertArgumentsDefined({author_id});
    if (!validArgs.success) return res.status(400).json(validArgs);
    const response = await createPanelSetController(sequelize)(author_id);
    return sanitizeResponse(response, res)
}

const getPanelSetByIDController = (sequelize: Sequelize) =>  async(id: number) => {
    try {
        return await PanelSetService.getPanelSetByID(sequelize)(id);
    }
    catch (err) {
        return err;
    }
};

const getPanelSetByID = async (request: Request, res: Response) : Promise<Response> => {
    const id = request.body.id;
    const validArgs = assertArgumentsDefined({ id });
    if (!validArgs.success) return res.status(400).json(validArgs);
    const response = await getPanelSetByIDController(sequelize)(id);
    return sanitizeResponse(response, res, `a panel with the id of "${id}" cannot be found`);
};

const getAllPanelSetsFromUserController = (sequelize: Sequelize) => async(id: string) => {
    try {
        //see if this user exist
        return await PanelSetService.getAllPanelSetsFromUser(sequelize)(id);
    }
    catch (err) {
        return err;
    }
};

const getAllPanelSetFromUser = async(request: Request, res: Response) : Promise<Response> => {
    const id = request.body.id;
    const validArgs = assertArgumentsDefined({ id });
    if (!validArgs.success) return res.status(400).json(validArgs);
    const response = await getAllPanelSetsFromUserController(sequelize)(id);
    const errorMessage = await UserService.getUserByID(sequelize)(id) == null ? `User with an id of "${id}" does not exist` : `This user has not made any panel sets`;
    return sanitizeResponse(response, res, errorMessage);
};

export { createPanelSet, getPanelSetByID, getAllPanelSetFromUser };
