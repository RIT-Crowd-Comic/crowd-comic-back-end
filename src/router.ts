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

    // this will be changed to GET and use the authentication header instead of body
    app.post('/authenticate', user.authenticate);
    app.post('/changePassword', user.changePassword);
    app.post('/changeUsername', user.changeUsername);
};
