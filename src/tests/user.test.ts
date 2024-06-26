import { Sequelize } from 'sequelize';
import { _createUserController, _authenticateController, _changePasswordController, _changeDisplayNameController } from '../requestHandlers/user';
import { describe, test, expect, jest } from '@jest/globals';
import * as userService from '../services/userService';
jest.mock('../services/userService');


describe('user queries', () => {
    const sequelizeMock = () => ({} as jest.Mocked<Sequelize>);

    const user = {
        email: 'coolman@example.com',
        password: 'coolMan87',
        display_name: 'cool man',
        id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'
    }

    const undefinedUser = {
        email: 'does_not_exist@example.com',
        password: 'passWord1',
        display_name: 'user does not exist',
        id: 'AAAAAAAA-bbbb-cccc-dddd-eeeeeeeeeeee'
    }

    test('create user', async () => {
        // successful creation returns user object
        (userService.createUser as jest.Mock).mockReturnValue(() => Promise.resolve(user));
        const newUser = await _createUserController(sequelizeMock())(user.email, user.password, user.display_name);
        expect(newUser).toEqual(expect.objectContaining({
            email: user.email,
            display_name: user.display_name,
            id: user.id
        }));
    });

    test('create user with bad data', async () => {
        // successful creation returns user object
        (userService.createUser as jest.Mock).mockReturnValue(() => {throw new Error()});
        const newUser = await _createUserController(sequelizeMock())(undefined as any, undefined as any, undefined as any);
        expect(newUser).toBeInstanceOf(Error);
    });


    test('authenticate user', async () => {
        // successful authentication returns user object
        (userService.authenticate as jest.Mock).mockReturnValue(() => Promise.resolve(user));
        const authUser = await _authenticateController(sequelizeMock())(user.email, user.password);
        expect(authUser).toEqual(expect.objectContaining({
            email: user.email,
            display_name: user.display_name,
            id: user.id
        }));
    });

    test('authenticate non-existing user', async () => {
        // failed authentication returns undefined
        (userService.authenticate as jest.Mock).mockReturnValue(() => Promise.resolve(undefined));
        const authUser = await _authenticateController(sequelizeMock())(undefinedUser.email, undefinedUser.password);
        expect(authUser).toBe(undefined);
    });
});
