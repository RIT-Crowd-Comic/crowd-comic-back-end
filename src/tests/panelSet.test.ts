import {
    _createPanelSetController, _getPanelSetByIDController, _getAllPanelSetsFromUserController, _getAllTrunkSetsController, _getTreeController
} from '../requestHandlers/panelSet';
import * as panelSetService from '../services/panelSetService';
import * as userService from '../services/userService';
import { Sequelize } from 'sequelize';
jest.mock('../services/panelSetService');
jest.mock('../services/userService');


const sequelizeMock = (props: object = {}) => ({ ...props } as jest.Mocked<Sequelize>);

const panelData = { id: 'panelsetID' };

describe('Create Panel Set Controller', () => {
    test('If id is invalid, thrown an error', async() => {
        (userService.getUserByID as jest.Mock).mockReturnValue(() => Promise.resolve(null));
        const response = await _createPanelSetController(sequelizeMock())('', 'new panel set');
        expect(response).toBeInstanceOf(Error);
    });
    test('If an error is thrown, that error should be returned', async () =>{
        (userService.getUserByID as jest.Mock).mockReturnValue(() => { throw new Error('I am an error'); });
        const response = await _createPanelSetController(sequelizeMock())('1', 'new panel set');
        expect(response).toBeInstanceOf(Error);
    });
    test('If input is valid, a json object should be returned', async () =>{
        (userService.getUserByID as jest.Mock).mockReturnValue(() => Promise.resolve({ id: 'a' }));
        (panelSetService.createPanelSet as jest.Mock).mockReturnValue(() => Promise.resolve(panelData));
        const response = await _createPanelSetController(sequelizeMock())('a', 'new panel set');
        expect(response).toEqual(panelData);
    });
});

describe('Get Panel Set By ID Controller', () => {
    test('If input is valid, a json object should be returned', async () =>{
        (panelSetService.getPanelSetByID as jest.Mock).mockReturnValue(() => Promise.resolve(panelData));
        const response = await _getPanelSetByIDController(sequelizeMock())(1);
        expect(response).toEqual(panelData);
    });

    test('If an error is thrown, that error should be returned', async () =>{
        (panelSetService.getPanelSetByID as jest.Mock).mockReturnValue(() => { throw new Error('I am an error'); });
        const response = await _getPanelSetByIDController(sequelizeMock())(1);
        expect(response).toBeInstanceOf(Error);
    });
});

describe('Get All Panel Sets From User Controller', () => {
    test('If input is valid, a json object should be returned', async () => {
        (panelSetService.getAllPanelSetsFromUser as jest.Mock).mockReturnValue(() => Promise.resolve(panelData));
        const response = await _getAllPanelSetsFromUserController(sequelizeMock())('1');
        expect(response).toEqual(panelData);
    });
    test('If an error is thrown, that error should be returned', async () =>{
        (panelSetService.getAllPanelSetsFromUser as jest.Mock).mockReturnValue(() => { throw new Error('I am an error'); });
        const response = await _getAllPanelSetsFromUserController(sequelizeMock())('1');
        expect(response).toBeInstanceOf(Error);
    });
});

describe('Get All Trunk Sets', () => {
    test('If search is successful, return array of trunks', async () => {
        const trunkData = [panelData, panelData];
        (panelSetService.getAllTrunkSets as jest.Mock).mockResolvedValue(trunkData);
        const response = await _getAllTrunkSetsController(sequelizeMock());
        expect(response).toEqual(trunkData);
    });
    test('If error occurs, return an error', async () => {
        (panelSetService.getAllTrunkSets as jest.Mock).mockRejectedValue(new Error('Error Message'));
        const response = await _getAllTrunkSetsController(sequelizeMock());
        expect(response).toBeInstanceOf(Error);
    });
});

describe('Get tree', () => {

    test('If there is an error from _getPanelSetByIDController, return it', async () => {
        (panelSetService.getPanelSetByID as jest.Mock).mockReturnValue(() => { throw new Error('I am an error'); });
        const response = await _getTreeController(sequelizeMock())(1);
        expect(response).toBeInstanceOf(Error);
    });

    test('If the response from _getPanelSetByIDController is not a panel_set throw an error', async () => {
        (panelSetService.getPanelSetByID as jest.Mock).mockResolvedValue(null);
        const response = await _getTreeController(sequelizeMock())(1);
        expect(response).toBeInstanceOf(Error);
    });

    test('valid data should give results from getTree', async () => {
        const results = 'a';
        (panelSetService.getPanelSetByID as jest.Mock).mockReturnValue(() => Promise.resolve({ author_id: '1' }));
        (panelSetService.getTree as jest.Mock).mockReturnValue(() => Promise.resolve(results));
        const response = await _getTreeController(sequelizeMock())(1);
        expect(response).toEqual(results);
    });
});
