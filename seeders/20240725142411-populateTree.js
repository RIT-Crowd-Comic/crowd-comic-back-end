'use strict';
/* eslint-disable @typescript-eslint/no-var-requires */
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {

        // ensure that changes are rolled back on error. We don't want only some data to be created
        const transaction = await queryInterface.sequelize.transaction();
        try {
            // create panel_sets
            await queryInterface.bulkInsert('panel_sets', [
                {
                    id:         1,
                    author_id:  'fe85b84d-fd04-4830-9f0f-4b4524c4c8ce',
                    name:       'Trunk 1',
                    created_at: '2024-07-23 09:38:33.841-07',
                    updated_at: '2024-07-23 09:38:33.841-07'
                }
            ], { transaction });

            // create panel
            await queryInterface.bulkInsert('panels', [
                {
                    id:           1,
                    image:        'http://localhost:5000/crowd-comic/1_9eb775c0-cd4f-4227-9dd8-1af7f9412604',
                    index:        0,
                    panel_set_id: 1,
                    created_at:   '2024-07-23 09:38:33.841-07',
                    updated_at:   '2024-07-23 09:38:33.841-07'
                },
                {
                    id:           2,
                    image:        'http://localhost:5000/crowd-comic/1_eb071f2a-fe89-43f1-b73b-02175ed77819',
                    index:        1,
                    panel_set_id: 1,
                    created_at:   '2024-07-23 09:38:33.841-07',
                    updated_at:   '2024-07-23 09:38:33.841-07'
                },
                {
                    id:           3,
                    image:        'http://localhost:5000/crowd-comic/1_d94663cb-1d58-4e5f-bf9c-5eba27862475',
                    index:        2,
                    panel_set_id: 1,
                    created_at:   '2024-07-23 09:38:33.841-07',
                    updated_at:   '2024-07-23 09:38:33.841-07'
                },
            ], { transaction });

            // create hooks
            await queryInterface.bulkInsert('hooks', [
                {
                    id:                1,
                    position:          `[{ "x": 1, "y": 1 }, { "x": 201, "y": 1 }, { "x": 201, "y": 201 }, { "x": 1, "y": 201 }]`,
                    current_panel_id:  1,
                    next_panel_set_id: null,
                    created_at:        '2024-07-23 09:38:33.841-07',
                    updated_at:        '2024-07-23 09:38:33.841-07'
                },
                {
                    id:                2,
                    position:          `[{ "x": 1, "y": 1 }, { "x": 201, "y": 1 }, { "x": 201, "y": 201 }, { "x": 1, "y": 201 }]`,
                    current_panel_id:  2,
                    next_panel_set_id: null,
                    created_at:        '2024-07-23 09:38:33.841-07',
                    updated_at:        '2024-07-23 09:38:33.841-07'
                },
                {
                    id:                3,
                    position:          `[{ "x": 1, "y": 1 }, { "x": 201, "y": 1 }, { "x": 201, "y": 201 }, { "x": 1, "y": 201 }]`,
                    current_panel_id:  3,
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
            await transaction.commit();
        }
        catch (error) {
            await transaction.rollback();
            console.log(error);
            console.log('[Fail] Reverting failed after transaction rollback.');
        }
    }
};
