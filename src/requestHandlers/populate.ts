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

    const images = [] as any;
    for (let i = 1; i < 7; i++) {
        images.push(files[`image${i}`] ? files[`image${i}`][0] : null);
    }

    if (images.some((image: any) => !image)) {
        return res.status(400).json({ message: 'Exactly 6 images files must be uploaded' });
    }

    // Validate all 6 images
    for (let i = 0; i < 6; i++) {
        if (!validateImageFile(images[i]))
            return res.status(400).json({ message: `Uploaded file ${i + 1} must be an image` });
    }

    const response = await _populate(sequelize, images)();
    return sanitizeResponse(response, res, '');

    // API documentation
    /*
    #swagger.tags = ['populate']

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
    #swagger.parameters['image4'] = {
        in: 'formData',
        type: 'file',
        required: true,
        description: 'The file of the image for panel-3.'
    }
    #swagger.parameters['image5'] = {
        in: 'formData',
        type: 'file',
        required: true,
        description: 'The file of the image for panel-3.'
    }
    #swagger.parameters['image6'] = {
        in: 'formData',
        type: 'file',
        required: true,
        description: 'The file of the image for panel-3.'
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

const _populate = (sequelize: Sequelize, panelImages: Array<Express.Multer.File> = []) => async() => {
    try {

        // create a user
        const user = await UserService.createUser(sequelize)({
            password:     'Password!',
            email:        'email@yaoo.com',
            display_name: 'display'
        }) as IUser;

        if (panelImages.length === 0) {
            panelImages.push({} as Express.Multer.File);
            panelImages.push({} as Express.Multer.File);
            panelImages.push({} as Express.Multer.File);
            panelImages.push({} as Express.Multer.File);
            panelImages.push({} as Express.Multer.File);
            panelImages.push({} as Express.Multer.File);
        }
        const hookString = JSON.parse(`{ "position":[{"x": 1, "y": 1}]}`);

        const ps1hooks = [{ position: hookString, panel_index: 0 }, { position: hookString, panel_index: 1 }, { position: hookString, panel_index: 1 }];
        const ps2hooks = [{ position: hookString, panel_index: 0 }, { position: hookString, panel_index: 1 }, { position: hookString, panel_index: 1 }];
        const ps3hooks = [{ position: hookString, panel_index: 1 }, { position: hookString, panel_index: 1 }, { position: hookString, panel_index: 2 }];
        const ps4hooks = [{ position: hookString, panel_index: 0 }, { position: hookString, panel_index: 1 }, { position: hookString, panel_index: 2 }];
        const ps5hooks = [{ position: hookString, panel_index: 1 }, { position: hookString, panel_index: 2 }, { position: hookString, panel_index: 2 }];
        const ps6hooks = [{ position: hookString, panel_index: 0 }, { position: hookString, panel_index: 1 }, { position: hookString, panel_index: 2 }];
        const ps7hooks = [{ position: hookString, panel_index: 0 }, { position: hookString, panel_index: 0 }, { position: hookString, panel_index: 2 }];
        const ps8hooks = [{ position: hookString, panel_index: 0 }, { position: hookString, panel_index: 1 }, { position: hookString, panel_index: 2 }];
        const ps9hooks = [{ position: hookString, panel_index: 1 }, { position: hookString, panel_index: 1 }, { position: hookString, panel_index: 2 }];
        const ps10hooks = [{ position: hookString, panel_index: 2 }, { position: hookString, panel_index: 2 }, { position: hookString, panel_index: 2 }];
        const ps11hooks = [{ position: hookString, panel_index: 0 }, { position: hookString, panel_index: 0 }, { position: hookString, panel_index: 1 }];
        const ps12hooks = [{ position: hookString, panel_index: 1 }, { position: hookString, panel_index: 2 }, { position: hookString, panel_index: 2 }];
        const ps13hooks = [{ position: hookString, panel_index: 2 }, { position: hookString, panel_index: 2 }, { position: hookString, panel_index: 2 }];
        const ps14hooks = [{ position: hookString, panel_index: 1 }, { position: hookString, panel_index: 2 }, { position: hookString, panel_index: 2 }];
        const ps15hooks = [{ position: hookString, panel_index: 0 }, { position: hookString, panel_index: 1 }, { position: hookString, panel_index: 2 }];
        const ps16hooks = [{ position: hookString, panel_index: 0 }, { position: hookString, panel_index: 0 }, { position: hookString, panel_index: 2 }];
        const ps17hooks = [{ position: hookString, panel_index: 1 }, { position: hookString, panel_index: 1 }, { position: hookString, panel_index: 2 }];
        const ps18hooks = [{ position: hookString, panel_index: 0 }, { position: hookString, panel_index: 2 }, { position: hookString, panel_index: 2 }];
        const ps19hooks = [{ position: hookString, panel_index: 0 }, { position: hookString, panel_index: 0 }, { position: hookString, panel_index: 2 }];
        const ps20hooks = [{ position: hookString, panel_index: 1 }, { position: hookString, panel_index: 1 }, { position: hookString, panel_index: 1 }];

        const publishes = [
        await _publishController(sequelize)(user.id, 'Tree 1', panelImages[0], panelImages[1], panelImages[2], ps1hooks, undefined) as any,
            await _publishController(sequelize)(user.id, null, panelImages[3], panelImages[4], panelImages[5], ps2hooks, 1) as any,
            await _publishController(sequelize)(user.id, null, panelImages[0], panelImages[1], panelImages[2], ps3hooks, 3) as any,
            await _publishController(sequelize)(user.id, null, panelImages[3], panelImages[4], panelImages[5], ps4hooks, 2) as any,
            await _publishController(sequelize)(user.id, null, panelImages[0], panelImages[1], panelImages[2], ps5hooks, 9) as any,
            await _publishController(sequelize)(user.id, null, panelImages[3], panelImages[4], panelImages[5], ps6hooks, 4) as any,
        await _publishController(sequelize)(user.id, 'Tree 2', panelImages[0], panelImages[1], panelImages[2], ps7hooks, undefined) as any,
            await _publishController(sequelize)(user.id, null, panelImages[3], panelImages[4], panelImages[5], ps8hooks, 19) as any,
            await _publishController(sequelize)(user.id, null, panelImages[0], panelImages[1], panelImages[2], ps9hooks, 20) as any,
            await _publishController(sequelize)(user.id, null, panelImages[3], panelImages[4], panelImages[5], ps10hooks, 21) as any,
            await _publishController(sequelize)(user.id, null, panelImages[0], panelImages[1], panelImages[2], ps11hooks, 22) as any,
            await _publishController(sequelize)(user.id, null, panelImages[3], panelImages[4], panelImages[5], ps12hooks, 25) as any,
            await _publishController(sequelize)(user.id, null, panelImages[0], panelImages[1], panelImages[2], ps13hooks, 27) as any,
            await _publishController(sequelize)(user.id, null, panelImages[3], panelImages[4], panelImages[5], ps14hooks, 30) as any,
            await _publishController(sequelize)(user.id, null, panelImages[0], panelImages[1], panelImages[2], ps15hooks, 40) as any,
        await _publishController(sequelize)(user.id, 'Tree 3', panelImages[3], panelImages[4], panelImages[5], ps16hooks, undefined) as any,
            await _publishController(sequelize)(user.id, null, panelImages[0], panelImages[1], panelImages[2], ps17hooks, 47) as any,
            await _publishController(sequelize)(user.id, null, panelImages[3], panelImages[4], panelImages[5], ps18hooks, 48) as any,
        await _publishController(sequelize)(user.id, 'Tree 4', panelImages[0], panelImages[1], panelImages[2], ps19hooks, undefined) as any,
        await _publishController(sequelize)(user.id, 'Tree 5', panelImages[3], panelImages[4], panelImages[5], ps20hooks, undefined) as any,
        ];
        return publishes.map(p => (p instanceof Error ? p.message : p));
    }
    catch (err) {
        return err;
    }
};

export { populate, uploadImagesPopulate };
