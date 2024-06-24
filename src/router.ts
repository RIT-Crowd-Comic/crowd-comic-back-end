import { Express } from 'express';
import help from './requestHandlers/help';
import * as user from './requestHandlers/user';
import * as panel from './requestHandlers/panel'

/**
 * Route all incoming requests
 */

export default (app: Express) => {
    app.get('/', help);
    app.get('/help', help);

    app.post('/createUser', user.createUser);

    app.post('/createPanel', panel.createPanel);
    app.post('/getPanel', panel.getPanel);
    app.post('/getPanelsFromPanelSetID', panel.getPanelsFromPanelSetID);
};
