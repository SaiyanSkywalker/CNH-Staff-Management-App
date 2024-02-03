import { Sequelize } from "sequelize";
import createModels from "../models";
import DefaultUnits from "../constants/DefaultUnits";

let sequelize: Sequelize;

/**
 * Adds hospital call centers to database if it they don't already exist
 * @param sequelize instance of sequelize object
 */
const createDefaultUnits = async (sequelize: Sequelize): Promise<void> => {
  try {
    const Unit = await sequelize.model("Unit");
    const numUnits = await Unit.findAndCountAll();
    if (numUnits.count === 0) {
      await Unit.bulkCreate(DefaultUnits);
    }
  } catch (error) {
    console.log(error);
  }
};
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
    await sequelize.sync({ alter: true });
    await createDefaultUnits(sequelize);

    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export { sequelize };
