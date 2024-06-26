import { resolvePlugin } from '@babel/core';
import { _createPanelSetController, _getPanelSetByIDController, _getAllPanelSetsFromUserController } from '../requestHandlers/panelSet';

import * as panelSetService from '../services/panelSetService';
import * as userService from '../services/userService';

import { Sequelize } from 'sequelize';
jest.mock('../services/panelSetService');
jest.mock('../services/userService');


let sequelizeMock: jest.Mocked<Sequelize>;
beforeEach(() => {
    sequelizeMock = {} as jest.Mocked<Sequelize>;
});
const panelData = {id: 'panelsetID'}

describe("_createPanelSetController", () => {
    test('if id is invalid, thrown an error', async() => {
        (userService.getUserByID as jest.Mock).mockReturnValue(() => Promise.resolve(null));
        const response = await _createPanelSetController(sequelizeMock)("");
        expect(response).toBeInstanceOf(Error);
    });
    test('if an error is thrown, that error should be returned', async () =>{
        (userService.getUserByID as jest.Mock).mockReturnValue(() => Promise.resolve(new Error("I am error")));
        const response = await _createPanelSetController(sequelizeMock)("1");
        expect(response).toBeInstanceOf(Error);
    });
    test('if input is valid, a json object should be returned', async () =>{
        (userService.getUserByID as jest.Mock).mockReturnValue(() => Promise.resolve({id: 'a'}));
        (panelSetService.createPanelSet as jest.Mock).mockReturnValue(() => Promise.resolve(panelData));
        const response = await _createPanelSetController(sequelizeMock)("1");
        expect(response).toEqual(panelData);
    });
})

describe("_getAllPanelSetsFromUserController", () => {
    test('if input is valid, a json object should be returned', async () => {
        (panelSetService.getAllPanelSetsFromUser as jest.Mock).mockReturnValue(() => Promise.resolve(panelData));
        const response = await _getAllPanelSetsFromUserController(sequelizeMock)("1");
        expect(response).toEqual(panelData);
    });
    test('if an error is thrown, that error should be returned', async () =>{
        (panelSetService.getAllPanelSetsFromUser as jest.Mock).mockReturnValue(() => Promise.resolve(new Error("I am error")));
        const response = await _getAllPanelSetsFromUserController(sequelizeMock)("1");
        expect(response).toBeInstanceOf(Error);
    });
});

describe("_getPanelSetByIDController", () => {
    test('if input is valid, a json object should be returned', async () =>{
        (panelSetService.getPanelSetByID as jest.Mock).mockReturnValue(() => Promise.resolve(panelData));
        const response = await _getPanelSetByIDController(sequelizeMock)(1);
        expect(response).toEqual(panelData);
    });

    test('if an error is thrown, that error should be returned', async () =>{
        (panelSetService.getPanelSetByID as jest.Mock).mockReturnValue(() => Promise.resolve(new Error("I am error")));
        const response = await _getPanelSetByIDController(sequelizeMock)(1);
        expect(response).toBeInstanceOf(Error);
    });
});