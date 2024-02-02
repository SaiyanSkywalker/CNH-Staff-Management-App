/*
import { DataTypes, Sequelize } from "sequelize";

const UserInformation = (sequelize: Sequelize) => {
  return sequelize.define(
    "UserInformation",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      password: DataTypes.STRING,
      roleId:
      unitId: 
    },
    {
      modelName: "UserInformation",
      tableName: "UserInformation",
    }
  );
};
export default UserInformation;
*/
//foreign key reference to Role and Unit table