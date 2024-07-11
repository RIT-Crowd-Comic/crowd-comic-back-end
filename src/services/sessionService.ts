import { Sequelize } from "sequelize";
import { ISession } from "../models";

interface sessionConfig {
    user_id: string
}

const createSession = (sequelize: Sequelize) => async (newSession: sessionConfig) => {
    const {id, user_id, created_at} = await sequelize.models.user.create({
        email: newSession.user_id,
    }) as ISession;

    return {id, user_id, created_at};
};

const getSession = (sequelize: Sequelize) => async (id: string) => {
    return await sequelize.models.session.findByPk(id);
}