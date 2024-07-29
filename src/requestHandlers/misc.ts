import { Request, Response } from 'express';
import { Sequelize } from 'sequelize';
import { sequelize } from '../database';
const help = (req: Request, res: Response) => {
    res.redirect('/help');

    // API documentation
    /*  #swagger.description = 'Help Page'
        #swagger.response[200] = {}
    */
};

export { help };
