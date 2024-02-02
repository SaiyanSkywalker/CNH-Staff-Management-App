import { DataTypes, Sequelize } from "sequelize";

const Role = (sequelize: Sequelize) => {
  return sequelize.define(
    "Role",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      modelName: "Role",
      tableName: "Role",
    }
  );
};
export default Role;
