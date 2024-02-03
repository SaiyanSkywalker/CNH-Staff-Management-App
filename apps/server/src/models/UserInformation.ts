import { DataTypes, Sequelize } from "sequelize";
import Role from "./Role";
import Unit from "./Unit";

const UserInformation = (sequelize: Sequelize) => {
  let ui = sequelize.define(
    "UserInformation",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      roleId: DataTypes.INTEGER,
      unitId: DataTypes.INTEGER,
    },
    {
      modelName: "UserInformation",
      tableName: "UserInformation",
    }
  );
  ui.belongsTo(Role(sequelize), {
    foreignKey: {
      name: "roleId",
      allowNull: false,
    },
    onUpdate: "CASCADE",
  });
  ui.belongsTo(Unit(sequelize), {
    foreignKey: {
      name: "unitId",
      allowNull: false,
    },
    onUpdate: "CASCADE",
  });
  return ui;
};
export default UserInformation;
