import {
    _createPanelController, 
    _getPanelController, 
    _getPanelsFromPanelSetIDController
} from '../requestHandlers/panel';

import * as panelService from '../services/panelService';

import { Sequelize } from 'sequelize';
jest.mock('../services/panelService');

describe('_getPanelController', () => {
    let sequelizeMock: jest.Mocked<Sequelize>;

    beforeEach(() => {
        sequelizeMock = {} as jest.Mocked<Sequelize>;
    });

    test("If the panel exists, it should be returned", async () => {
        const panelData = {
            id: 1,
            image: '.../../blah.png',
            index: 0,
            panel_set_id: 1
        };

        (panelService.getPanel as jest.Mock).mockReturnValue(() => Promise.resolve(panelData));

        const response = await _getPanelController(sequelizeMock)(1);

        expect(response).toEqual(panelData);
    });

    test("If the panel does not exist, it should return undefined", async () => {
        (panelService.getPanel as jest.Mock).mockReturnValue(() => Promise.resolve(undefined));

        const response = await _getPanelController(sequelizeMock)(1);

        expect(response).toBeUndefined();
    });

    test("If an error occurs, it should return the error", async () => {
        const error = new Error("Some error");
        (panelService.getPanel as jest.Mock).mockReturnValue(() => Promise.reject(error));

        const response = await _getPanelController(sequelizeMock)(1);

        expect(response).toBe(error);
    });
});