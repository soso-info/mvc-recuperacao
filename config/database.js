const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

const ssl =
  process.env.DB_SSL === "true"
    ? {
        rejectUnauthorized: true,
        ca: process.env.DB_SSL_CA
          ? fs.readFileSync(path.resolve(process.env.DB_SSL_CA), "utf8")
          : undefined,
      }
    : undefined;

module.exports = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  ssl,
});
