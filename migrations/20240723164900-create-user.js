
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(
            'users',
            {
                id: {
                    type:         Sequelize.UUID,
                    defaultValue: Sequelize.UUIDV4,
                    primaryKey:   true
                },
                display_name: {
                    type:      Sequelize.STRING,
                    allowNull: false,
                    validate:  { len: [1, 30] }
                },
                email: {
                    type:      Sequelize.STRING,
                    allowNull: false,
                    unique:    true,
                    validate:  { isEmail: { msg: 'must be a valid email' } }
                },
                password: {
                    type:      Sequelize.STRING,
                    allowNull: false,
                },
                created_at: {
                    allowNull: false,
                    type:      Sequelize.DATE
                },
                updated_at: {
                    allowNull: false,
                    type:      Sequelize.DATE
                }
            }
        );
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('users');
    }
};
