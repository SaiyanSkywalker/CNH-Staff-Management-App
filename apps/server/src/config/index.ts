import dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT || "3000",
  db_user: process.env.DB_USER || "admin",
  db_dialect: process.env.DB_DIALECT,
  db_password: process.env.DB_PASSWORD || "password",
  db_connection_string: process.env.DB_CONNECTION_STRING || "string",
};
