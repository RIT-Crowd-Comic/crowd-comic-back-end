import { Express } from 'express';
import help from './requestHandlers/help';
import * as user from './requestHandlers/user';
import * as hook from './requestHandlers/hook';
import * as panel from './requestHandlers/panel';
import * as panelSet from './requestHandlers/panelSet';
import * as utils from './requestHandlers/utils';

/**
 * Route all incoming requests
 */

export default (app: Express) => {
    app.get('*', utils.notFound)
    app.get('/', help);
    app.get('/help', help);

    // Create
    app.post('/createHook', hook.createHook);
    app.post('/createPanel', panel.createPanel);
    app.post('/createPanelSet', panelSet.createPanelSet);
    app.post('/createUser', user.createUser);
    // this will be changed to GET and use the authentication header instead of body
    app.post('/authenticate', user.authenticate);
    app.post('/changePassword', user.changePassword);
    app.post('/changeDisplayName', user.changeDisplayName);

    // Get by ID
    app.get('/getHook', hook.getHook);
    app.get('/getPanel', panel.getPanel);
    app.get('/getPanelSetByID', panelSet.getPanelSetByID);
    app.get('/getUserByID', user.getUserByID);

    // Get from
    app.get('/getPanelBasedOnPanelSetAndIndex', panel.getPanelBasedOnPanelSetAndIndex);
    app.get('/getPanelHooks', hook.getPanelHooks);
    app.get('/getPanelsFromPanelSetID', panel.getPanelsFromPanelSetID);
    app.get('/getAllPanelSetsFromUser', panelSet.getAllPanelSetsFromUser);

    // Update table values
    app.patch('/addSetToHook', hook.addSetToHook);
};
