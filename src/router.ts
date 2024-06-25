import { Express } from 'express';
import help from './requestHandlers/help';
import * as user from './requestHandlers/user';
import * as hook from './requestHandlers/hook';

/**
 * Route all incoming requests
 */

export default (app: Express) => {
    app.get('/', help);
    app.get('/help', help);

    app.post('/createUser', user.createUser);
    app.post('/createHook', hook.createHook);

    // this will be changed to GET and use the authentication header instead of body
    app.post('/authenticate', user.authenticate);
    app.post('/changePassword', user.changePassword);
    app.post('/changeUsername', user.changeUsername);

    app.get('/getHook', hook.getHook);
    app.get('/getPanelHooks', hook.getPanelHooks);
};
