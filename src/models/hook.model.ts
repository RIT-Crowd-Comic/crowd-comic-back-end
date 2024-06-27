import {
    CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, Sequelize
} from 'sequelize';

/**
 * Hook model attributes
 */
interface IHook extends Model<InferAttributes<IHook>, InferCreationAttributes<IHook>> {
    id: CreationOptional<number>,
    position: number[];
    current_panel_id: ForeignKey<number>,
    next_panel_set_id: ForeignKey<number>
}

/**
 * Initialize hook model
 * @param sequelize 
 */
const define = (sequelize: Sequelize): void => {
    sequelize.define<IHook>(
        'hook',
        {
            id: {
                type:          DataTypes.INTEGER,
                primaryKey:    true,
                autoIncrement: true,
                allowNull:     false
            },
            position: {
                type:      DataTypes.ARRAY(DataTypes.FLOAT),
                allowNull: false
            },
            current_panel_id: {
                type:      DataTypes.INTEGER,
                allowNull: false
            },
            next_panel_set_id: {
                type:      DataTypes.INTEGER,
                allowNull: true,
                unique:    true
            }
        },
        {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    );
};

export { define, type IHook };
