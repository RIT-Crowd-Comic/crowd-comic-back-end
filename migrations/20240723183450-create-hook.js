'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {

        /**
     * Create a new table
     */
        await queryInterface.createTable(
            'hooks',
            {
                id: {
                    type:          Sequelize.INTEGER,
                    primaryKey:    true,
                    autoIncrement: true,
                    allowNull:     false
                },
                position: {
                    type:      Sequelize.JSONB,
                    allowNull: false
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
        queryInterface.dropTable('hooks');
    }
};
