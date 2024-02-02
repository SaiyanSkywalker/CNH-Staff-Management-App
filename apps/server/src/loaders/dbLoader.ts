import { Sequelize } from "sequelize";
import createModels from "../models";

let sequelize: Sequelize;

export default async (config: any) => {
  try {
    const dbConfig = {
      username: config.db_user,
      password: config.db_password,
      dialect: config.db_dialect,
      dialectOptions: { connectString: config.db_connection_string },
    };
    sequelize = new Sequelize(dbConfig);

    // Start the db and create initial models
    createModels(sequelize);
    await sequelize.authenticate();
    await sequelize.sync();

    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export { sequelize };