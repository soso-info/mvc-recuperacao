const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

function getCA() {
  // Se o conteúdo do certificado veio direto na env var (Render/produção)
  if (process.env.DB_SSL_CA_CONTENT) {
    return process.env.DB_SSL_CA_CONTENT;
  }
  // Se veio um caminho de arquivo (ambiente local)
  if (process.env.DB_SSL_CA) {
    return fs.readFileSync(path.resolve(process.env.DB_SSL_CA), "utf8");
  }
  
  return undefined;
}

const ssl =
  process.env.DB_SSL === "true"
    ? {
        rejectUnauthorized: true,
        ca: getCA(),
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