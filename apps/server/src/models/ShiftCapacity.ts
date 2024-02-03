import { DataTypes, Sequelize } from "sequelize";
import Unit from "./Unit";

const ShiftCapacity = (sequelize: Sequelize) => {
  let sc = sequelize.define(
    "ShiftCapacity",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      unitId: DataTypes.INTEGER,
      shift: DataTypes.DATE,
      capacity: DataTypes.INTEGER,
    },
    {
      modelName: "ShiftCapacity",
      tableName: "ShiftCapacity",
    }
  );

  //one to one relationsip,
  // ShiftCapacity has exactly one Unit associated with it and Unit has exactly one ShiftCapacity
  sc.belongsTo(Unit(sequelize), {
    targetKey: "id", // referenced from ShiftCapacity
    //creates foreign key in Unit
    foreignKey: {
      name: "unitId",
      allowNull: false,
    },
    onUpdate: "CASCADE", //if shift capacity changes, then so should unit
  });
  return sc;
};
export default ShiftCapacity;
