'use strict';

/* eslint-disable @typescript-eslint/no-var-requires */
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {

        /**
         * Create an example user
        */

        await queryInterface.bulkInsert('users', [
            {
                id:           'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
                display_name: 'example',
                email:        'example@example.com',
                password:     await bcrypt.hash('asdfASDF1234', 10),
                created_at:   '2024-07-23 09:38:33.841-07',
                updated_at:   '2024-07-23 09:38:33.841-07'

            }
        ]);
    },

    async down(queryInterface) {

        /**
         * Delete example user
         */
        await queryInterface.bulkDelete('users', { email: 'example@example.com' });
    }
};
