import { _createSessionController, _getSessionController } from '../requestHandlers/session';
import * as sessionService from '../services/sessionService';
import { getUserByID } from '../services/userService';
import { Sequelize } from 'sequelize';
jest.mock('../services/sessionService');
jest.mock('../services/userService');

const sequelize = () => ({} as jest.Mocked<Sequelize>);

describe('Create Session Controller', () => {
    const serviceResponse = {
        id:      'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
        user_id: 'ffffffff-gggg-hhhh-iiii-jjjjjjjjjjjj',
    };

    test('Successfully creating a session returns the session and users ids', async () => {
        (sessionService.createSession as jest.Mock).mockReturnValue(() => Promise.resolve(serviceResponse));
        (getUserByID as jest.Mock).mockReturnValue(() => Promise.resolve({ user: 'user' }));
        const response = await _createSessionController(sequelize())('ffffffff-gggg-hhhh-iiii-jjjjjjjjjjjj');
        expect(response).toEqual(serviceResponse);
    });

    test('If no user is found, throw no user found error', async () => {
        const noUserErr = new Error(`no user found with id ffffffff-gggg-hhhh-iiii-jjjjjjjjjjjj`);
        (getUserByID as jest.Mock).mockReturnValue(() => { Promise.resolve(null); });
        const response = await _createSessionController(sequelize())('ffffffff-gggg-hhhh-iiii-jjjjjjjjjjjj');
        expect(response).toEqual(noUserErr);
    });

    test('If an error is thrown, return the error', async () => {
        (sessionService.createSession as jest.Mock).mockRejectedValue(new Error('error message'));
        const response = await _createSessionController(sequelize())('ffffffff-gggg-hhhh-iiii-jjjjjjjjjjjj');
        expect(response).toBeInstanceOf(Error);
    });
});

describe('Get Session Controller', () => {
    const serviceResponse = {
        'id':        'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
        'user_id':   'ffffffff-gggg-hhhh-iiii-jjjjjjjjjjjj',
        'createdAt': '2024-01-01T00:00:00.000Z',
        'updatedAt': '2024-07-01T00:00:00.000Z'
    };

    test('If the session is found, return it', async () => {
        (sessionService.getSession as jest.Mock).mockReturnValue(() => Promise.resolve(serviceResponse));
        const response = await _getSessionController(sequelize())('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee');
        expect(response).toEqual(serviceResponse);
    });

    test('If an error is thrown, return the error', async () => {
        (sessionService.getSession as jest.Mock).mockReturnValue(() => { throw new Error('error message'); });
        const response = await _getSessionController(sequelize())('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee');
        expect(response).toBeInstanceOf(Error);
    });
});
