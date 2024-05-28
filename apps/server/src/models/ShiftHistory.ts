/**
 * File: ShiftHistory.ts
 * Purpose: defines ShiftHistory Sequelize model,
 * which corresponds to ShiftHistory table in the db
 */

import {
  BelongsTo,
  Column,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";
import UserInformation from "./UserInformation";
import Unit from "./Unit";
import ShiftHistoryAttributes from "@shared/src/interfaces/ShiftHistoryAttributes";

@Table({ tableName: "ShiftHistory" })
class ShiftHistory extends Model<ShiftHistoryAttributes> {
  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
  })
  id!: number;

  @Column(DataType.STRING)
  shiftTime!: string;

  @Column(DataType.STRING)
  status!: string;

  @BelongsTo(() => UserInformation, {
    targetKey: "employeeId",
    foreignKey: "userId",
    onDelete: "CASCADE",
  })
  user!: UserInformation;

  @BelongsTo(() => Unit, {
    targetKey: "id",
    foreignKey: "unitId",
    onDelete: "CASCADE",
  })
  unit!: Unit;

  @Column({ type: DataType.STRING, allowNull: false })
  dateRequested!: string;

  @Column(DataType.INTEGER)
  userId!: number;

  @Column(DataType.INTEGER)
  unitId!: number;
}

export default ShiftHistory;
