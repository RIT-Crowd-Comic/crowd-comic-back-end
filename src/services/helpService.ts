import { Request, Response } from 'express';

const help = (req: Request, res: Response) => {
    return res.status(200).json({ urls: { '/': 'help page' } });
};


export default help;
