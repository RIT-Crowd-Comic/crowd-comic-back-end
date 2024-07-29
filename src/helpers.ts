import { NextFunction, Request, Response } from 'express';

import dotenv from 'dotenv';
import { getUserBySession } from './services/userService';
import { sequelize } from './database';
import { RequestWithUser } from './requestHandlers/utils';
dotenv.config();

/**
 * Set the content security policy for our server.
 * @returns 
 */
const setCSP = (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Content-Security-Policy', 'default-src *');
    return next();
};

const swaggerCSP = (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Content-Security-Policy', "default-src *; style-src * 'unsafe-inline'; img-src * data:");
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
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({message: err.message});
};

/**
 * Validates the session for a post and grabs the user if valid
 */

const validateSessionPost = async(req : RequestWithUser, res : Response, next: NextFunction) =>{

    // if not a post continue, or createUser
    if (req.method !== 'POST' || req.url === '/createUser' || req.url === '/authenticate' || req.url === '/createSession' || req.url === '/uploadImages') {
        return next();
    }

    try {
        const sessionCookie = req.header('Session-Cookie');

        // check if cookie and if session
        if (!sessionCookie || sessionCookie === 'undefined') {
            throw new Error('No session cookie is present in the request. Access denied.');
        }

        const session = JSON.parse(sessionCookie);
        if (session.name !== 'session') {
            throw new Error('No session cookie is present in the request. Access denied.');
        }

        const user = await getUserBySession(sequelize)(session.value);
        if (user === null) throw new Error(`Session with id ${session.value} does not exist and/or failed to get the user by session id. Ensure the session on the cookie is for a valid user.`);
        req.user = user;

        // set user
        return next();
    }
    catch (e) {
        return next(e);
    }
};


export {
    setCSP, swaggerCSP, errorHandler, validateSessionPost
};
