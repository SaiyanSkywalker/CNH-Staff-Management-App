import dotenv from "dotenv";
dotenv.config();

export default {
  host: "localhost",
  port: process.env.PORT || "3000",
  db: "chn",
  db_user: process.env.DB_USER || "root",
  db_dialect: process.env.DB_DIALECT || "mysql",
  db_password: process.env.DB_PASSWORD || "password"
};
