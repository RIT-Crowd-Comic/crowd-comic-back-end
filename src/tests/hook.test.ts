import {
    _getHookController, _getPanelHooksController, _validateHookConnectionController,
    _getAllHooksByPanelSetIdController
} from '../requestHandlers/hook';

import { _getAllTrunkSetsController } from '../requestHandlers/panelSet';

// import 
import * as hookService from '../services/hookService';
import * as panelService from '../services/panelService';
import { Sequelize } from 'sequelize';
jest.mock('../services/hookService');
jest.mock('../services/panelService');
jest.mock('../requestHandlers/panelSet');

const sequelizeMock = (props: object = {}) => ({ ...props } as jest.Mocked<Sequelize>);

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
    test.todo('not implementing due to jest limitations');
});


describe('Validate Hook Connection Controller', () => {
    const panelSets = {
        valid:   { id: 1, hook: null },
        hasHook: { id: 2, hook: {} },
        trunk:   { id: 3, hook: null },
    };
    const trunks = [panelSets.trunk];
    const sequelize = sequelizeMock({ models: { panel_set: { findByPk: jest.fn((id: number) => Promise.resolve(Object.values(panelSets).find(set => set.id === id))) } } });
    (_getAllTrunkSetsController as jest.Mock).mockReturnValue(Promise.resolve(trunks));

    test('If an existing panel set has no hooks, it should return success', async () => {
        const response = await _validateHookConnectionController(sequelize)(1);
        expect(response).toEqual({ success: true });
    });

    test('If panel_set does not exist, a no panel_set exists error should be returned', async () => {
        const response = await _validateHookConnectionController(sequelize)(5);
        expect(response).toMatchObject(new Error('no panel_set exists for given panel_set_id'));
    });

    test('If panel_set already has a hook, a hook connection error should be returned', async () => {
        const response = await _validateHookConnectionController(sequelize)(2);
        expect(response).toMatchObject(new Error('Panel set already has a connection, it cannot be connected to anything else.'));
    });

    test('If panel_set is a trunk, return an error', async () => {
        const response = await _validateHookConnectionController(sequelize)(3);
        expect(response).toMatchObject(new Error('Panel set is a trunk'));
    });
});

describe('Get All Hooks By Panel Set ID Controller', () => {
    const hookData = [{ test_success: true }];

    test('If panel set is valid, return all attached hooks', async () => {
        const sequelize = sequelizeMock({ models: { panel_set: { findByPk: () => Promise.resolve({}) } } });
        (hookService.getAllHooksByPanelSetId as jest.Mock).mockReturnValue(() => Promise.resolve(hookData));

        const response = await _getAllHooksByPanelSetIdController(sequelize)(1);
        expect(response).toBe(hookData);
    });

    test('If panel set doesn\'t exist, throw an error', async () => {
        const sequelize = sequelizeMock({ models: { panel_set: { findByPk: () => Promise.resolve(null) } } });
        (hookService.getAllHooksByPanelSetId as jest.Mock).mockReturnValue(() => Promise.resolve(hookData));

        const response = await _getAllHooksByPanelSetIdController(sequelize)(1);
        expect(response).toMatchObject(new Error(`A panel set with the id of 1 doesn't exist`));
    });
});
