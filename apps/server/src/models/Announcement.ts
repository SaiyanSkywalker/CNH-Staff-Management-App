import { DataTypes, INTEGER, Sequelize } from "sequelize";

const Announcement = (sequelize: Sequelize) => {
  return sequelize.define(
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
};
export default Announcement;

//foreign key references to User Information and Channel
