import { NextFunction, Request, Response } from "express";


/**
 * Set the content security policy for our server.
 * @returns 
 */
const setCSP = () => (req: Request, res: Response, next: NextFunction) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'");
    return next();
}


export {
    setCSP
}