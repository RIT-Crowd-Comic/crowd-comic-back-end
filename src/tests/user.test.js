import {
    _createUserController, _authenticateController, _changePasswordController, _changeDisplayNameController
} from '../requestHandlers/user';
import {
    describe, test, expect, jest, beforeAll
} from '@jest/globals';


let users = [];
const sequelizeInstance = {
    models: {
        user: {
            create: jest.fn((user) => {
                const newUser = { ...user, id: Math.floor(Math.random() * 1e8) }
                users.push(newUser);
                return newUser;
            }),
            findOne: jest.fn((filter) => users.find(user => Object.keys(filter.where).every(where => user[where] === filter.where[where]))),
            findAll: jest.fn(() => [{
                email: 'coolman@example.com',
                display_name: 'cool man',
                id: '9b68184b-784a-4839-98d2-6c88287a5544',
                password: '$2b$10$x72tz14oSD4DmPMASXur7eo/VjtJnO8vaMfGIM3Y0HiCC6G2dJA62'
            }]),
        }
    },
};

describe('user queries', () => {
    beforeAll(() => users = []);

    test('create user', async () => {
        const newUser = await _createUserController(sequelizeInstance)('coolman@example.com', 'coolMan87', 'cool man')
        expect(newUser).toEqual(expect.objectContaining({
            email: 'coolman@example.com',
            display_name: 'cool man'
        }));
    });


    test('authenticate user', async () => {
        const authUser = await _authenticateController(sequelizeInstance)('coolman@example.com', 'coolMan87')
        expect(authUser).toEqual(expect.objectContaining(
            {
                email: 'coolman@example.com',
                display_name: 'cool man'
            }
        ));
    });

    test('authenticate non-existing user', async () => {
        const authUser = await _authenticateController(sequelizeInstance)('user_does_not_exist@example.com', 'fakeUser999')
        expect(authUser).toBe(undefined);
    });
});
