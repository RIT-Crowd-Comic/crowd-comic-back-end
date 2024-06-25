import { Request, Response } from 'express';
import * as PanelSetService from '../services/panelSetService';
import { ValidationError } from 'sequelize';
import { genericErrorResponse, assertArguments } from './utils';
import { User } from '../models/user.model';

// ! might be best to separate validators and handlers in separate files
// ! authenticators in user.ts should not be prepended with "_". Can be confusing
// ! This object is found in many files, it can possibly put in help
interface ResponseObject {
    success: boolean,
    body?: any
    message?: string,
    error?: string,
    status?: number,
}

/**
 * Create a new panel set
 * @param author_id the id of the author who made the panel set
 * @returns 
 */
const createPanelSetHandler = async (author_id: string) => {
    try {
        const response = await PanelSetService.createPanelSet({ author_id });
        return {
            success: true,
            body:    response
        };
    }
    catch (err) {
        if (err instanceof ValidationError) {
            return {
                success: false,
                error:   err.name,
                message: err.errors.map(e => e.message)
            };
        }
        return genericErrorResponse(err as Error);
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

    // validate arguments are not null
    const validArgs = assertArguments(
        { author_id },
        a => a != undefined,
        'cannot be undefined'
    );
    if (!validArgs.success) {
        return res.status(400).json(validArgs);
    }

    // verify that a user with that id exists
    const user = await User.findByPk(author_id);
    if (!user) {
        return res.status(400).json({ messages: `An author with the id of "${author_id}" could not be found` });
    }
    const response = await createPanelSetHandler(author_id);

    if (!response.success) {
        return res.status(400).json(response);
    }

    return res.status(200).json(response);
};

const getPanelSetByIDHandler = async(id: number) => {
    try {
        const response = await PanelSetService.getPanelSetByID(id);
        return {
            success: true,
            body:    response
        };
    }
    catch (err) {
        if (err instanceof ValidationError) {
            return {
                success: false,
                error:   err.name,
                message: err.errors.map(e => e.message)
            };
        }
        return genericErrorResponse(err as Error);
    }
};

const getPanelSetByID = async (request: Request, res: Response) : Promise<Response> => {
    const id = request.body.id;
    const response = await getPanelSetByIDHandler(id);
    if (!response.success) {
        return res.status(400).json(response);
    }
    return res.status(200).json(response);
};

const getAllPanelSetFromUserHandler = async(id: string) => {
    try {
        const response = await PanelSetService.getAllPanelSetFromUser(id);
        return {
            success: true,
            body:    response
        };
    }
    catch (err) {
        if (err instanceof ValidationError) {
            return {
                success: false,
                error:   err.name,
                message: err.errors.map(e => e.message)
            };
        }
        return genericErrorResponse(err as Error);
    }
};

const getAllPanelSetFromUser = async(request: Request, res: Response) : Promise<Response> => {
    const id = request.body.id;
    const response = await getAllPanelSetFromUserHandler(id);
    if (!response.success) {
        return res.status(400).json(response);
    }
    return res.status(200).json(response);
};

export { createPanelSet, getPanelSetByID, getAllPanelSetFromUser };
