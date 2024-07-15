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

        const image = {} as Express.Multer.File;
        const hookString = JSON.parse(`{ "position":[{"x": 1, "y": 1}]}`);

        const hook1 = [{ position: hookString, panel_index: 0 }, { position: hookString, panel_index: 1 }, { position: hookString, panel_index: 1 }];
        const hook2 = [{ position: hookString, panel_index: 0 }, { position: hookString, panel_index: 1 }, { position: hookString, panel_index: 1 }];
        const hook3 = [{ position: hookString, panel_index: 1 }, { position: hookString, panel_index: 1 }, { position: hookString, panel_index: 2 }];
        const hook4 = [{ position: hookString, panel_index: 0 }, { position: hookString, panel_index: 1 }, { position: hookString, panel_index: 2 }];
        const hook5 = [{ position: hookString, panel_index: 1 }, { position: hookString, panel_index: 2 }, { position: hookString, panel_index: 2 }];
        const hook6 = [{ position: hookString, panel_index: 0 }, { position: hookString, panel_index: 1 }, { position: hookString, panel_index: 2 }];
        const publishes = [await _publishController(sequelize)(user.id, image, image, image, hook1, undefined) as any,
            await _publishController(sequelize)(user.id, image, image, image, hook2, 1) as any,
            await _publishController(sequelize)(user.id, image, image, image, hook3, 3) as any,
            await _publishController(sequelize)(user.id, image, image, image, hook4, 2) as any,
            await _publishController(sequelize)(user.id, image, image, image, hook5, 9) as any,
            await _publishController(sequelize)(user.id, image, image, image, hook6, 4) as any];
        return publishes.map(p => p instanceof Error ? p.message : p);
    }
    catch (err) {
        return err;
    }
};

export { populate };
