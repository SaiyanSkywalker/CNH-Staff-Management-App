import dotenv from "dotenv";
import { Dialect } from "sequelize";
import ServerConfig from "../interfaces/ServerConfig";
dotenv.config();

// Helper function to convert string to Dialect
function parseDialect(dialect: string): Dialect {
  switch (dialect) {
    case "mysql":
    case "postgres":
    case "mssql":
    case "sqlite":
    case "oracle":
      return dialect as Dialect;
    default:
      throw new Error(`Unsupported dialect: ${dialect}`);
  }
}

const config: ServerConfig = {
  environment: process.env.ENVIRONMENT || "dev",
  port: process.env.SERVER_PORT || "3000",
  db: process.env.DB || "cnh_staff_management",
  dbUser: process.env.DB_USER || "root",
  dbPassword: process.env.DB_PASSWORD || "password",
  dbDialect: parseDialect(process.env.DB_DIALECT || "oracle"),
  dbConnectionString: process.env.DB_CONNECTION_STRING || "connectionString",
};

export default config;
