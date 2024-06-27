import { _getPanelController, _getPanelsFromPanelSetIDController, _getPanelBasedOnPanelSetAndIndexController, _createPanelController } from '../requestHandlers/panel';

import * as panelService from '../services/panelService';
import { getPanelSetByID } from '../services/panelSetService';
import { Sequelize} from 'sequelize';
jest.mock('../services/panelService');

let sequelizeMock: jest.Mocked<Sequelize>;
describe('_getPanelBasedOnPanelSetIDAndIndex', () => {
    beforeEach(() => {
        sequelizeMock = {} as jest.Mocked<Sequelize>;
    });

    test('If the panel exists, it should be returned', async () => {
        const panelData = {
            id:           1,
            image:        '../../superCoolImage.png'
        };

        (panelService.getPanelBasedOnPanelSetAndIndex as jest.Mock).mockReturnValue(() => Promise.resolve(panelData));

        const response = await _getPanelBasedOnPanelSetAndIndexController(sequelizeMock)(1, 0);

        expect(response).toEqual(panelData);
    });

    test('If the panel does not exist, it should return undefined', async () => {
        (panelService.getPanelBasedOnPanelSetAndIndex as jest.Mock).mockReturnValue(() => Promise.resolve(undefined));

        const response = await _getPanelBasedOnPanelSetAndIndexController(sequelizeMock)(-1000,1000);

        expect(response).toBeUndefined();
    });

    test('If an error occurs, it should return the error', async () => {
        (panelService.getPanelBasedOnPanelSetAndIndex as jest.Mock).mockReturnValue(() => Promise.reject( new Error('Some error getting panel')));

        const response = await _getPanelBasedOnPanelSetAndIndexController(sequelizeMock)(1000, -1000);

        expect(response).toBeInstanceOf(Error);
    });
});
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

    test('If the panel does not exist, it should return undefined', async () => {
        (panelService.getPanel as jest.Mock).mockReturnValue(() => Promise.resolve(undefined));

        const response = await _getPanelController(sequelizeMock)(10);

        expect(response).toBeUndefined();
    });

    test('If an error occurs, it should return the error', async () => {
        (panelService.getPanel as jest.Mock).mockReturnValue(() => Promise.reject(new Error('Some error getting panel')));

        const response = await _getPanelController(sequelizeMock)(1000);

        expect(response).toBeInstanceOf(Error);
    });
});
describe('_getPanelsFromPanelSetIDController', () => {
    beforeEach(() => {
        sequelizeMock = {} as jest.Mocked<Sequelize>;
    });

    test('If the panels exists, they should be returned', async () => {
        const panelData = [{
            id: 1,
            image:        '../../superCoolImage.png',
            index:        0,
        },
        {
            id: 2,
            image:        '../../superCoolImage.png',
            index:        1,
        },
        {
            id: 3,
            image:        '../../superCoolImage.png',
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
        (panelService.getPanelsFromPanelSetID as jest.Mock).mockReturnValue(() => Promise.resolve(new Error('Some error getting panels')));

        const response = await _getPanelsFromPanelSetIDController(sequelizeMock)(1000);

        expect(response).toBeInstanceOf(Error);
    });
});
describe('_createPanelController', () => {
    beforeEach(() => {
        sequelizeMock = {} as jest.Mocked<Sequelize>;
    });

    //panel_set_id invalid
    test('if panel_set_id is invalid, thrown an error', async() => {
        (getPanelSetByID as jest.Mock).mockReturnValue(() => Promise.resolve(null));
        const response = await _createPanelController(sequelizeMock)('image.png',3,-100);
        expect(response).toBeInstanceOf(Error);
    });

    //thrown error
    test('if an error is thrown, that error should be returned', async () =>{
        (userService.getUserByID as jest.Mock).mockReturnValue(() => Promise.resolve(new Error("I am error")));
        const response = await _createPanelSetController(sequelizeMock)("1");
        expect(response).toBeInstanceOf(Error);
    });

    //if input is valid update, return json object

    //if input is valid create, retunr json object
});
