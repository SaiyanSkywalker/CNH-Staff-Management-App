import { DataTypes, Sequelize } from "sequelize";

const Unit = (sequelize: Sequelize) => {
  return sequelize.define(
    "Unit",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      laborLevelEntryId: {
        type: DataTypes.INTEGER,
      },
      name: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {
      modelName: "Unit",
      tableName: "Unit",
    }
  );
};

export default Unit;
