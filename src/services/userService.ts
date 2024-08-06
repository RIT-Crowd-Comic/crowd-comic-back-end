import { Sequelize } from 'sequelize';
import { ISession, IUser } from '../models';
import bcrypt from 'bcrypt';
import { _deleteImageController, _saveImageController } from '../requestHandlers/image';
import { getImage } from './imageService';

/**
 * Information required to create a new user
 */
interface UserConfig {
    password: string,
    email: string,
    display_name: string,
}

interface UserInfo {
    email: string,
    display_name: string,
    id: string,
    profile_picture: string
    created_at?: string,
    updated_at?: string
}


const PASSWORD_SALT_ROUNDS = 10;

/**
 * Create a new user
 * @param {} newUser 
 */
const createUser = (sequelize : Sequelize) => async (newUser: UserConfig): Promise<UserInfo> => {

    const {
        display_name, email, id, profile_picture, created_at, updated_at
    } = await sequelize.models.user.create({
        email:           newUser.email,
        password:        await bcrypt.hash(newUser.password, PASSWORD_SALT_ROUNDS),
        display_name:    newUser.display_name,
        profile_picture: null
    }) as IUser;

    return {
        display_name, email, id, profile_picture, created_at, updated_at
    };
};

/**
 * Authenticate a user before retrieve the user's data
 * @param email 
 * @param password un-bcrypt.hashed password
 * @returns 
 */
const authenticate = (sequelize : Sequelize) => async (email: string, password: string):
    Promise<UserInfo | undefined> => {

    const user = await sequelize.models.user.findOne({ where: { email } }) as IUser;

    if (!user) return undefined;

    const match = await bcrypt.compare(password, user.password);

    if (match) return {
        email:           user.email,
        display_name:    user.display_name,
        id:              user.id,
        profile_picture: user.profile_picture,
    } as UserInfo;

    return undefined;
};

/**
 * Change the password for a user
 * @returns whether or not the password change was successful
 */
const changePassword = (sequelize : Sequelize) => async (email: string, password: string, newPassword: string): Promise<boolean> => {

    // check if current email/password are correct
    const user = await sequelize.models.user.findOne({ where: { email } }) as IUser;
    if (!user) return false;
    const match = await bcrypt.compare(password, user.password);
    if (!match) return false;

    await user.update({ password: await bcrypt.hash(newPassword, PASSWORD_SALT_ROUNDS) });
    return true;
};


/**
 * Change a user's email
 * @returns whether or not the email change was successful
 */
const changeDisplayName = (sequelize : Sequelize) => async (email: string, newDisplayName: string): Promise<boolean> => {

    // check if current email/password are correct
    const user = await sequelize.models.user.findOne({ where: { email } }) as IUser;
    if (!user) return false;

    await user.update({ display_name: newDisplayName });
    return true;
};

/**
 * 
 * @param {string} id ID of the user to query info from
 * @returns {UserInfo} Info from user with provided ID
 */
const getUserByID = (sequelize: Sequelize) => async (id: string) => {
    const user = await sequelize.models.user.findByPk(id) as IUser;
    return {
        email:           user.email,
        display_name:    user.display_name,
        id:              user.id,
        profile_picture: user.profile_picture,
        created_at:      user.created_at,
        updated_at:      user.updated_at,

    } as UserInfo;
};

/**
 * Gets a user object from a session id
 * @param {string} session_id ID of session to query
 * @returns {UserInfo} User associated with given session
 */
const getUserBySession = (sequelize: Sequelize) => async (session_id: string) => {
    const session = await sequelize.models.session.findByPk(session_id) as ISession;
    if (!session) return null;
    const user = await sequelize.models.user.findByPk(session.user_id) as IUser;
    return {
        email:           user.email,
        display_name:    user.display_name,
        id:              user.id,
        profile_picture: user.profile_picture
    } as UserInfo;
};

/**
 * Change the profile picture of a user
 * @param {string} email Email of user to change
 * @param {Buffer} buffer Image buffer
 * @param {string} mimetype Image type
 * @returns 
 */
const changePfp = (sequelize: Sequelize) => async (email: string, buffer: Buffer, mimetype: string) => {
    const user = await sequelize.models.user.findOne({ where: { email } }) as IUser;
    if (!user) throw new Error(`No user found with email ${email}`);

    if(user.profile_picture) {
        const deleted = await _deleteImageController(user.profile_picture.substring(user.profile_picture.length - 49)) as {id: string} | Error; // 49 is the length of the image id
        if (deleted instanceof Error) throw new Error(`S3 Error ${deleted?.message}`);
    }

    const id = user.id + Date.now();
    const PFP = await _saveImageController(id, buffer, mimetype) as {id: string} | Error;
    if (!PFP || PFP instanceof Error) throw new Error(`S3 Error ${PFP?.message}`);

    const url = await getImage(id);
    await user.update({ profile_picture: url });
    return url;
};

export {
    createUser, authenticate, changePassword, changeDisplayName, getUserByID, getUserBySession, changePfp, UserInfo,
};
