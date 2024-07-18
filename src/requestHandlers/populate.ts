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
    const files = request.files as Express.Multer.File[] ;

    // check if not there
    if (!files) {
        return res.status(400).json({ message: 'No files uploaded' });
    }

    // make sure all six exist
    if (files.length !== 6) {
        return res.status(400).json({ message: 'Exactly three images files must be uploaded' });
    }

    files.forEach(file =>{
         // Validate all three images
        if (!validateImageFile(file)) {
            return res.status(400).json({ error: 'Uploaded file 1 must be an image' });
        }
    })


    const response = await _populate(sequelize, files)();
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
        const publishes = [await _publishController(sequelize)(user.id, panelImages[0], panelImages[1], panelImages[2], hook1, undefined) as any,
            await _publishController(sequelize)(user.id, panelImages[3], panelImages[4], panelImages[5], hook2, 1) as any,
            await _publishController(sequelize)(user.id, panelImages[3], panelImages[4], panelImages[5], hook3, 3) as any,
            await _publishController(sequelize)(user.id, panelImages[0], panelImages[1], panelImages[2], hook4, 2) as any,
            await _publishController(sequelize)(user.id, panelImages[0], panelImages[1], panelImages[2], hook5, 9) as any,
            await _publishController(sequelize)(user.id, panelImages[0], panelImages[1], panelImages[2], hook6, 4) as any];
        return publishes.map(p => p instanceof Error ? p.message : p);
    }
    catch (err) {
        return err;
    }
};

export { populate, uploadImagesPopulate };
