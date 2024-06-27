import {
    _getPanelController, _getPanelsFromPanelSetIDController, _getPanelBasedOnPanelSetAndIndexController, _createPanelController
} from '../requestHandlers/panel';

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

        const response = await _getPanelBasedOnPanelSetAndIndexController(sequelizeMock)(1, 0);

        expect(response).toEqual(panelData);
    });

    test('If an error occurs, it should return the error', async () => {
        (panelService.getPanelBasedOnPanelSetAndIndex as jest.Mock).mockReturnValue(() => Promise.reject(new Error('Some error getting panel')));

        const response = await _getPanelBasedOnPanelSetAndIndexController(sequelizeMock)(1000, -1000);

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

        const response = await _getPanelController(sequelizeMock)(1);

        expect(response).toEqual(panelData);
    });

    test('If an error occurs, it should return the error', async () => {
        (panelService.getPanel as jest.Mock).mockReturnValue(() => Promise.reject(new Error('Some error getting panel')));

        const response = await _getPanelController(sequelizeMock)(1000);

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

        const response = await _getPanelsFromPanelSetIDController(sequelizeMock)(1);

        expect(response).toEqual(panelData);
    });

    test('If an error occurs, it should return the error', async () => {
        (panelService.getPanelsFromPanelSetID as jest.Mock).mockReturnValue(() => Promise.resolve(new Error('Some error getting panels')));

        const response = await _getPanelsFromPanelSetIDController(sequelizeMock)(1000);

        expect(response).toBeInstanceOf(Error);
    });
});
describe('_createPanelController', () => {

    // for mocking the get panel set, it only needs to exist, so data doesn't matter
    const getPanelSetObj = { authorid: 'asdasdsdgrwet' };

    // expected output getPanelSetByID
    const getPanelObj = {
        image: 'supercoolImage.png',
        index: 0
    };

    // expected output panelCreate
    const CreatePanelObj = {
        id:           1,
        image:        'create.png',
        index:        0,
        panel_set_id: 1
    };

    // panelUpdate
    const UpdatePanelObj = {
        id:           1,
        image:        'update.png',
        index:        0,
        panel_set_id: 1
    };

    // panel_set_id invalid
    test('if panel_set_id is invalid, thrown an error', async() => {
        (getPanelSetByID as jest.Mock).mockReturnValue(() => Promise.resolve(null));
        const response = await _createPanelController(sequelizeMock)('image.png', 3, -100);
        expect(response).toBeInstanceOf(Error);
    });

    // if existing panel found, update, return valid json object
    test('if panel already exists, update it and return the object created by updatePanel', async () =>{
        (getPanelSetByID as jest.Mock).mockReturnValue(() => Promise.resolve(getPanelSetObj));
        (panelService.getPanelBasedOnPanelSetAndIndex as jest.Mock).mockReturnValue(() => Promise.resolve(getPanelObj));
        (panelService.updatePanel as jest.Mock).mockResolvedValue(UpdatePanelObj);
        const response = await _createPanelController(sequelizeMock)('image.png', 3, 1);
        expect(response).toBe(UpdatePanelObj);
    });

    // if existing panel isn't found  create, return json object
    test('if panel doesnt exist, create it and return the created object from the createPanel', async () =>{
        (getPanelSetByID as jest.Mock).mockReturnValue(() => Promise.resolve(getPanelSetObj));
        (panelService.getPanelBasedOnPanelSetAndIndex as jest.Mock).mockReturnValue(() => Promise.resolve(undefined));
        (panelService.createPanel as jest.Mock).mockReturnValue(() => Promise.resolve(CreatePanelObj));
        const response = await _createPanelController(sequelizeMock)('image.png', 3, 1);
        expect(response).toBe(CreatePanelObj);
    });

    // error creating
    test('if something throws an error in one of the services', async () =>{
        (getPanelSetByID as jest.Mock).mockReturnValue(() => Promise.resolve(getPanelSetObj));
        (panelService.getPanelBasedOnPanelSetAndIndex as jest.Mock).mockReturnValue(() => Promise.resolve(undefined));
        (panelService.createPanel as jest.Mock).mockReturnValue(() => Promise.resolve(new Error('Error creating panel')));
        const response = await _createPanelController(sequelizeMock)('', 3, -1);
        expect(response).toBeInstanceOf(Error);
    });
});
