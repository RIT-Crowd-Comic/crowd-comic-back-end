import {
    CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute, Sequelize
} from 'sequelize';
import { IPanelSet, ISession } from '../models';

/**
 * user model attributes
 */
interface IUser extends Model<InferAttributes<IUser>, InferCreationAttributes<IUser>> {
    id: CreationOptional<string>,
    display_name: string,
    email: string,
    password: string,
    profile_picture: string,
    panel_sets?: NonAttribute<IPanelSet[]>,
    session?: NonAttribute<ISession>,
    created_at: NonAttribute<string>,
    updated_at: NonAttribute<string>
}

/**
 * Initialize the User model
 * @param sequelize 
 */
const define = (sequelize: Sequelize): void => {
    sequelize.define<IUser>(
        'user',
        {
            id: {
                type:         DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey:   true
            },
            display_name: {
                type:      DataTypes.STRING,
                allowNull: false,
                validate:  { len: [1, 30] }
            },
            email: {
                type:      DataTypes.STRING,
                allowNull: false,
                unique:    true,
                validate:  { isEmail: { msg: 'must be a valid email' } }
            },
            password: {
                type:      DataTypes.STRING,
                allowNull: false,

                // don't validate password here because it's a hash
            },
            profile_picture: {
                type:      DataTypes.STRING,
                allowNull: true,
            }
        },
        {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    );
};

export { define, type IUser };
