'use strict';

/* eslint-disable @typescript-eslint/no-var-requires */
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        //create user
        await queryInterface.bulkInsert('users', [
            {
                id:           'fe85b84d-fd04-4830-9f0f-4b4524c4c8ce',
                display_name: 'Admin',
                email:        'example@example.com',
                password:     await bcrypt.hash('Password!', 10),
                created_at:   '2024-07-23 09:38:33.841-07',
                updated_at:   '2024-07-23 09:38:33.841-07'
            }
        ]);

        //create panel_sets
        await queryInterface.bulkInsert('panel_sets', [
            {
                id: 1,
                author_id: 'fe85b84d-fd04-4830-9f0f-4b4524c4c8ce',
                name: 'Trunk 1',
                created_at:   '2024-07-23 09:38:33.841-07',
                updated_at:   '2024-07-23 09:38:33.841-07'
            }
        ]);

        //create panel
        await queryInterface.bulkInsert('panels', [
            {
                id: 1,
                image: "http://localhost:5000/crowd-comic/1_d767a6f4-fab7-4580-8b16-21463e6d181a",
                index: 0,
                panel_set_id: 1,
                created_at: "2024-07-23 09:38:33.841-07",
                updated_at: "2024-07-23 09:38:33.841-07"
            },
            {
                id: 2,
                image: "http://localhost:5000/crowd-comic/1_d767a6f4-fab7-4580-8b16-21463e6d181a",
                index: 1,
                panel_set_id: 1,
                created_at: "2024-07-23 09:38:33.841-07",
                updated_at: "2024-07-23 09:38:33.841-07"
            },
            {
                id: 3,
                image: "http://localhost:5000/crowd-comic/1_d767a6f4-fab7-4580-8b16-21463e6d181a",
                index: 2,
                panel_set_id: 1,
                created_at: "2024-07-23 09:38:33.841-07",
                updated_at: "2024-07-23 09:38:33.841-07"
            },
        ])

        //create hooks
        await queryInterface.bulkInsert('hooks', [
            {
                id: 1,
                position: `[{"x": 1, "y": 1}, {"x": 201, "y": 1}, {"x": 201, "y": 201}, {"x": 1, "y": 201}]`,
                current_panel_id: 1,
                next_panel_set_id: null
            },
            {
                id: 2,
                position: `[{"x": 1, "y": 1}, {"x": 201, "y": 1}, {"x": 201, "y": 201}, {"x": 1, "y": 201}]`,
                current_panel_id: 2,
                next_panel_set_id: null
            },
            {
                id: 3,
                position: `[{"x": 1, "y": 1}, {"x": 201, "y": 1}, {"x": 201, "y": 201}, {"x": 1, "y": 201}]`,
                current_panel_id: 3,
                next_panel_set_id: null
            }

        ])
    },

    async down(queryInterface) {
        //delete user
        await queryInterface.bulkDelete('users', { id: 'fe85b84d-fd04-4830-9f0f-4b4524c4c8ce' });

        //delete panel_set
        await queryInterface.bulkDelete('panel_sets', {id: 1})

        //delete panels
        await queryInterface.bulkDelete('panels', {[Op.or]: [{id: 1}, {id: 2}, {id: 3}]})

        //delete hooks
        await queryInterface.bulkDelete('hooks', )
        await queryInterface.bulkDelete('hooks', { [Op.or]: [{id: 1}, {id: 2}, {id: 3}] })
    }
};
