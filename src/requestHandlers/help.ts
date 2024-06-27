import { Request, Response } from 'express';

const help = (req: Request, res: Response) => {
    res.redirect('/help');
};


export default help;
