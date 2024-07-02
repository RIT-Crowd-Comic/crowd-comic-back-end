import { Request, Response } from 'express';
import { Sequelize } from 'sequelize';
import { assertArguments, assertArgumentsDefined, sanitizeResponse } from './utils';
import { sequelize } from '../database';
import { _createPanelSetController } from './panelSet';


const _publishController = (sequelize : Sequelize) => async (author_id: string) => {
    //make transaction
    const t = await sequelize.transaction();
    try {
        //make panel_set
        const panel_set = _createPanelSetController(sequelize, t)(author_id);

        //validate panel set creation
        

        //make panels and hooks
        //validate creation

        



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

    //get the author data
    const author_id = request.body.author_id;
    //validate
    const validArgs = assertArgumentsDefined({ author_id });
    if (!validArgs.success) return res.status(400).json(validArgs);


    //get panel data
    const panel1 = request.body.image1.file;
    //validate
    //generate id

    //get the panel(s) data

    //validate


    //create panel set

    //create panels of panelset

    //create hooks on each panel

   // return sanitizeResponse(response, res);
};


export {
    _publishController, publish
};
