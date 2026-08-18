const pool = require('../config/database');
exports.listUpcoming = async () => { const [rows] = await pool.execute('SELECT e.*, u.nome AS organizador FROM eventos e JOIN usuarios u ON u.id = e.organizador_id WHERE e.data_hora >= NOW() ORDER BY e.data_hora'); return rows; };
exports.findById = async (id) => { const [rows] = await pool.execute('SELECT e.*, u.nome AS organizador FROM eventos e JOIN usuarios u ON u.id = e.organizador_id WHERE e.id = ?', [id]); return rows[0]; };
exports.byOrganizer = async (organizerId) => { const [rows] = await pool.execute('SELECT * FROM eventos WHERE organizador_id = ? ORDER BY data_hora DESC', [organizerId]); return rows; };
exports.create = async (event, organizerId) => { const [r] = await pool.execute('INSERT INTO eventos (titulo, descricao, local, data_hora, vagas, organizador_id) VALUES (?, ?, ?, ?, ?, ?)', [event.titulo, event.descricao, event.local, event.data_hora, event.vagas, organizerId]); return r.insertId; };
exports.update = async (id, event, organizerId) => pool.execute('UPDATE eventos SET titulo = ?, descricao = ?, local = ?, data_hora = ?, vagas = ? WHERE id = ? AND organizador_id = ?', [event.titulo, event.descricao, event.local, event.data_hora, event.vagas, id, organizerId]);
exports.remove = async (id, organizerId) => pool.execute('DELETE FROM eventos WHERE id = ? AND organizador_id = ?', [id, organizerId]);
exports.enroll = async (eventId, userId) => {
  const [result] = await pool.execute(
    'INSERT INTO inscricoes (evento_id, usuario_id) SELECT ?, ? FROM eventos e WHERE e.id = ? AND (SELECT COUNT(*) FROM inscricoes i WHERE i.evento_id = e.id) < e.vagas',
    [eventId, userId, eventId]
  );
  return result.affectedRows === 1;
};
exports.isEnrolled = async (eventId, userId) => { const [r] = await pool.execute('SELECT id FROM inscricoes WHERE evento_id = ? AND usuario_id = ?', [eventId, userId]); return Boolean(r[0]); };
