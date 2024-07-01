import { Express } from 'express';
import help from './requestHandlers/help';
import multer from 'multer';
import * as user from './requestHandlers/user';
import * as hook from './requestHandlers/hook';
import * as panel from './requestHandlers/panel';
import * as panelSet from './requestHandlers/panelSet';
import * as utils from './requestHandlers/utils';
import * as image from './requestHandlers/image';

/**
 * Route all incoming requests
 */
// Set up multer storage

// Initialize multer with storage and file filter
const upload = multer({ storage: multer.memoryStorage() });

export default (app: Express) => {
    app.get('/', help);

    app.post('/api/upload', upload.single('image'), image.saveImage);

    // Get by ID
    app.get('/getHook', hook.getHook);
    app.get('/getPanel', panel.getPanel);
    app.get('/getPanelSetByID', panelSet.getPanelSetByID);
    app.get('/getUserByID', user.getUserByID);
    app.get('/getPanelBasedOnPanelSetAndIndex', panel.getPanelBasedOnPanelSetAndIndex);
    app.get('/getPanelHooks', hook.getPanelHooks);
    app.get('/getPanelsFromPanelSetID', panel.getPanelsFromPanelSetID); // documentation doesn't work for some reason
    app.get('/getAllPanelSetsFromUser', panelSet.getAllPanelSetsFromUser); // documentation doesn't work for some reason
    app.get('*', utils.notFound);

    app.post('/createHook', hook.createHook);
    app.post('/createPanel', panel.createPanel);
    app.post('/createPanelSet', panelSet.createPanelSet);
    app.post('/createUser', user.createUser);

    // authentication needs to change soon
    app.post('/authenticate', user.authenticate);
    app.post('/changePassword', user.changePassword);
    app.post('/changeDisplayName', user.changeDisplayName); // documentation doesn't work for some reason
    app.post('*', utils.notFound);

    app.patch('/addSetToHook', hook.addSetToHook); // documentation doesn't work for some reason
    app.patch('*', utils.notFound);
};
