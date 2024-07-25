'use strict';

/* eslint-disable @typescript-eslint/no-var-requires */
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {

        /**
         * Create an example user
        */

        await await queryInterface.bulkInsert('users', [
            {
                id:           'fe85b84d-fd04-4830-9f0f-4b4524c4c8ce',
                display_name: 'Admin',
                email:        'example@example.com',
                password:     await bcrypt.hash('Password!', 10),
                created_at:   '2024-07-23 09:38:33.841-07',
                updated_at:   '2024-07-23 09:38:33.841-07'
            }
        ], { transaction });
    },

    async down(queryInterface) {

        /**
         * Delete example user
         */
        await queryInterface.bulkDelete('users', { email: 'example@example.com' });
    }
};
