import { Dialect } from "sequelize/types/sequelize";

export default interface ServerConfig {
  environment: string;
  port: string;
  db: string;
  dbUser: string;
  dbPassword: string;
  dbDialect: Dialect;
  dbConnectionString: string;
}
