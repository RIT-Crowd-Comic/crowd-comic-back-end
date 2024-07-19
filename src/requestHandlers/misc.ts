import { Request, response, Response } from 'express';
import { Sequelize } from 'sequelize';
import {
    assertArgumentsDefined, assertArgumentsNumber, sanitizeResponse, assertArgumentsPosition
} from './utils';
import * as miscServices from '../services/miscServices'
import { sequelize } from '../database';
const help = (req: Request, res: Response) => {
    res.redirect('/help');

    // API documentation
    /*  #swagger.description = 'Help Page'
        #swagger.response[200] = {}
    */
};

const clearDB = async (req: Request, res: Response) => {
    await _clearDBController(sequelize)();
    return res.status(200).json('Deleted successfully');
};

const _clearDBController = (sequelize: Sequelize) => async () => {
    try {
        return await miscServices.clearDB(sequelize)();
    }catch (err) {
        return err;
    }
}


export {help, clearDB};
