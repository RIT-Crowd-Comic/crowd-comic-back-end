import { _getUserByIDController } from '../requestHandlers/user';

import * as userService from '../services/userService';
import { Sequelize } from 'sequelize';
jest.mock('../services/userService');

describe('_getUserByIDController', () => {
    let sequelizeMock: jest.Mocked<Sequelize>;

    beforeEach(() => {
        sequelizeMock = {} as jest.Mocked<Sequelize>;
    });

    test('If the user exists, it should be returned', async () => {
        const userData = {
            password:     'Password!',
            email:        'email@yahoo.com',
            display_name: 'display'
        };

        (userService.getUserByID as jest.Mock).mockReturnValue(() => Promise.resolve(userData));

        const response = await _getUserByIDController(sequelizeMock)('8c2d50d1-9b1f-483c-b267-cecb929ffb97');

        expect(response).toEqual(userData);
    });

    test('If the user does not exist, it should return undefined', async () => {
        (userService.getUserByID as   jest.Mock).mockReturnValue(() => Promise.resolve(undefined));

        const response = await _getUserByIDController(sequelizeMock)('8c2d50d1-9b1f-483c-b267-cecb929ffb97');

        expect(response).toBeUndefined();
    });

    test('If an error occurs, it should return the error', async () => {
        const error = new Error('Some error');
        (userService.getUserByID as jest.Mock).mockReturnValue(() => Promise.reject(error));

        const response = await _getUserByIDController(sequelizeMock)('8c2d50d1-9b1f-483c-b267-cecb929ffb97');

        expect(response).toBe(error);
    });
});
