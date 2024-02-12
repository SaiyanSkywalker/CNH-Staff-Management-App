import { Column, DataType, Model, Table } from "sequelize-typescript";
import ChannelAttributes from "@shared/src/interfaces/ChannelAttributes";

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
}
export default Channel;
