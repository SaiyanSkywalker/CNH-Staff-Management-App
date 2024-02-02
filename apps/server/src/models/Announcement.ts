import { DataTypes, Sequelize } from "sequelize";
import UserInformation from "./UserInformation";
import Channel from "./Channel";

const Announcement = (sequelize: Sequelize) => {
  let a = sequelize.define(
    "Announcement",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      body: DataTypes.STRING,
      senderId: DataTypes.INTEGER,
      channelId: DataTypes.INTEGER,
    },
    {
      modelName: "Announcement",
      tableName: "Announcement",
    }
  );
  a.belongsTo(Channel(sequelize), {
    foreignKey: {
      name: "channelId",
      allowNull: false,
    },
    onUpdate: "CASCADE",
  });
  a.belongsTo(UserInformation(sequelize), {
    foreignKey: {
      name: "userId",
      allowNull: false,
    },
    onUpdate: "CASCADE",
  });
  return a;
};
export default Announcement;
