import path from "path";
import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import DefaultUnits from "../constants/DefaultUnits";
import Unit from "../models/Unit";
import ServerConfig from "../interfaces/ServerConfig";
import UserInformation from "../models/UserInformation";
import ShiftHistory from "../models/ShiftHistory";

let sequelize: Sequelize;

/**
 * Adds hospital call centers to database if it they don't already exist
 * @param sequelize instance of sequelize object
 */
const createDefaultUnits = async (): Promise<void> => {
  try {
    const numUnits = await Unit.findAndCountAll();
    if (numUnits.count === 0) {
      await Unit.bulkCreate(DefaultUnits);
    }
  } catch (error) {
    console.log(error);
  }
};

export default async (config: ServerConfig) => {
  try {
    const dbConfig: SequelizeOptions = {
      username: config.dbUser,
      password: config.dbPassword,
      dialect: config.dbDialect,
      dialectOptions: { connectString: config.dbConnectionString },
      models: [path.resolve(__dirname, "..", "models")],
    };

    // Starts db connection and initializes models
    sequelize = new Sequelize(dbConfig);
    await sequelize.authenticate();

    // Allows for quick alterations of the db model
    // when working on the server
    await sequelize.sync(
      config.environment.toLowerCase() === "dev" ? { alter: true } : {}
    );

    await createDefaultUnits();

    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export { sequelize };
