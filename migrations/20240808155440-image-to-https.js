'use strict';

// import { IPanel } from '../src/models/panel.model'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {

        await queryInterface.bulkUpdate(
            'panels',
            { image: Sequelize.fn('REPLACE', Sequelize.col('image'), 'http', 'https') },
            { image: { [Sequelize.Op.startsWith]: 'http:' } }
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkUpdate(
            'panels',
            { image: Sequelize.fn('REPLACE', Sequelize.col('image'), 'https', 'http') },
            { image: { [Sequelize.Op.startsWith]: 'https:' } }
        );
    }
};
