'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {

        /**
     * Create a new table
     */
        await queryInterface.createTable(
            'sessions',
            {
                id: {
                    type:         Sequelize.UUID,
                    defaultValue: Sequelize.UUIDV4,
                    allowNull:    false,
                    primaryKey:   true
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
        queryInterface.dropTable('sessions');
    }
};
