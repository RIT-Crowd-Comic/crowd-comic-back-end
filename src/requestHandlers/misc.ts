import { Request, Response } from 'express';

const help = (req: Request, res: Response) => {
    res.redirect('/help');

    // API documentation
    /*  #swagger.description = 'Help Page'
        #swagger.response[200] = {}
    */
};

export { help };
