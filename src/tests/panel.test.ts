import * as panel from '../requestHandlers/panel';
import * as panelService from '../services/panelService';
import { getPanelSetByID } from '../services/panelSetService';
import { Sequelize } from 'sequelize';
jest.mock('../services/panelService');
jest.mock('../services/panelSetService');

let sequelizeMock: jest.Mocked<Sequelize>;
beforeEach(() => {
    sequelizeMock = {} as jest.Mocked<Sequelize>;
});
describe('_getPanelBasedOnPanelSetIDAndIndex', () => {
    test('Return what the service outputs for getPanelbBsedOnPanelSetAndIndex', async () => {
        const panelData = {
            id:    1,
            image: '../../superCoolImage.png'
        };

        (panelService.getPanelBasedOnPanelSetAndIndex as jest.Mock).mockReturnValue(() => Promise.resolve(panelData));

        const response = await panel._getPanelBasedOnPanelSetAndIndexController(sequelizeMock)(1, 0);

        expect(response).toEqual(panelData);
    });

    test('If an error occurs, it should return the error', async () => {
        (panelService.getPanelBasedOnPanelSetAndIndex as jest.Mock).mockReturnValue(() => Promise.reject(new Error('Some error getting panel')));

        const response = await panel._getPanelBasedOnPanelSetAndIndexController(sequelizeMock)(1000, -1000);

        expect(response).toBeInstanceOf(Error);
    });
});
describe('_getPanelController', () => {
    test('return what the database service outputs for getPanel', async () => {
        const panelData = {
            image:        '../../superCoolImage.png!',
            index:        0,
            panel_set_id: 1
        };

        (panelService.getPanel as jest.Mock).mockReturnValue(() => Promise.resolve(panelData));

        const response = await panel._getPanelController(sequelizeMock)(1);

        expect(response).toEqual(panelData);
    });

    test('If an error occurs, it should return the error', async () => {
        (panelService.getPanel as jest.Mock).mockReturnValue(() => Promise.reject(new Error('Some error getting panel')));

        const response = await panel._getPanelController(sequelizeMock)(1000);

        expect(response).toBeInstanceOf(Error);
    });
});
describe('_getPanelsFromPanelSetIDController', () => {
    test('Should return what the service getPanelsFromPanelSetID returns', async () => {
        const panelData = [
            {
                id:    1,
                image: '../../superCoolImage.png',
                index: 0,
            },
            {
                id:    2,
                image: '../../superCoolImage.png',
                index: 1,
            },
            {
                id:    3,
                image: '../../superCoolImage.png',
                index: 2,
            }
        ];

        (panelService.getPanelsFromPanelSetID as jest.Mock).mockReturnValue(() => Promise.resolve(panelData));

        const response = await panel._getPanelsFromPanelSetIDController(sequelizeMock)(1);

        expect(response).toEqual(panelData);
    });

    test('If an error occurs, it should return the error', async () => {
        (panelService.getPanelsFromPanelSetID as jest.Mock).mockReturnValue(() => Promise.resolve(new Error('Some error getting panels')));

        const response = await panel._getPanelsFromPanelSetIDController(sequelizeMock)(1000);
        expect(response).toBeInstanceOf(Error);
    });
});
describe('_createPanelController', () => {
    const panelObj = { a: 'abcd' };

    test('if panel_set_id is invalid, thrown an error', async() => {
        (getPanelSetByID as jest.Mock).mockReturnValue(() => Promise.resolve(null));
        const response = await panel._createPanelController(sequelizeMock)('image.png', 3);
        expect(response).toBeInstanceOf(Error);
    });
    test('if panelSet.panels is not null, a panel should be created', async() => {
        const panelSet = { panels: ['a', 'b'] };
        (getPanelSetByID as jest.Mock).mockReturnValue(() => Promise.resolve(panelSet));
        (panelService.createPanel as jest.Mock).mockReturnValue(() => Promise.resolve(panelObj));
        const response = await panel._createPanelController(sequelizeMock)('', 0);
        expect(response).toBe(panelObj);
    });

    test('if panelSet.panels is null, a panel should still be created', async() => {
        const panelSet = {};
        (getPanelSetByID as jest.Mock).mockReturnValue(() => Promise.resolve(panelSet));
        (panelService.createPanel as jest.Mock).mockReturnValue(() => Promise.resolve(panelObj));
        const response = await panel._createPanelController(sequelizeMock)('', 0);
        expect(response).toBe(panelObj);
    });
});

describe('_updatePanelController', () => {
    test('if panel does not exist, throw an error', async () => {
        (panelService.getPanel as jest.Mock).mockReturnValue(() => Promise.resolve(null));
        const response = await panel._updatePanelController(sequelizeMock)(0, '');
        expect(response).toBeInstanceOf(Error);
    });
    test('if panel does exist, return the updated panel', async () => {
        const panelObj = { a: 'abcd' };
        (panelService.getPanel as jest.Mock).mockReturnValue(() => Promise.resolve('a'));
        (panelService.updatePanel as jest.Mock).mockResolvedValue(panelObj);
        const response = await panel._updatePanelController(sequelizeMock)(0, '');
        expect(response).toBe(panelObj);
    });
    test('if there is an error, return the error', async() => {
        (panelService.getPanel as jest.Mock).mockReturnValue(() => { throw new Error('I am an error'); });
        const response = await panel._updatePanelController(sequelizeMock)(0, '');
        expect(response).toBeInstanceOf(Error);
    });
});
