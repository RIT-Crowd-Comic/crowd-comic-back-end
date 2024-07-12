import { Sequelize } from 'sequelize';
import { ISession } from '../models';

/**
 * Creates a session
 * @param {string} _id ID of the user session is being created for
 * @returns ID of the session and ID of the user
 */
const createSession = (sequelize: Sequelize) => async (_user_id: string) => {

    // Delete any other session data for the user
    await sequelize.models.session.destroy({ where: { id: _user_id } });

    // Create new session for the user
    const { id, user_id } = await sequelize.models.session.create({ user_id: _user_id, }) as ISession;

    return { id, user_id };
};

/**
 * Get session data from a session id
 * @param {string} id ID of session to query 
 * @returns Full session object
 */
const getSession = (sequelize: Sequelize) => async (id: string) => {
    return await sequelize.models.session.findByPk(id);
};

export { createSession, getSession };
