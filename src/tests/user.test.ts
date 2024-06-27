
import { Sequelize, ValidationError } from 'sequelize';
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

// used for authenticating a user that doesn't exist
const undefinedUser = Object.freeze({
    email:       'does_not_exist@example.com',
    password:    'passWord1',
    displayName: 'user does not exist',
    id:          'AAAAAAAA-bbbb-cccc-dddd-eeeeeeeeeeee'
});

describe('Create User (Controller)', () => {
    test('Creating a user should return the new user', async () => {
        (userService.createUser as jest.Mock).mockReturnValue(() => Promise.resolve(userResponse));
        const newUser = await _createUserController(sequelizeMock())(user.email, user.password, user.displayName);
        expect(newUser).toEqual(userResponse);
    });

    test('Create user with bad data should throw an error', async () => {
        (userService.createUser as jest.Mock).mockReturnValue(() => { throw new Error(); });
        const newUser = await _createUserController(sequelizeMock())(undefined as any, undefined as any, undefined as any);
        expect(newUser).toBeInstanceOf(Error);
    });

    test('Create user with poorly formed email should throw a validation error', async () => {
        (userService.createUser as jest.Mock).mockReturnValue(() => { throw new ValidationError('Invalid email', []); });
        const newUser = await _createUserController(sequelizeMock())(user.badEmail, user.password, user.displayName);
        expect(newUser).toBeInstanceOf(ValidationError);
    });

    test('Create user with short display name should throw a validation error', async () => {
        (userService.createUser as jest.Mock).mockReturnValue(() => { throw new ValidationError('Invalid display name', []); });
        const newUser = await _createUserController(sequelizeMock())(user.badEmail, user.password, '');
        expect(newUser).toBeInstanceOf(ValidationError);
    });

    test('Create user with long display name should throw a validation error', async () => {
        (userService.createUser as jest.Mock).mockReturnValue(() => { throw new ValidationError('Invalid display name', []); });
        const newUser = await _createUserController(sequelizeMock())(user.badEmail, user.password, '>30 chars aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
        expect(newUser).toBeInstanceOf(ValidationError);
    });
});

describe('Authenticate User (Controller)', () => {
    test('Authenticating existing user should return the user', async () => {
        (userService.authenticate as jest.Mock).mockReturnValue(() => Promise.resolve(userResponse));
        const authUser = await _authenticateController(sequelizeMock())(user.email, user.password);
        expect(authUser).toEqual(userResponse);
    });

    test('Authenticating non-existing user should return undefined', async () => {
        (userService.authenticate as jest.Mock).mockReturnValue(() => Promise.resolve(undefined));
        const authUser = await _authenticateController(sequelizeMock())(undefinedUser.email, undefinedUser.password);
        expect(authUser).toBe(undefined);
    });

    test('Authenticating user with bad data should throw an error', async () => {
        (userService.authenticate as jest.Mock).mockReturnValue(() => { throw new Error(); });
        const authUser = await _authenticateController(sequelizeMock())(undefined as any, undefined as any);
        expect(authUser).toBeInstanceOf(Error);
    });
});

describe('Change Password (Controller)', () => {
    test('Changing password successfully should return true', async () => {
        (userService.changePassword as jest.Mock).mockReturnValue(() => Promise.resolve(true));
        const passwordChange = await _changePasswordController(sequelizeMock())(user.email, user.password, user.newPassword);
        expect(passwordChange).toBe(true);
    });

    test('Changing password with invalid authentication should return false', async () => {
        (userService.changePassword as jest.Mock).mockReturnValue(() => Promise.resolve(false));
        const passwordChange = await _changePasswordController(sequelizeMock())(undefinedUser.email, undefinedUser.password, user.newPassword);
        expect(passwordChange).toBe(false);
    });

    test('Changing password to the same one should throw an error', async () => {

        // return doesn't matter since error is thrown before changePassword() is ever called
        (userService.changePassword as jest.Mock).mockReturnValue(() => Promise.resolve('can be literally anything'));
        const passwordChange = await _changePasswordController(sequelizeMock())(user.email, user.password, user.password);
        expect(passwordChange).toBeInstanceOf(Error);
    });

    test('Changing password with bad data should throw an error', async () => {
        (userService.changePassword as jest.Mock).mockReturnValue(() => { throw new Error(); });
        const passwordChange = await _changePasswordController(sequelizeMock())(undefined as any, undefined as any, 1234 as any);
        expect(passwordChange).toBeInstanceOf(Error);
    });
});

describe('Change Display Name (Controller)', () => {
    test('Changing display name successfully should return true', async () => {
        (userService.changeDisplayName as jest.Mock).mockReturnValue(() => Promise.resolve(true));
        const displayNameChange = await _changeDisplayNameController(sequelizeMock())(user.email, user.password, user.newDisplayName);
        expect(displayNameChange).toBe(true);
    });

    test('Changing display name with invalid authentication should return false', async () => {
        (userService.changeDisplayName as jest.Mock).mockReturnValue(() => Promise.resolve(false));
        const displayNameChange = await _changeDisplayNameController(sequelizeMock())(undefinedUser.email, undefinedUser.password, user.newDisplayName);
        expect(displayNameChange).toBe(false);
    });

    test('Changing display name with bad data should throw an error', async () => {
        (userService.changeDisplayName as jest.Mock).mockReturnValue(() => { throw new Error(); });
        const displayNameChange = await _changeDisplayNameController(sequelizeMock())(undefined as any, 1234 as any, {} as any);
        expect(displayNameChange).toBeInstanceOf(Error);
    });
});


describe('Get User By ID (Controller)', () => {

    test('If the user exists, it should be returned', async () => {
        (userService.getUserByID as jest.Mock).mockReturnValue(() => Promise.resolve(userResponse));
        const response = await _getUserByIDController(sequelizeMock())(user.id);
        expect(response).toEqual(userResponse);
    });

    test('If the user does not exist, it should return undefined', async () => {
        (userService.getUserByID as jest.Mock).mockReturnValue(() => Promise.resolve(undefined));
        const response = await _getUserByIDController(sequelizeMock())(undefinedUser.id);
        expect(response).toBeUndefined();
    });

    test('Using bad data should throw an error', async () => {
        (userService.getUserByID as jest.Mock).mockReturnValue(() => {throw new Error()});
        const response = await _getUserByIDController(sequelizeMock())(undefined as any);
        expect(response).toBeInstanceOf(Error);
    });
});
