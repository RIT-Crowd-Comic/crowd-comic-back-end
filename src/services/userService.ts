import { Sequelize } from 'sequelize';
import { sequelize } from '../database';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';

/**
 * Information required to create a new user
 */
interface UserConfig {
    username: string,
    password: string,
    email: string,
    display_name: string,
}

interface UserInfo {
    username: string,
    email: string,
    display_name: string,
    id: string,
}


const PASSWORD_SALT_ROUNDS = 10;

/**
     * Create a new user
     * @param {} newUser 
     */
const createUser = async (newUser: UserConfig): Promise<UserInfo> => {

    const {
        username,
        display_name, email, id
    } = await User.create({
        username:     newUser.username,
        display_name: newUser.display_name,
        password:     await bcrypt.hash(newUser.password, PASSWORD_SALT_ROUNDS),
        email:        newUser.email,
    });

    return {
        username, display_name, email, id
    };
};

const getUserByID = (sequelize: Sequelize) => async (id: string) => {
    return await sequelize.models.user.findByPk(id);
}

/**
     * Authenticate a user before retrieve the user's data
     * @param username 
     * @param password un-bcrypt.hashed password
     * @returns 
     */
const authenticate = async (username: string, password: string):
    Promise<UserInfo | undefined> => {

    const user = await User.findOne({ where: { username: username } });

    if (!user) return undefined;

    const match = await bcrypt.compare(password, user.password);

    if (match) return {
        username:     user.username,
        email:        user.email,
        display_name: user.display_name,
        id:           user.id
    };

    return undefined;
};

/**
     * Change the password for a user
     * @returns whether or not the password change was successful
     */
const changePassword = async (username: string, password: string, newPassword: string): Promise<boolean> => {

    // check if current username/password are correct
    const auth = await authenticate(username, password);
    if (!auth) return false;

    const user = await User.findOne({ where: { username } });
    if (!user) return false;

    await user.update({ password: await bcrypt.hash(newPassword, PASSWORD_SALT_ROUNDS) });
    return true;
};


/**
     * Change a user's username
     * @returns whether or not the username change was successful
     */
const changeUsername = async (username: string, password: string, newUsername: string): Promise<boolean> => {


    // check if current username/password are correct
    const auth = await authenticate(username, password);
    if (!auth) return false;

    const user = await User.findOne({ where: { username } });
    if (!user) return false;

    await user.update({ username: newUsername });
    return true;
};

export {
    createUser, authenticate, changePassword, changeUsername, getUserByID
};
