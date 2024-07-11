import { Sequelize } from 'sequelize';
import { ISession } from '../models';

interface sessionConfig {
    user_id: string
}

const createSession = (sequelize: Sequelize) => async (newSession: sessionConfig) => {
    //Delete any other session data for the user
    await sequelize.models.user.destroy({where: {id: newSession.user_id}});

    //Create new session for the user
    const { id, user_id, created_at } = await sequelize.models.user.create({ user_id: newSession.user_id, }) as ISession;

    return { id, user_id, created_at };
};

const getSession = (sequelize: Sequelize) => async (id: string) => {
    return await sequelize.models.session.findByPk(id);
};

export {createSession, getSession};