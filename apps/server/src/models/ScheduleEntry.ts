import { Column, DataType, Model, Table, Unique } from "sequelize-typescript";
import ScheduleEntryAttributes from "@shared/src/interfaces/ScheduleEntryAttributes";
@Table({
  tableName: "ScheduleEntry",
  indexes: [
    {
      unique: true,
      fields: [
        "employeeId",
        "shiftDate",
        "startTime",
        "endTime",
        "costCenterId",
      ],
    },
  ],
})
class ScheduleEntry extends Model<ScheduleEntryAttributes> {
  // Remove this column (not needed)
  // Idea: employeeId, shiftDate, startTime, endTime, and costCenterId

  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
  })
  id!: number;

  @Column(DataType.INTEGER)
  employeeId!: number;

  @Column(DataType.STRING)
  lastName!: string;

  @Column(DataType.STRING)
  firstName!: string;

  @Column(DataType.STRING)
  middleInitial!: string;

  @Column(DataType.DATE)
  shiftDate!: Date;

  @Column(DataType.STRING)
  startTime!: string;

  @Column(DataType.STRING)
  endTime!: string;

  @Column(DataType.STRING)
  duration!: string;

  @Column(DataType.STRING)
  shiftType!: string;

  @Column(DataType.STRING)
  jobCode!: string;

  @Column(DataType.INTEGER)
  costCenterId!: number;
}
export default ScheduleEntry;
