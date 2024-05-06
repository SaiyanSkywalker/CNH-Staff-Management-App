import {
  BelongsTo,
  Column,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";
import ChannelAttributes from "@shared/src/interfaces/ChannelAttributes";
import Unit from "./Unit";

@Table({ tableName: "Channel" })
class Channel extends Model<ChannelAttributes> {
  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
  })
  id!: number;
  @Column
  name!: string;
  @BelongsTo(() => Unit, { foreignKey: "unitRoomId", targetKey: "id" })
  unit?: Unit;
  
  @Column({ type: DataType.INTEGER, allowNull: true })
  unitRoomId!: number | null;
}
export default Channel;
