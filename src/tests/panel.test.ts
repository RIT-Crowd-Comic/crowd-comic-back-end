import { _getPanelController, _getPanelsFromPanelSetIDController, _getPanelBasedOnPanelSetAndIndexController, _createPanelController } from '../requestHandlers/panel';

import * as panelService from '../services/panelService';
import { getPanelSetByID } from '../services/panelSetService';
import { Sequelize} from 'sequelize';
jest.mock('../services/panelService');
jest.mock('../services/panelSetService');

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

    //for mocking the get panel set, it only needs to exist, so data doesn't matter
    const getPanelSetObj = {
        authorid: "asdasdsdgrwet"
    }
    //expected output getPanelSetByID
    const getPanelObj = {
        image: "supercoolImage.png",
        index: 0
    }
    //expected output panelUpdate
    const updateAndCreatePanelObj = {
        id: 1,
        image: "randomimage.png",
        index: 0, 
        panel_set_id: 1
    }

    //panel_set_id invalid
    test('if panel_set_id is invalid, thrown an error', async() => {
        (getPanelSetByID as jest.Mock).mockReturnValue(() => Promise.resolve(null));
        const response = await _createPanelController(sequelizeMock)('image.png',3,-100);
        expect(response).toBeInstanceOf(Error);
    });
    //thrown error is thrown by the get panel id
    test('if an error is thrown for getting panel set, that error should be returned', async () =>{
        (getPanelSetByID as jest.Mock).mockReturnValue(() => Promise.resolve(new Error("Error Getting Panel")));
        const response = await _createPanelController(sequelizeMock)('image.png',3,-100);
        expect(response).toBeInstanceOf(Error);
    });
    //thrown error for checking panel exist
    test('if an error is thrown attempting to get if the panel exists, that error should be returned', async () =>{
        (getPanelSetByID as jest.Mock).mockReturnValue(() => Promise.resolve(getPanelSetObj));
        (panelService.getPanelBasedOnPanelSetAndIndex as jest.Mock).mockImplementation(() => {throw new Error("Error looking for panel")});
        const response = await _createPanelController(sequelizeMock)('image.png',3,-100);
        expect(response).toBeInstanceOf(Error);
    });
    //if existing panel found, update, return valid json object
    test('if panel already exists, update it', async () =>{
        (getPanelSetByID as jest.Mock).mockReturnValue(() => Promise.resolve(getPanelSetObj));
        (panelService.getPanelBasedOnPanelSetAndIndex as jest.Mock).mockReturnValue(() => Promise.resolve(getPanelObj));
        (panelService.updatePanel as jest.Mock).mockResolvedValue((updateAndCreatePanelObj));
        const response = await _createPanelController(sequelizeMock)('image.png',3,1);
        console.log(response);
        expect(response).toBe(updateAndCreatePanelObj);
    });
    //error updating
    test('if panel update errors, return it', async () =>{
        (getPanelSetByID as jest.Mock).mockReturnValue(() => Promise.resolve(getPanelSetObj));
        (panelService.getPanelBasedOnPanelSetAndIndex as jest.Mock).mockReturnValue(() => Promise.resolve(getPanelObj));
        (panelService.updatePanel as jest.Mock).mockImplementation(() =>{throw new Error("Error Updating Panel")});
        const response = await _createPanelController(sequelizeMock)('',3,-1);
        expect(response).toBeInstanceOf(Error);
    });
    //if existing panel isn't found  create, return json object
    //if existing panel found, update, return valid json object
    test('if panel doesnt exist, create it', async () =>{
        (getPanelSetByID as jest.Mock).mockReturnValue(() => Promise.resolve(getPanelSetObj));
        (panelService.getPanelBasedOnPanelSetAndIndex as jest.Mock).mockReturnValue(() => Promise.resolve(undefined));
        (panelService.createPanel as jest.Mock).mockReturnValue(() => Promise.resolve(updateAndCreatePanelObj));
        const response = await _createPanelController(sequelizeMock)('image.png',3,1);
        expect(response).toBe(updateAndCreatePanelObj);
    });

    //error creating
    test('if panel create throws error, return it', async () =>{
        (getPanelSetByID as jest.Mock).mockReturnValue(() => Promise.resolve(getPanelSetObj));
        (panelService.getPanelBasedOnPanelSetAndIndex as jest.Mock).mockReturnValue(() => Promise.resolve(undefined));
        (panelService.createPanel as jest.Mock).mockReturnValue(() => Promise.resolve(new Error("Error creating panel")));
        const response = await _createPanelController(sequelizeMock)('',3,-1);
        expect(response).toBeInstanceOf(Error);
    });
});
