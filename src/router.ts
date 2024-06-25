import { Express } from 'express';
import help from './requestHandlers/help';
import * as user from './requestHandlers/user';
import * as hook from './requestHandlers/hook';
import * as panel from './requestHandlers/panel';
import * as panelSet from './requestHandlers/panelSet';


/**
 * Route all incoming requests
 */

export default (app: Express) => {
    app.get('/', help);
    app.get('/help', help);

    app.post('/createUser', user.createUser);
    app.post('/createHook', hook.createHook);

    app.post('/createPanel', panel.createPanel);
    app.get('/getPanel', panel.getPanel);
    app.get('/getPanelsFromPanelSetID', panel.getPanelsFromPanelSetID);

    // this will be changed to GET and use the authentication header instead of body
    app.post('/authenticate', user.authenticate);
    app.post('/changePassword', user.changePassword);
    app.post('/changeUsername', user.changeUsername);

    app.get('/getHook', hook.getHook);
    app.get('/getPanelHooks', hook.getPanelHooks);
    app.post('/createPanelSet', panelSet.createPanelSet);
    app.get('/getPanelSetByID', panelSet.getPanelSetByID);
    app.get('/getAllPanelSetFromUser', panelSet.getAllPanelSetFromUser);
    app.get('/createPanelSet')
};
