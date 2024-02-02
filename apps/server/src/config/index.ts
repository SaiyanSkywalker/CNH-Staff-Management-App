import dotenv from "dotenv";
dotenv.config();

export default {
  host: "localhost",
  port: process.env.SERVER_PORT || "3000",
  db: process.env.DB || "cnh_staff_management",
  db_user: process.env.DB_USER || "root",
  db_password: process.env.DB_PASSWORD || "password",
  db_dialect: process.env.DB_DIALECT || "oracle",
  db_connection_string: process.env.DB_CONNECTION_STRING || "connectionString",
};
