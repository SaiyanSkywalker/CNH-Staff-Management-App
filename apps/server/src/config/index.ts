import dotenv from "dotenv";
dotenv.config();

export default {
  host: "localhost",
  port: process.env.SERVER_PORT || "3000",
  db: process.env.DB || "cnh_staff_management",
  db_user: process.env.DB_USER || "admin",
  db_password: process.env.DB_PASSWORD || "Cnh_nurses24",
  db_hostname: process.env.DB_HOSTNAME || "hostname",
  db_dialect: process.env.DB_DIALECT || "oracle",
  db_port: process.env.DB_PORT || "1521",
  db_connection_string: "(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.us-ashburn-1.oraclecloud.com))(connect_data=(service_name=g50439132466e16_cnhstaffmanagement_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))"
};
