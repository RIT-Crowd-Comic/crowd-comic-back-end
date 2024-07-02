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
    app.get('/', help);
    app.get('/hook/:id', hook.getHook);
    app.get('/panel/:id', panel.getPanel);
    app.get('/panel/:id/hooks/', hook.getPanelHooks);
    app.get('/panel_set/:id', panelSet.getPanelSetByID);
    app.get('/panel_set/:id/panels/', panel.getPanelsFromPanelSetID); // documentation doesn't work for some reason
    app.get('/panel_set/:panel_set_id/:index/panel', panel.getPanelBasedOnPanelSetAndIndex);
    app.get('/user/:id/', user.getUserByID);
    app.get('/user/:id/panel_sets/', panelSet.getAllPanelSetsFromUser); // documentation doesn't work for some reason
    app.get('/hook/status/:id', hook.getStatus);
    app.get('*', utils.notFound);

    app.post('/createHook', hook.createHook);
    app.post('/createPanel', panel.createPanel);
    app.post('/createPanelSet', panelSet.createPanelSet);
    app.post('/createUser', user.createUser);

    // authentication needs to change soon
    app.post('/authenticate', user.authenticate);
    app.post('/changePassword', user.changePassword);
    app.post('/changeDisplayName', user.changeDisplayName); // documentation doesn't work for some reason
    app.post('/updatePanel', panel.updatePanel);
    app.post('*', utils.notFound);

    app.patch('/addSetToHook', hook.addSetToHook); // documentation doesn't work for some reason
    app.patch('*', utils.notFound);
};
