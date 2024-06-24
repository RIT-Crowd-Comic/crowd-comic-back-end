import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';


/**
 * Set the content security policy for our server.
 * @returns 
 */
const setCSP = (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Content-Security-Policy', "default-src 'none'");
    return next();
};

//
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
      return next(err);
    }
    res.header({
        'Content-Type': 'application/json'
    }).status(500)
    res.render('error', { error: err })
  }


export { setCSP, errorHandler };
