import { sanitizeResponse } from './utils';
import { Request, Response } from 'express';

import { Sequelize } from 'sequelize';
import { sequelize } from '../database';
import * as UserService from '../services/userService';

import { IUser } from '../models';
import { _publishController } from './publish';

// test methods so I don't have to run all of these queries every time I want to test something
const populate = async (request: Request, res: Response) => {
    const response = await _populate(sequelize)();
    return sanitizeResponse(response, res, '');
};

const _populate = (sequelize: Sequelize) => async() => {
    try {

        // create a user
        const user = await UserService.createUser(sequelize)({
            password:     'Password!',
            email:        'email@yaoo.com',
            display_name: 'display'
        }) as IUser;

        const image1 = {} as Express.Multer.File;
        const image2 = {} as Express.Multer.File;
        const image3 = {} as Express.Multer.File;
        const hooks = [{ position: JSON.parse(`{ "position":[{"x": 1, "y": 1}]}`), panel_index: 1 }, { position: JSON.parse(`{ "position":[{"x": 1, "y": 1}]}`), panel_index: 1 }, { position: JSON.parse(`{ "position":[{"x": 1, "y": 1}]}`), panel_index: 1 }];
        const parent = await _publishController(sequelize)(user.id, image1, image2, image3, hooks, undefined) as any;
        if(parent instanceof Error) throw new Error(`Populate had an error: ${parent.message}`);
        const child = await _publishController(sequelize)(user.id, image1, image2, image3, hooks, parent.hooks[0]);
        if(child instanceof Error) throw new Error(`Populate had an error: ${parent.message}`);
        return { parent: parent, child: child };
    }
    catch (err) {
        return err;
    }
};

export { populate };