'use strict';
/* eslint-disable @typescript-eslint/no-var-requires */
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {

        // ensure that changes are rolled back on error. We don't want only some data to be created
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.bulkInsert('users', [
                {
                    id:           'fe85b84d-fd04-4830-9f0f-4b4524c4c8ce',
                    display_name: 'Admin',
                    email:        'example@example.com',
                    password:     await bcrypt.hash('Password!', 10),
                    created_at:   '2024-07-23 09:38:33.841-07',
                    updated_at:   '2024-07-23 09:38:33.841-07'
                }
            ], { returning: ['id'], transaction });

            // create panel_sets
            const panelSets = await queryInterface.bulkInsert('panel_sets', [
                {
                    author_id:  'fe85b84d-fd04-4830-9f0f-4b4524c4c8ce',
                    name:       'Trunk 1',
                    created_at: '2024-07-23 09:38:33.841-07',
                    updated_at: '2024-07-23 09:38:33.841-07'
                }
            ], { returning: ['id'], transaction });

            const panelSetId = panelSets[0].id;

            // create panel
            const panels=await queryInterface.bulkInsert('panels', [
                {
                    image:        process.env.NODE_ENV === 'production' ? `http://${process.env.BUCKET_NAME}.s3.amazonaws.com/1_9eb775c0-cd4f-4227-9dd8-1af7f9412604` : 'http://localhost:5000/crowd-comic/1_9eb775c0-cd4f-4227-9dd8-1af7f9412604',
                    index:        0,
                    panel_set_id: panelSetId,
                    created_at:   '2024-07-23 09:38:33.841-07',
                    updated_at:   '2024-07-23 09:38:33.841-07'
                },
                {
                    image:        process.env.NODE_ENV === 'production' ? `http://${process.env.BUCKET_NAME}.s3.amazonaws.com/1_eb071f2a-fe89-43f1-b73b-02175ed77819` : 'http://localhost:5000/crowd-comic/1_eb071f2a-fe89-43f1-b73b-02175ed77819',
                    index:        1,
                    panel_set_id: panelSetId,
                    created_at:   '2024-07-23 09:38:33.841-07',
                    updated_at:   '2024-07-23 09:38:33.841-07'
                },
                {
                    image:         process.env.NODE_ENV === 'production' ? `http://${process.env.BUCKET_NAME}.s3.amazonaws.com/1_d94663cb-1d58-4e5f-bf9c-5eba27862475` : 'http://localhost:5000/crowd-comic/1_d94663cb-1d58-4e5f-bf9c-5eba27862475',
                    index:        2,
                    panel_set_id: panelSetId,
                    created_at:   '2024-07-23 09:38:33.841-07',
                    updated_at:   '2024-07-23 09:38:33.841-07'
                },
            ], {returning: ['id'], transaction });

            // create hooks
            await queryInterface.bulkInsert('hooks', [
                {
                    position:          `[{ "x": 1, "y": 1 }, { "x": 201, "y": 1 }, { "x": 201, "y": 201 }, { "x": 1, "y": 201 }]`,
                    current_panel_id:  panels[0].id,
                    next_panel_set_id: null,
                    created_at:        '2024-07-23 09:38:33.841-07',
                    updated_at:        '2024-07-23 09:38:33.841-07'
                },
                {
                    position:          `[{ "x": 1, "y": 1 }, { "x": 201, "y": 1 }, { "x": 201, "y": 201 }, { "x": 1, "y": 201 }]`,
                    current_panel_id:   panels[1].id,
                    next_panel_set_id: null,
                    created_at:        '2024-07-23 09:38:33.841-07',
                    updated_at:        '2024-07-23 09:38:33.841-07'
                },
                {
                    position:          `[{ "x": 1, "y": 1 }, { "x": 201, "y": 1 }, { "x": 201, "y": 201 }, { "x": 1, "y": 201 }]`,
                    current_panel_id:   panels[2].id,
                    next_panel_set_id: null,
                    created_at:        '2024-07-23 09:38:33.841-07',
                    updated_at:        '2024-07-23 09:38:33.841-07'
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
            await queryInterface.bulkDelete('panels', { [Op.or]: [{ id: 1 }, { id: 2 }, { id: 3 }] }, { transaction });

            // delete hooks
            await queryInterface.bulkDelete('hooks', null, { transaction });
            await queryInterface.bulkDelete('hooks', { [Op.or]: [{ id: 1 }, { id: 2 }, { id: 3 }] }, { transaction });

            // delete user after all the dependent tables are deleted
            await queryInterface.bulkDelete('users', { id: 'fe85b84d-fd04-4830-9f0f-4b4524c4c8ce' });

            await transaction.commit();
        }
        catch (error) {
            await transaction.rollback();
            console.log(error);
            console.log('[Fail] Reverting failed after transaction rollback.');
        }
    }
};
