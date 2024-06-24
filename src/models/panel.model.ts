import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, ModelStatic, Sequelize } from "sequelize";

interface IPanel extends Model<InferAttributes<IPanel>, InferCreationAttributes<IPanel>> {
    id: CreationOptional<number>,
    image: string,
    index: number,
    panel_set_id: ForeignKey<number>
}



let Panel: ModelStatic<IPanel>;


const define = (sequelize: Sequelize): void => {
    Panel = sequelize.define<IPanel>(
        'panel',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            image: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            index: {
                type: DataTypes.SMALLINT,
                allowNull: false,
            },
            panel_set_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
        },
        {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    );
}

export { define, Panel, type IPanel };