import { Express } from 'express';
import help from './requestHandlers/help';
import multer from 'multer';
import * as user from './requestHandlers/user';
import * as hook from './requestHandlers/hook';
import * as panel from './requestHandlers/panel';
import * as panelSet from './requestHandlers/panelSet';
import * as utils from './requestHandlers/utils';
import * as image from './requestHandlers/image';
import * as publish from './requestHandlers/publish';
import * as populate from './requestHandlers/populate';
import cors from 'cors';


/**
 * Route all incoming requests
 */
// Set up multer storage

// Initialize multer with storage and file filter
const upload = multer({ storage: multer.memoryStorage() });

export default (app: Express) => {
    app.use(cors());
    app.get('/', help);
    app.get('/dumb', populate.populate);

    // app.post('/saveImage', upload.single('image'), image.saveImage);
    app.post('/publish', upload.fields([
        { name: 'image1', maxCount: 1 },
        { name: 'image2', maxCount: 1 },
        { name: 'image3', maxCount: 1 }
    ]), publish.publish);
    app.post('/saveimage', upload.single('image'), image.saveImage);
    app.get('/getImage/:id', image.getImage);

    app.get('/hook/:id', hook.getHook);
    app.get('/panel/:id', panel.getPanel);
    app.get('/panel/:id/hooks', hook.getPanelHooks);
    app.get('/panel_set/:id', panelSet.getPanelSetByID);
    app.get('/panel_sets/:ids/panels', panel.getPanelsFromPanelSetIDs); // documentation doesn't work for some reason
    app.get('/panel_set/:panel_set_id/:index/panel', panel.getPanelBasedOnPanelSetAndIndex);
    app.get('/user/:id/', user.getUserByID);
    app.get('/user/:id/panel_sets', panelSet.getAllPanelSetsFromUser); // documentation doesn't work for some reason
    app.get('/trunks', panelSet.getAllTrunkSets);
    app.get('/tree/:id', panelSet.getTree);
    app.get('/dumb', panelSet.dumbDumb);

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
