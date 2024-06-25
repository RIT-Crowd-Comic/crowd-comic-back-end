import {
    CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, ModelStatic, Sequelize
} from 'sequelize';

/**
 * user model attributes
 */
interface IUser extends Model<InferAttributes<IUser>, InferCreationAttributes<IUser>> {
    id: CreationOptional<string>,
    username: string,
    display_name: string,
    email: string,
    password: string,
}


// type UserCreationAttributes = Optional<UserAttributes, 'example_attribute'>;

let User: ModelStatic<IUser>;

/**
 * Initialize the User model
 * @param sequelize 
 */
const define = (sequelize: Sequelize): void => {
    User = sequelize.define<IUser>(
        'user',
        {
            id: {
                type:         DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey:   true
            },
            username: {
                type:      DataTypes.STRING,
                allowNull: false,
                unique:    true,
                validate:  { len: [8, 30], notContains: ' ' }
            },
            display_name: {
                type:      DataTypes.STRING,
                allowNull: false,
                unique:    true,
                validate:  { len: [1, 30], notContains: ' ' }
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
            }
        },
        {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    );
};

export { define, User, type IUser };
