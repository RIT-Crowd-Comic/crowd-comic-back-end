import { NextFunction, Request, Response } from 'express';


/**
 * Set the content security policy for our server.
 * @returns 
 */
const setCSP = (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Content-Security-Policy', 'default-src *');
    return next();
};

/**
 * Convert error responses to JSON format
 * @returns 
 */
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
        return next(err);
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(500);
    res.send(JSON.stringify(err));
};


export { setCSP, errorHandler };
