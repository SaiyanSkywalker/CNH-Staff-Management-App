import { Sequelize, Model, DataTypes } from "sequelize";
import { buildScheduleEntry } from "./ScheduleEntry";
import config from "../config";

let db: Record<any, any> = {};

//IIFE to populate db object with sequelize and all models we plan to use
(async (config: any) => {
    try {
      const sequelize = new Sequelize(config.db, config.db_user, config.db_password, {
        host: config.host,
        dialect: config.db_dialect,
      });
      await sequelize.authenticate();
      console.log("Connection has been established successfully.");

      //Function to receive scheduleEntryModel
      const scheduleEntryModel = buildScheduleEntry(sequelize, DataTypes);
      db[scheduleEntryModel.tableName] = scheduleEntryModel;

      db.sequelize = sequelize;
      db.Sequelize = Sequelize;

      //sync all tables in database
      await sequelize.sync();

    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
})(config);

export default db;
