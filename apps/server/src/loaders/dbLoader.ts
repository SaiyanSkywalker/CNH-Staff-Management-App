import path from "path";
import {
  Model,
  ModelCtor,
  Sequelize,
  SequelizeOptions,
} from "sequelize-typescript";
import DefaultUnits from "../constants/DefaultUnits";
import Unit from "../models/Unit";
import ServerConfig from "../interfaces/ServerConfig";
import Role from "../models/Role";
import DefaultRoles from "../constants/DefaultRoles";

let sequelize: Sequelize;

/**
 * Adds default values to db if they don't exist
 * @param model Sequelize model
 * @param defaultValues values to be inserted in to db if they do not already exist?
 *
 */

const createDefaultValues = async <T extends {}>(
  model: ModelCtor<Model<T>>,
  defaultValues: T[]
): Promise<void> => {
  try {
    const values: Model<T, T>[] = await model.findAll();
    if (values.length === 0) {
      await model.bulkCreate(defaultValues as any);
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
    // await sequelize.sync(
    //   config.environment.toLowerCase() === "dev" ? { alter: true } : {}
    // );
    await sequelize.sync();

    // Adds default list of units and roles to db
    await createDefaultValues(Unit, DefaultUnits);
    await createDefaultValues(Role, DefaultRoles);

    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export { sequelize };
