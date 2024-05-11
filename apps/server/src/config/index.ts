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
  jwtSecretKey:
    process.env.JWT_SECRET_KEY || "KfkHPnsWoblwyotkcsKDevVDhQYnv14Z09l+jGMiggs",
  accessTokenLifetime: process.env.ACCESS_TOKEN_LIFETIME || "1hr",
  refreshTokenLifetime: process.env.REFRESH_TOKEN_LIFETIME || "3d",
};

export default config;
