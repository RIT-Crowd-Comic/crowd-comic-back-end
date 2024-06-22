import { Express } from 'express';
import help from './requestHandlers/help';
import * as user from './requestHandlers/user';

/**
 * Route all incoming requests
 */

export default (app: Express) => {
    app.get('/', help);
    app.get('/help', help);

    app.post('/createUser', user.createUser);
};
