'use strict';
/* eslint-disable @typescript-eslint/no-var-requires */
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();
const { getLinks } = require('./utils');
const userID = 'fe85b84d-fd04-4830-9f0f-4b4524c4c8ce';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        const path = `[{ "x": 1, "y": 1 }, { "x": 201, "y": 1 }, { "x": 201, "y": 201 }, { "x": 1, "y": 201 }]`;
        const links = getLinks();
        const timestamp = '2024-07-23 09:38:33.841-07';

        // ensure that changes are rolled back on error. We don't want only some data to be created
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.bulkInsert('users', [
                {
                    id:           userID,
                    display_name: 'Admin',
                    email:        'example@example.com',
                    password:     await bcrypt.hash('Password!', 10),
                    created_at:   timestamp,
                    updated_at:   timestamp
                }
            ], { returning: ['id'], transaction });

            // create panel_sets
            const panelSets = await queryInterface.bulkInsert('panel_sets', [
                {
                    author_id:  userID,
                    name:       'Trunk 1',
                    created_at: timestamp,
                    updated_at: timestamp
                }
            ], { returning: ['id'], transaction });

            const panelSetId = panelSets[0].id;

            // create panel
            const panels = await queryInterface.bulkInsert('panels', [
                {
                    image:        links[0],
                    index:        0,
                    panel_set_id: panelSetId,
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[1],
                    index:        1,
                    panel_set_id: panelSetId,
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
                {
                    image:        links[2],
                    index:        2,
                    panel_set_id: panelSetId,
                    created_at:   timestamp,
                    updated_at:   timestamp
                },
            ], { returning: ['id'], transaction });

            // create hooks
            await queryInterface.bulkInsert('hooks', [
                {
                    position:          path,
                    current_panel_id:  panels[0].id,
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panels[1].id,
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                },
                {
                    position:          path,
                    current_panel_id:  panels[2].id,
                    next_panel_set_id: null,
                    created_at:        timestamp,
                    updated_at:        timestamp
                }

            ], { transaction });
            await transaction.commit();
        }

        catch (error) {
            await transaction.rollback();
            console.log(error);
            console.log('[Fail] Seeder failed after transaction rollback.');
        }
    },

    async down(queryInterface, { Op }) {

        // ensure that changes are rolled back on error. We don't want only some data to be deleted
        const transaction = await queryInterface.sequelize.transaction();
        try {

            // delete panel_set
            await queryInterface.bulkDelete('panel_sets', { id: 1 }, { transaction });

            // delete panels
            await queryInterface.bulkDelete('panels', { id: { [Op.lte]: 3 } }, { transaction });


            // delete hooks
            await queryInterface.bulkDelete('hooks', null, { transaction });
            await queryInterface.bulkDelete('hooks', { id: { [Op.lte]: 3 } }, { transaction });

            // delete user after all the dependent tables are deleted
            await queryInterface.bulkDelete('users', { id: userID });

            await transaction.commit();
        }
        catch (error) {
            await transaction.rollback();
            console.log(error);
            console.log('[Fail] Reverting failed after transaction rollback.');
        }
    }
};
