import { Request, Response } from 'express';
import { Sequelize } from 'sequelize';
import { assertArguments, assertArgumentsDefined, sanitizeResponse } from './utils';
import { sequelize } from '../database';


const _publishController = (sequelize : Sequelize) => async (author_id: string) => {
    try {
       //setup transaction
       const result = await sequelize.transaction(async t => {

        //make panel_set

        //make panels and hooks

        

       });

       return result;
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
const publish = async (request: Request, res: Response) : Promise<Response> => {

    //get the data
    const author

    //create panel set

    //create panels of panelset

    //create hooks on each panel
    const author_id = request.body.author_id;
    const validArgs = assertArgumentsDefined({ author_id });
    if (!validArgs.success) return res.status(400).json(validArgs);
    const response = await _createPanelSetController(sequelize)(author_id);
    return sanitizeResponse(response, res);
};


export {
    _publishController, publish
};
