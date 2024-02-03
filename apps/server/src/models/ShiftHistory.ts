import { DataTypes, Sequelize } from "sequelize";
import UserInformation from "./UserInformation";
import Unit from "./Unit";

const ShiftHistory = (sequelize: Sequelize) => {
  let sh = sequelize.define(
    "ShiftHistory",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      shiftTime: DataTypes.STRING,
      name: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      unitId: DataTypes.INTEGER,
    },
    {
      modelName: "ShiftHistory",
      tableName: "ShiftHistory",
    }
  );
  sh.belongsTo(UserInformation(sequelize), {
    foreignKey: {
      name: "userId",
      allowNull: false,
    },
    onUpdate: "CASCADE",
  });
  sh.belongsTo(Unit(sequelize), {
    foreignKey: {
      name: "unitId",
      allowNull: false,
    },
    onUpdate: "CASCADE",
  });
  return sh;
};
export default ShiftHistory;

// foreign key reference to User information, Unit
