PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha_hash TEXT NOT NULL,
  criado_em TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS artigos (
  id INTEGER PRIMARY KEY,
  titulo TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  imagem_url TEXT NULL,
  autor_id INTEGER NOT NULL,
  criado_em TEXT NOT NULL,
  atualizado_em TEXT NOT NULL,
  FOREIGN KEY (autor_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS artigos_tags (
  artigo_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  principal INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (artigo_id, tag_id),
  FOREIGN KEY (artigo_id) REFERENCES artigos(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comentarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  artigo_id INTEGER NOT NULL,
  autor_id INTEGER NOT NULL,
  conteudo TEXT NOT NULL,
  comentario_pai_id INTEGER NULL,
  criado_em TEXT NOT NULL,
  FOREIGN KEY (artigo_id) REFERENCES artigos(id) ON DELETE CASCADE,
  FOREIGN KEY (autor_id) REFERENCES usuarios(id),
  FOREIGN KEY (comentario_pai_id) REFERENCES comentarios(id)
);

CREATE INDEX IF NOT EXISTS idx_artigos_titulo ON artigos(titulo);
CREATE INDEX IF NOT EXISTS idx_artigos_autor ON artigos(autor_id);
CREATE INDEX IF NOT EXISTS idx_tags_nome ON tags(nome);
CREATE INDEX IF NOT EXISTS idx_comentarios_artigo ON comentarios(artigo_id);
CREATE INDEX IF NOT EXISTS idx_artigos_tags_artigo ON artigos_tags(artigo_id);
