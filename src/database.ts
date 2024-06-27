import dotenv from 'dotenv';
dotenv.config();

import { Sequelize } from 'sequelize';
import { define as userDefine } from './models/user.model';
import { define as hookDefine } from './models/hook.model';
import { define as panelDefine } from './models/panel.model';
import { define as panelSetDefine } from './models/panelSet.model';

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
    userDefine(sequelize);
    hookDefine(sequelize);
    panelDefine(sequelize);
    panelSetDefine(sequelize);

    // set up associations
    sequelize.models.user.hasMany(sequelize.models.panel_set);
    sequelize.models.panel_set.belongsTo(sequelize.models.user);

    sequelize.models.panel_set.hasMany(sequelize.models.panel);
    sequelize.models.panel.belongsTo(sequelize.models.panel_set);

    sequelize.models.panel.hasMany(sequelize.models.hook);
    sequelize.models.hook.hasOne(sequelize.models.panel);

    sequelize.models.panel_set.hasOne(sequelize.models.hook);
    sequelize.models.hook.belongsTo(sequelize.models.panel_set);

    // sync the table columns, create any tables that don't exist
    await sequelize.sync({ force: true });

};

export { sequelize, setup };
