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

  @BelongsTo(() => UserInformation, { targetKey: "id", foreignKey: "userId" })
  user!: UserInformation;

  @BelongsTo(() => Unit, { targetKey: "id", foreignKey: "unitId" })
  unit!: Unit;

  @Column(DataType.DATE)
  dateRequested!: Date;

  @Column(DataType.INTEGER)
  userId!: number;

  @Column(DataType.INTEGER)
  unitId!: number;
}

export default ShiftHistory;
