'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {

        /**
     * Create a new table
     */
        await queryInterface.createTable(
            'panels',
            {
                id: {
                    type:          Sequelize.INTEGER,
                    primaryKey:    true,
                    autoIncrement: true,
                    allowNull:     false,
                },
                image: {
                    type:      Sequelize.STRING,
                    allowNull: false,
                },
                index: {
                    type:      Sequelize.SMALLINT,
                    allowNull: false,
                },
                created_at: {
                    allowNull: false,
                    type:      Sequelize.DATE
                },
                updated_at: {
                    allowNull: false,
                    type:      Sequelize.DATE
                },
            }
        );
    },

    async down(queryInterface, Sequelize) {

        /**
     * Revert creation
     */
        await queryInterface.dropTable('panels');
    }
};
