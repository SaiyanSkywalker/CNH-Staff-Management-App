import dotenv from "dotenv";
dotenv.config();

export default {
  host: "localhost",
  port: process.env.SERVER_PORT || "3000",
  db: process.env.DB || "cnh_staff_management",
  db_user: process.env.DB_USER || "root",
  db_password: process.env.DB_PASSWORD || "password",
  db_hostname: process.env.DB_HOSTNAME || "hostname",
  db_dialect: process.env.DB_DIALECT || "mysql",
  db_port: process.env.DB_PORT || "3306",
};
