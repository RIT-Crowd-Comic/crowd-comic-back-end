
import { Sequelize } from 'sequelize';
import {
    _createUserController, _authenticateController, _changePasswordController, _changeDisplayNameController,
    _getUserByIDController
} from '../requestHandlers/user';
import {
    describe, test, expect, jest
} from '@jest/globals';
import * as userService from '../services/userService';
jest.mock('../services/userService');


const sequelizeMock = () => ({} as jest.Mocked<Sequelize>);

// used in initial user creation
const user = Object.freeze({
    email:          'coolman@example.com',
    badEmail:       'username',
    password:       'coolMan87',
    displayName:    'cool man',
    newPassword:    'coolNewPassword123',
    newDisplayName: 'big brained baboon',
    id:             'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
});

// used when querying for a user
const userResponse = Object.freeze({
    email:       'coolman@example.com',
    displayName: 'cool man',
    id:          'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
});

describe('Create User (Controller)', () => {
    test('Creating a user should return the new user', async () => {
        (userService.createUser as jest.Mock).mockReturnValue(() => Promise.resolve(userResponse));
        const newUser = await _createUserController(sequelizeMock())(user.email, user.password, user.displayName);
        expect(newUser).toEqual(userResponse);
    });

    test('Creating a user with bad data should return an Error object', async () => {
        (userService.createUser as jest.Mock).mockReturnValue(() => { throw new Error(); });
        const newUser = await _createUserController(sequelizeMock())(undefined as any, undefined as any, undefined as any);
        expect(newUser).toBeInstanceOf(Error);
    });
});

describe('Authenticate User (Controller)', () => {
    test('Authenticating should return the user or undefined', async () => {
        (userService.authenticate as jest.Mock).mockReturnValue(() => Promise.resolve(userResponse));
        const authUser = await _authenticateController(sequelizeMock())(user.email, user.password);
        expect(authUser).toEqual(userResponse);
    });

    test('Authenticating user with bad data should return an Error object', async () => {
        (userService.authenticate as jest.Mock).mockReturnValue(() => { throw new Error(); });
        const authUser = await _authenticateController(sequelizeMock())(undefined as any, undefined as any);
        expect(authUser).toBeInstanceOf(Error);
    });
});

describe('Change Password (Controller)', () => {
    test('Changing password should return a boolean for success', async () => {
        (userService.changePassword as jest.Mock).mockReturnValue(() => Promise.resolve(true));
        const passwordChange = await _changePasswordController(sequelizeMock())(user.email, user.password, user.newPassword);
        expect(passwordChange).toBe(true);
    });

    test('Changing password to the same one should return an Error object', async () => {

        const errorResponse = new Error('New password must not be the same as the old password');
        // return doesn't matter since error is thrown before changePassword() is ever called
        (userService.changePassword as jest.Mock).mockReturnValue(() => Promise.resolve('can be literally anything'));
        const passwordChange = await _changePasswordController(sequelizeMock())(user.email, user.password, user.password);
        expect(passwordChange).toEqual(errorResponse);
    });

    test('Changing password with bad data should return an Error object', async () => {
        (userService.changePassword as jest.Mock).mockReturnValue(() => { throw new Error(); });
        const passwordChange = await _changePasswordController(sequelizeMock())(undefined as any, undefined as any, 1234 as any);
        expect(passwordChange).toBeInstanceOf(Error);
    });
});

describe('Change Display Name (Controller)', () => {
    test('Changing display name should return a boolean for success', async () => {
        (userService.changeDisplayName as jest.Mock).mockReturnValue(() => Promise.resolve(true));
        const displayNameChange = await _changeDisplayNameController(sequelizeMock())(user.email, user.password, user.newDisplayName);
        expect(displayNameChange).toBe(true);
    });

    test('Changing display name with bad data should return an Error object', async () => {
        (userService.changeDisplayName as jest.Mock).mockReturnValue(() => { throw new Error(); });
        const displayNameChange = await _changeDisplayNameController(sequelizeMock())(undefined as any, 1234 as any, {} as any);
        expect(displayNameChange).toBeInstanceOf(Error);
    });
});


describe('Get User By ID (Controller)', () => {

    test('Getting user should return either a user object or undefined', async () => {
        (userService.getUserByID as jest.Mock).mockReturnValue(() => Promise.resolve(userResponse));
        const response = await _getUserByIDController(sequelizeMock())(user.id);
        expect(response).toEqual(userResponse);
    });

    test('Get user using bad data should return an Error object', async () => {
        (userService.getUserByID as jest.Mock).mockReturnValue(() => {throw new Error()});
        const response = await _getUserByIDController(sequelizeMock())(undefined as any);
        expect(response).toBeInstanceOf(Error);
    });
});
