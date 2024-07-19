import { Sequelize, Op, Transaction } from 'sequelize';

const clearDB = (sequelize : Sequelize) => async() => {
    return await sequelize.sync({ force: true });
}

export {clearDB}