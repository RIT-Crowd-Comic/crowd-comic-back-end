'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {

        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
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

    async down(queryInterface, Sequelize) {

        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete('users', { email: 'example@example.com' });
    }
};
