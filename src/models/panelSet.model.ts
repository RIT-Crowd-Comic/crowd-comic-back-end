import {
    CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize
} from 'sequelize';

interface IPanelSet extends Model<InferAttributes<IPanelSet>, InferCreationAttributes<IPanelSet>> {
    id: CreationOptional<number>,
    author_id: string
}

const define = (sequelize: Sequelize): void => {
    sequelize.define<IPanelSet>(
        'panel_set',
        {
            id: {
                type:          DataTypes.INTEGER,
                primaryKey:    true,
                autoIncrement: true
            },
            author_id: {
                type:      DataTypes.UUID,
                allowNull: false,
            }
        },
        {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    );
};

export { define, type IPanelSet };
