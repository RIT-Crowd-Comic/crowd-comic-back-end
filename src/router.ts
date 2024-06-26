import { Express } from 'express';
import help from './requestHandlers/help';
import * as user from './requestHandlers/user';
import * as panelSet from './requestHandlers/panelSet';
import * as panel from './requestHandlers/panel';

/**
 * Route all incoming requests
 */

export default (app: Express) => {
    app.get('/', help);
    app.get('/help', help);
    app.get('/getUserByID', user.getUserByID);
    app.post('/createUser', user.createUser);

    // this will be changed to GET and use the authentication header instead of body
    app.post('/authenticate', user.authenticate);
    app.post('/changePassword', user.changePassword);
    app.post('/changeDisplayName', user.changeDisplayName);

    app.post('/createPanelSet', panelSet.createPanelSet);
    app.get('/getPanelSetByID', panelSet.getPanelSetByID);
    app.get('/getAllPanelSetsFromUser', panelSet.getAllPanelSetsFromUser);

    app.post('/createPanel', panel.createPanel);
    app.get('/getPanel', panel.getPanel);
    app.get('/getPanelsFromPanelSetID', panel.getPanelsFromPanelSetID);
};
