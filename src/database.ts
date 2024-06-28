import dotenv from 'dotenv';
dotenv.config();

import { Sequelize } from 'sequelize';
import { modelDefiners } from './models';

/**
 * SSL is required for Heroku Postgres
 */
const sslOptions = process.env.DATABASE_SSL === 'true' ?
    { dialectOptions: { ssl: { rejectUnauthorized: false }, }, } :
    {};

const sequelize = new Sequelize(
    process.env.DATABASE_URL ?? '',
    {
        logging:  false,
        protocol: 'postgres',
        dialect:  'postgres',
        ...sslOptions,
        pool:     {
            max:     5,
            min:     0,
            acquire: 30000,
            idle:    10000
        },
    }
);

const setup = async () => {

    // define models
    modelDefiners.forEach(define => define(sequelize));

    // set up associations


    // sync the table columns, create any tables that don't exist
    await sequelize.sync({ force: true });

};

export { sequelize, setup };
