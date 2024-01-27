import { Sequelize } from "sequelize";
import createModels from "../models";

let sequelize: Sequelize;

const fs = require("fs");
const path = require("path");
export default async (config: any) => {
  try {
    const dbConfig = {
      username: config.db_user,
      password: config.db_password,
      host: config.db_hostname,
      port: config.db_port,
      dialect: config.db_dialect,
    };
    sequelize = new Sequelize(dbConfig);

    createModels(sequelize);

    console.log(dbConfig);
    await sequelize.authenticate();
    await sequelize.sync();

    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export { sequelize };
