import { Sequelize } from "sequelize";

export default async (config: any) => {
  try {
    const sequelize = new Sequelize({
      username: config.db_user,
      password: config.db_password,
      dialect: config.db_dialect,
      dialectOptions: { connectString: config.db_connection_string },
    });
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
