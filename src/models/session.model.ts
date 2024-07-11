import {
    CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, Sequelize
} from 'sequelize';

/**
 * Session model attributes
 */
interface ISession extends Model<InferAttributes<ISession>, InferCreationAttributes<ISession>> {
    id: CreationOptional<string>,
    user_id: ForeignKey<string>
}

const define = (sequelize: Sequelize): void => {
    sequelize.define<ISession>(
        'session',
        {
            id: {
                type:         DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull:    false,
                primaryKey:   true
            },
            user_id: {
                type:      DataTypes.STRING,
                allowNull: false
            }
        },
        { 
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
         }
    );
};

export { define, type ISession };
