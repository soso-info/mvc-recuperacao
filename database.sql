CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  papel ENUM('organizador','participante') NOT NULL DEFAULT 'participante',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE eventos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(180) NOT NULL,
  descricao TEXT NOT NULL,
  local VARCHAR(180) NOT NULL,
  data_hora DATETIME NOT NULL,
  vagas INT NOT NULL,
  organizador_id INT NOT NULL,
  FOREIGN KEY (organizador_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
CREATE TABLE inscricoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  evento_id INT NOT NULL,
  usuario_id INT NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY inscricao_unica (evento_id, usuario_id),
  FOREIGN KEY (evento_id) REFERENCES eventos(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
