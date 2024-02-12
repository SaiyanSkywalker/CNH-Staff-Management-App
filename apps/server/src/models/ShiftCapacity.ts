import {
  Model,
  Column,
  Table,
  DataType,
  BelongsTo,
} from "sequelize-typescript";
import ShiftCapacityAttributes from "@shared/src/interfaces/ShiftCapacityAttributes";
import Unit from "./Unit";

@Table
class ShiftCapacity extends Model<ShiftCapacityAttributes> {
  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
  })
  id!: number;

  @BelongsTo(() => Unit, { targetKey: "id", foreignKey: "unitId" })
  unit!: Unit;

  @Column(DataType.STRING)
  shift!: string;
  @Column(DataType.INTEGER)
  capacity!: number;
}
export default ShiftCapacity;
