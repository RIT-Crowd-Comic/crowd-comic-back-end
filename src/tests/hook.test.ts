import {
    _getHookController, _getPanelHooksController, _addSetToHookController, _validateHookConnectionController
} from '../requestHandlers/hook';
import * as hookService from '../services/hookService';
import * as panelService from '../services/panelService';
import { Sequelize } from 'sequelize';
jest.mock('../services/hookService');
jest.mock('../services/panelService');
jest.mock('../services/panelSetService');

const sequelizeMock = () => ({} as jest.Mocked<Sequelize>);

describe('Get Hook Controller', () => {
    test('If service returns, then controller should return service value', async () => {
        const hookData = {
            position:          [1, 1],
            current_panel_id:  1,
            next_panel_set_id: 2
        };

        (hookService.getHook as jest.Mock).mockReturnValue(() => Promise.resolve(hookData));

        const response = await _getHookController(sequelizeMock())(1);

        expect(response).toEqual(hookData);
    });

    test('If an error occurs, it should return the error', async () => {
        (hookService.getHook as jest.Mock).mockReturnValue(() => { throw new Error('Error Message'); });

        const response = await _getHookController(sequelizeMock())(1);

        expect(response).toBeInstanceOf(Error);
    });
});

describe('Get Panel Hooks Controller', () => {
    test(
        'If the panel has associated hooks, they should fill the array',
        async () => {
            const panelHookData = [
                {
                    position:          [1, 1],
                    current_panel_id:  1,
                    next_panel_set_id: 2
                },
                {
                    position:          [2, 2],
                    current_panel_id:  1,
                    next_panel_set_id: 3
                }
            ];
            const panelData = {
                image:        '../phonyImage.png',
                index:        0,
                panel_set_id: 1
            };

            (panelService.getPanel as jest.Mock).mockReturnValue(() => Promise.resolve(panelData));
            (hookService.getPanelHooks as jest.Mock).mockReturnValue(() => Promise.resolve(panelHookData));

            const response = await _getPanelHooksController(sequelizeMock())(1);

            expect(response).toEqual(panelHookData);
        }
    );

    test('If panel does not exist, a no panel exists error should be returned', async () => {
        const error = new Error('no panel exists for given panel id');

        (panelService.getPanel as jest.Mock).mockReturnValue(() => Promise.resolve(null));

        const response = await _getPanelHooksController(sequelizeMock())(1);

        expect(response).toEqual(error);
    });

    test('If an error occurs, the error should be returned', async () => {
        (hookService.getPanelHooks as jest.Mock).mockReturnValue(() => { throw new Error('Error Message'); });

        const response = await _getPanelHooksController(sequelizeMock())(1);

        expect(response).toBeInstanceOf(Error);
    });
});

describe('Add Set To Hook Controller', () => {
    test('If hook is successfully added, return it', async () => {
        const hookData = {
            position:          [1, 1],
            current_panel_id:  1,
            next_panel_set_id: 2
        };

        (_validateHookConnectionController as jest.Mock).mockReturnValue(() => Promise.resolve());
        (hookService.addSetToHook as jest.Mock).mockReturnValue(() => Promise.resolve(hookData));

        const response = await _addSetToHookController(sequelizeMock())(1, 2);

        expect(response).toBe(hookData);
    });

    test('If an error occurs in validate, the error should be returned', async () => {
        (_validateHookConnectionController as jest.Mock).mockReturnValue(() => { throw new Error('Error Messgage'); });

        const response = await _addSetToHookController(sequelizeMock())(1, 2);

        expect(response).toBeInstanceOf(Error);
    });


    test('If an error occurs, the error should be returned', async () => {
        (_validateHookConnectionController as jest.Mock).mockReturnValue(() => Promise.resolve());
        (hookService.addSetToHook as jest.Mock).mockReturnValue(() => { throw new Error('Error Messgage'); });

        const response = await _addSetToHookController(sequelizeMock())(1, 2);

        expect(response).toBeInstanceOf(Error);
    });
});
