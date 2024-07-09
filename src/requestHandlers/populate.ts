import { sanitizeResponse } from './utils';
import { Request, Response } from 'express';
import * as PanelSetService from '../services/panelSetService';
import { Sequelize } from 'sequelize';
import { sequelize } from '../database';
import * as UserService from '../services/userService';
import { _createHookController } from './hook';
import * as PanelService from '../services/panelService';
import { IPanelSet, IPanel, IUser } from '../models';

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

        // create panel sets
        const panel_set_count = 10;
        const panel_sets = [] as Array<IPanelSet>;
        for (let i = 0; i < panel_set_count; i++) {
            panel_sets.push(await PanelSetService.createPanelSet(sequelize)({ author_id: user.id }) as IPanelSet);
        }
        const panel_data = [1, 2, 3, 4, 4, 4];

        // create 1 panel for each panel set
        for (let i = 0; i < panel_data.length; i++) {
            await PanelService.createPanel(sequelize)({
                image:        '',
                index:        0,
                panel_set_id: panel_data[i],
            }) as IPanel;
        }

        const hookConnection = [
            { panel_id: 1, next_panel_set_id: 2 },
            { panel_id: 1, next_panel_set_id: 7 },
            { panel_id: 2, next_panel_set_id: 3 },
            { panel_id: 4, next_panel_set_id: 4 },
            { panel_id: 5, next_panel_set_id: 5 },
            { panel_id: 6, next_panel_set_id: 6 }
        ];

        // add hooks
        for (const hook of hookConnection) {
            const createdHook =  await _createHookController(sequelize)(
                JSON.parse(`
                {
                    "position":[
                        {
                            "x":1,
                            "y":1
                        },
                        {
                            "x":1,
                            "y":1
                        },
                        {
                            "x":1,
                            "y":1
                        }
                    ]
                }`),
                hook.panel_id,
                hook.next_panel_set_id,
                true
            );
            if (createdHook instanceof Error) throw createdHook;
        }

        return { success: true };
    }
    catch (err) {
        return err;
    }
};

export { populate };
