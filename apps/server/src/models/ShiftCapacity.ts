import {
  Model,
  Column,
  Table,
  DataType,
  BelongsTo,
} from "sequelize-typescript";
import ShiftCapacityAttributes from "@shared/src/interfaces/ShiftCapacityAttributes";
import Unit from "./Unit";

@Table({ tableName: "ShiftCapacity" })
class ShiftCapacity extends Model<ShiftCapacityAttributes> {
  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
  })
  id!: number;

  @BelongsTo(() => Unit, { targetKey: "id", foreignKey: "unitId", onDelete: "CASCADE" })
  unit!: Unit;

  @Column(DataType.STRING)
  shift!: string;
  @Column(DataType.INTEGER)
  capacity!: number;
  @Column(DataType.STRING)
  shiftDate!: string;
}
export default ShiftCapacity;
