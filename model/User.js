const pool = require("../config/database");
exports.findByEmail = async (email) => {
  const [rows] = await pool.execute(
    "SELECT id, nome, email, senha_hash, papel FROM usuarios WHERE email = ?",
    [email],
  );
  return rows[0];
};
exports.create = async ({ nome, email, senhaHash, papel }) => {
  const [result] = await pool.execute(
    "INSERT INTO usuarios (nome, email, senha_hash, papel) VALUES (?, ?, ?, ?)",
    [nome, email, senhaHash, papel],
  );
  return result.insertId;
};
