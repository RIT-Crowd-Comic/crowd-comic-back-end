import { sanitizeResponse } from './utils';
import { Request, Response } from 'express';

import { Sequelize } from 'sequelize';
import { sequelize } from '../database';
import * as UserService from '../services/userService';
import { validateImageFile } from './image';

import { IUser } from '../models';
import { _publishController } from './publish';

// test methods so I don't have to run all of these queries every time I want to test something
const populate = async (request: Request, res: Response) => {
    const response = await _populate(sequelize)();
    return sanitizeResponse(response, res, '');
};

const uploadImagesPopulate = async (request: Request, res: Response) => {

     // get image files
    const files = request.files as { [fieldname: string]: Express.Multer.File[] };

    // check if not there
    if (!files) {
        return res.status(400).json({ message: 'No files uploaded' });
    }

    // get specific image data
    const panelImage1 = files['image1'] ? files['image1'][0] : null;
    const panelImage2 = files['image2'] ? files['image2'][0] : null;


    // make sure all three exist
    if (!panelImage1 || !panelImage2) {
        return res.status(400).json({ message: 'Exactly three images files must be uploaded' });
    }

    // Validate all three images
    if (!validateImageFile(panelImage1)) {
        return res.status(400).json({ error: 'Uploaded file 1 must be an image' });
    }
    if (!validateImageFile(panelImage2)) {
        return res.status(400).json({ error: 'Uploaded file 2 must be an image' });
    }

    const response = await _populate(sequelize, [panelImage1, panelImage2])();
    return sanitizeResponse(response, res, '');
};

const _populate = (sequelize: Sequelize, panelImages: Array<Express.Multer.File> = []) => async() => {
    try {

        // create a user
        const user = await UserService.createUser(sequelize)({
            password:     'Password!',
            email:        'email@yaoo.com',
            display_name: 'display'
        }) as IUser;

        if(panelImages.length === 0){
            panelImages.push({} as Express.Multer.File);
            panelImages.push({} as Express.Multer.File);
        }
        const hookString = JSON.parse(`{ "position":[{"x": 1, "y": 1}]}`);

        const hook1 = [{ position: hookString, panel_index: 0 }, { position: hookString, panel_index: 1 }, { position: hookString, panel_index: 1 }];
        const hook2 = [{ position: hookString, panel_index: 0 }, { position: hookString, panel_index: 1 }, { position: hookString, panel_index: 1 }];
        const hook3 = [{ position: hookString, panel_index: 1 }, { position: hookString, panel_index: 1 }, { position: hookString, panel_index: 2 }];
        const hook4 = [{ position: hookString, panel_index: 0 }, { position: hookString, panel_index: 1 }, { position: hookString, panel_index: 2 }];
        const hook5 = [{ position: hookString, panel_index: 1 }, { position: hookString, panel_index: 2 }, { position: hookString, panel_index: 2 }];
        const hook6 = [{ position: hookString, panel_index: 0 }, { position: hookString, panel_index: 1 }, { position: hookString, panel_index: 2 }];
        const publishes = [await _publishController(sequelize)(user.id, panelImages[0], panelImages[0], panelImages[0], hook1, undefined) as any,
            await _publishController(sequelize)(user.id, panelImages[1], panelImages[1], panelImages[1], hook2, 1) as any,
            await _publishController(sequelize)(user.id, panelImages[1], panelImages[1], panelImages[1], hook3, 3) as any,
            await _publishController(sequelize)(user.id, panelImages[0], panelImages[0], panelImages[0], hook4, 2) as any,
            await _publishController(sequelize)(user.id, panelImages[0], panelImages[0], panelImages[0], hook5, 9) as any,
            await _publishController(sequelize)(user.id, panelImages[0], panelImages[0], panelImages[0], hook6, 4) as any];
        return publishes.map(p => p instanceof Error ? p.message : p);
    }
    catch (err) {
        return err;
    }
};

export { populate, uploadImagesPopulate };
