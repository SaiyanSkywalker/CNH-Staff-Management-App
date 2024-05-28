import { Dialect } from "sequelize/types/sequelize";

/**
 * File: ServerConfig.ts
 * Purpose: defines shape of config object to be used by server
 */
export default interface ServerConfig {
  environment: string;
  port: string;
  db: string;
  dbUser: string;
  dbPassword: string;
  dbDialect: Dialect;
  dbConnectionString: string;
  jwtSecretKey: string;
  accessTokenLifetime: string;
  refreshTokenLifetime: string;
}
