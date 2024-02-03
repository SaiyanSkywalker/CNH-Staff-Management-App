import { DataTypes, Sequelize } from "sequelize";

const Channel = (sequelize: Sequelize) => {
  return sequelize.define(
    "Channel",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: DataTypes.STRING,
    },
    {
      modelName: "Channel",
      tableName: "Channel",
    }
  );
};
export default Channel;

