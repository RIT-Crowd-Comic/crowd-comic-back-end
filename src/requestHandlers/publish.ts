import { Request, Response } from 'express';
import { Sequelize } from 'sequelize';
import {
    assertArgumentsDefined, assertArgumentsNumber, sanitizeResponse, assertArgumentsPosition
} from './utils';
import { sequelize } from '../database';
import { createPanel } from '../services/panelService';
import { createHook } from '../services/hookService';
import { Json } from 'sequelize/types/utils';
import { _saveImageController, validateImageFile } from './image';
import { _createPanelSetController } from './panelSet';
import { IPanelSet } from '../models';

// types 
type hook = {position : Json, panel_index : number}
type hookArray = Array<hook>;

const _publishController = (sequelize : Sequelize) => async (
    author_id: string,
    panelImage1 : Express.Multer.File,
    panelImage2 : Express.Multer.File,
    panelImage3: Express.Multer.File,
    hooks : hookArray
) => {

    // make transaction
    const t = await sequelize.transaction();
    try {

        // make panel_set, call the controller as author validation is needed
        const panel_set = await _createPanelSetController(sequelize, t)(author_id) as IPanelSet | Error;

        // validate panel set creation, if not expected, its an error so throw it
        if (panel_set instanceof Error) throw panel_set;

        // generate ids for each panel image
        const image1Id = `${author_id}_${panel_set.id}_${panelImage1.originalname}`;
        const image2Id = `${author_id}_${panel_set.id}_${panelImage2.originalname}`;
        const image3Id = `${author_id}_${panel_set.id}_${panelImage3.originalname}`;

        // make panels, call service as panel_set creation worked
        const panel1 = await createPanel(sequelize, t)({
            image:        image1Id,
            index:        0,
            panel_set_id: panel_set.id,
        });

        const panel2 = await createPanel(sequelize, t)({
            image:        image2Id,
            index:        1,
            panel_set_id: panel_set.id,
        });

        const panel3 = await createPanel(sequelize, t)({
            image:        image3Id,
            index:        2,
            panel_set_id: panel_set.id,
        });

        // create hooks and validate
        const createdHooks = [] as Array<object>;
        await Promise.all(hooks.map(async (hook) => {
            const matchedPanel = [panel1, panel2, panel3].find(panel => panel.index === hook.panel_index);
            if (matchedPanel === undefined) throw new Error('Hook panel_index was invalid');
            createdHooks.push(await createHook(sequelize, t)({
                position:          hook.position,
                current_panel_id:  matchedPanel.id,
                next_panel_set_id: null
            }));
        }));

        // save to amazon 
        const s3Image1 = await _saveImageController(image1Id, panelImage1.buffer, panelImage1.mimetype) as {id: string, } | Error;
        if (s3Image1 instanceof Error) throw s3Image1;

        const s3Image2 =  await _saveImageController(image2Id, panelImage2.buffer, panelImage2.mimetype) as {id: string, } | Error;
        if (s3Image2 instanceof Error) throw s3Image2;

        const s3Image3 = await _saveImageController(image3Id, panelImage3.buffer, panelImage3.mimetype) as {id: string, } | Error;
        if (s3Image3 instanceof Error) throw s3Image3;

        // if gotten this far, everything worked
        await t.commit();
        return {
            success: `Panel_Set successfully published`, panel_set: panel_set, panel1: panel1, panel2: panel2, panel3: panel3, image1: s3Image1, image2: s3Image2, image3: s3Image3, hooks: createdHooks
        };
    }
    catch (err) {
        await t.rollback();
        return err;
    }
};

/**
 * Validates author_id before sending a creation request to the database
 * @param request 
 * @param res 
 * @returns 
 */
const publish = async (request: Request, res: Response) : Promise<Response> => {

    let data;

    // parse the data field
    try {
        data = JSON.parse(request.body.data);
    }
    catch (e) {
        return res.status(400).json({ error: 'data is not valid JSON and cannot be accepted' });
    }

    // get the author data
    const author_id = data.author_id;

    // validate
    let validArgs = assertArgumentsDefined({ author_id });
    if (!validArgs.success) return res.status(400).json(validArgs);

    // get image files
    const files = request.files as { [fieldname: string]: Express.Multer.File[] };

    // check if not there
    if (!files) {
        return res.status(400).json({ message: 'No files uploaded' });
    }

    // get specific image data
    const panelImage1 = files['image1'] ? files['image1'][0] : null;
    const panelImage2 = files['image2'] ? files['image2'][0] : null;
    const panelImage3 = files['image3'] ? files['image3'][0] : null;


    // make sure all three exist
    if (!panelImage1 || !panelImage2 || !panelImage3) {
        return res.status(400).json({ message: 'All three files must be uploaded' });
    }

    // Validate all three images
    if (!validateImageFile(panelImage1)) {
        return res.status(400).json({ error: 'Uploaded file 1 must be an image' });
    }
    if (!validateImageFile(panelImage2)) {
        return res.status(400).json({ error: 'Uploaded file 2 must be an image' });
    }
    if (!validateImageFile(panelImage3)) {
        return res.status(400).json({ error: 'Uploaded file 3 must be an image' });
    }



    const hooks = data.hooks;

    // ensure hooks exist
    if (!hooks) return res.status(400).json({ error: 'No hooks uploaded' });

    if (!Array.isArray(hooks) || hooks.length < 3) return res.status(400).json({ error: 'At least 3 hooks need to be uploaded.' });

    // validate
    for (let i = 0; i < hooks.length; i++) {
        validArgs = assertArgumentsDefined({ position: hooks[i].position });
        if (!validArgs.success) return res.status(400).json(validArgs);
        validArgs = assertArgumentsNumber({ index: hooks[i].panel_index });
        if (!validArgs.success) return res.status(400).json(validArgs);

        // validate position
        validArgs = assertArgumentsPosition(hooks[i].position);
        if (!validArgs.success) return res.status(400).json(validArgs);
    }

    // call the controller
    const response = await _publishController(sequelize)(author_id, panelImage1, panelImage2, panelImage3, hooks);

    return sanitizeResponse(response, res);

    // API documentation
    /*
    #swagger.tags = ['publish']

    #swagger.consumes = ['multipart/form-data']

    #swagger.parameters['image1'] = {
        in: 'formData',
        type: 'file',
        required: true,
        description: 'The file of the image for panel-1.'
    }
    #swagger.parameters['image2'] = {
        in: 'formData',
        type: 'file',
        required: true,
        description: 'The file of the image for panel-2.'
    }
    #swagger.parameters['image3'] = {
        in: 'formData',
        type: 'file',
        required: true,
        description: 'The file of the image for panel-3.'
    }
    #swagger.parameters['data'] = {
        in: 'formData',
        required: true,
        description: 'author id and hook array'
    }
    #swagger.parameters['Data Template'] = {
        in: 'body',
        description: 'Schema for the data',
        schema: { $ref: '#/definitions/publish' }
    }


    #swagger.responses[200] = {
        schema: { $ref: '#/definitions/publishResponse' }
    }
    #swagger.responses[400] = {
        schema: { $ref: '#/definitions/error' }
    }
    #swagger.responses[500] = {}
*/

};



export { _publishController, publish };
