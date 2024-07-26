'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {

        /**
     * Create a new table
     */
        await queryInterface.createTable(
            'panel_sets',
            {
                id: {
                    type:          Sequelize.INTEGER,
                    primaryKey:    true,
                    autoIncrement: true
                },
                name: {
                    type:      Sequelize.STRING,
                    allowNull: true,
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

    async down(queryInterface) {

        /**
     * Revert creation
     */
        await queryInterface.dropTable('panel_sets');
    }
};
