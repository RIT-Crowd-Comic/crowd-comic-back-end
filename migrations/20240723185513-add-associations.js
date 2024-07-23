'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {

        /**
     * Add associations to all of the tables
     */
        await queryInterface.addColumn(
            'panel_sets',
            'author_id',
            {
                type:      Sequelize.UUID,
                allowNull: false,

                // create foreign key
                references: {
                    model: 'users',
                    key:   'id'
                },
                onUpdate: 'CASCADE'
            }
        );

        await queryInterface.addColumn(
            'panels',
            'panel_set_id',
            {
                type:      Sequelize.INTEGER,
                allowNull: false,

                // create foreign key
                references: {
                    model: 'panel_sets',
                    key:   'id'
                },
                onUpdate: 'CASCADE'
            },
        );

        await queryInterface.addColumn(
            'hooks',
            'current_panel_id',
            {
                type:      Sequelize.INTEGER,
                allowNull: false,

                // create foreign key
                references: {
                    model: 'panels',
                    key:   'id'
                },
                onUpdate: 'CASCADE'
            }
        );

        await queryInterface.addColumn(
            'hooks',
            'next_panel_set_id',
            {
                type:      Sequelize.INTEGER,
                allowNull: true,
                unique:    true,

                // create foreign key
                references: {
                    model: 'panel_sets',
                    key:   'id'
                },
                onUpdate: 'CASCADE'
            }
        );

        await queryInterface.addColumn(
            'sessions',
            'user_id',
            {
                type:      Sequelize.UUID,
                allowNull: false,

                // create foreign key
                references: {
                    model: 'users',
                    key:   'id'
                },
                onUpdate: 'CASCADE'

            }
        );
    },

    async down(queryInterface, Sequelize) {

        /**
     * Revert the associations
     */
        await queryInterface.removeColumn('panel_sets', 'author_id');
        await queryInterface.removeColumn('panels', 'panel_set_id');
        await queryInterface.removeColumn('hooks', 'current_panel_id');
        await queryInterface.removeColumn('hooks', 'next_panel_set_id');
        await queryInterface.removeColumn('sessions', 'user_id');
    }
};
