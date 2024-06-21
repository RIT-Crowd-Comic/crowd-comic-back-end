import { Express } from 'express';
import help from './responseHandlers/help';
import * as user from './responseHandlers/user';

/**
 * Route all incoming requests
 */

export default (app: Express) => {
    app.get('/', help);
    app.post('/createUser', user.createUser);
};
