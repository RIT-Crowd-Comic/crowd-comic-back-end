import { _getPanelController, _getPanelsFromPanelSetIDController } from '../requestHandlers/panel';

import * as panelService from '../services/panelService';
import { Sequelize, ValidationError } from 'sequelize';
jest.mock('../services/panelService');

let sequelizeMock: jest.Mocked<Sequelize>;
describe('_getPanelController', () => {
    beforeEach(() => {
        sequelizeMock = {} as jest.Mocked<Sequelize>;
    });

    test('If the panel exists, it should be returned', async () => {
        const panelData = {
            image:        '../../superCoolImage.png!',
            index:        0,
            panel_set_id: 1
        };

        (panelService.getPanel as jest.Mock).mockReturnValue(() => Promise.resolve(panelData));

        const response = await _getPanelController(sequelizeMock)(1);

        expect(response).toEqual(panelData);
    });

    test('If the panel does not exist, it should return null', async () => {
        (panelService.getPanel as jest.Mock).mockReturnValue(() => Promise.resolve(null));

        const response = await _getPanelController(sequelizeMock)(10);

        expect(response).toBeNull();
    });

    test('If an error occurs, it should return the error', async () => {
        const error = new Error('Some error');
        (panelService.getPanel as jest.Mock).mockReturnValue(() => Promise.reject(error));

        const response = await _getPanelController(sequelizeMock)(1000);

        expect(response).toBe(error);
    });
});

describe('_getPanelsFromPanelSetIDController', () => {
    let sequelizeMock: jest.Mocked<Sequelize>;

    beforeEach(() => {
        sequelizeMock = {} as jest.Mocked<Sequelize>;
    });

    test('If the panels exists, they should be returned', async () => {
        const panelData = [{
            id: 1,
            image:        '../../superCoolImage.png!',
            index:        0,
        },
        {
            id: 2,
            image:        '../../superCoolImage.png!',
            index:        1,
        },
        {
            id: 3,
            image:        '../../superCoolImage.png!',
            index:        2,
        }];

        (panelService.getPanelsFromPanelSetID as jest.Mock).mockReturnValue(() => Promise.resolve(panelData));

        const response = await _getPanelsFromPanelSetIDController(sequelizeMock)(1);

        expect(response).toEqual(panelData);
    });

    test('If panel set has no panels, it shoudl return []', async () => {
        (panelService.getPanelsFromPanelSetID as jest.Mock).mockReturnValue(() => Promise.resolve([]));

        const response = await _getPanelsFromPanelSetIDController(sequelizeMock)(10);

        expect(response).toEqual([]);
    });

    test('If an error occurs, it should return the error', async () => {
        const error = new Error('Some error');
        (panelService.getPanelsFromPanelSetID as jest.Mock).mockReturnValue(() => Promise.reject(error));

        const response = await _getPanelsFromPanelSetIDController(sequelizeMock)(1000);

        expect(response).toBe(error);
    });
});
