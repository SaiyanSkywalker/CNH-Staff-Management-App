import {
  BelongsTo,
  Column,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";
import AnnouncementAttributes from "@shared/src/interfaces/AnnouncementAttributes";
import UserInformation from "./UserInformation";
import Channel from "./Channel";

@Table({ tableName: "Announcement" })
class Announcement extends Model<AnnouncementAttributes> {
  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
  })
  id!: number;

  @Column({ type: DataType.STRING })
  body!: string;

  @BelongsTo(() => UserInformation, { foreignKey: "senderId", targetKey: "id", onDelete: 'CASCADE' })
  sender!: UserInformation;

  @BelongsTo(() => Channel,{ foreignKey: "channelId", targetKey: "id", onDelete: 'CASCADE' })
  channel!: Channel;
}

export default Announcement;
