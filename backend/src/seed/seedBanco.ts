import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { abrirBanco, inicializarSqlJs, salvarBanco } from '../banco/conexao';

dotenv.config();

const CAMINHO_JSON = path.resolve(__dirname, '../../../articles dev.json');

function gerarEmail(nome: string): string {
  return nome.toLowerCase().replace(/\s+/g, '.') + '@techblog.com';
}

async function seed(): Promise<void> {
  const caminhoBanco = process.env.CAMINHO_BANCO!;
  const dados = JSON.parse(fs.readFileSync(CAMINHO_JSON, 'utf-8'));

  await inicializarSqlJs();
  const db = abrirBanco(caminhoBanco);

  const usuariosMap = new Map<string, number>();
  const senhaHash = await bcrypt.hash('senha123', 10);

  for (const item of dados) {
    if (!usuariosMap.has(item.author)) {
      db.run(
        'INSERT INTO usuarios (nome, email, senha_hash, criado_em) VALUES (?, ?, ?, ?)',
        [item.author, gerarEmail(item.author), senhaHash, new Date().toISOString()]
      );
      const id = db.exec('SELECT last_insert_rowid() as id')[0].values[0][0] as number;
      usuariosMap.set(item.author, id);
    }
  }

  for (const item of dados) {
    const autorId = usuariosMap.get(item.author)!;
    const criado = new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30);

    db.run(
      'INSERT INTO artigos (id, titulo, conteudo, imagem_url, autor_id, criado_em, atualizado_em) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [item.id, item.title, item.content, null, autorId, criado.toISOString(), criado.toISOString()]
    );

    const tags = [item.tag1, item.tag2, item.tag3].filter(Boolean);
    for (let i = 0; i < tags.length; i++) {
      const nome = tags[i].toLowerCase();
      db.run('INSERT OR IGNORE INTO tags (nome) VALUES (?)', [nome]);
      const tagId = db.exec('SELECT id FROM tags WHERE nome = ?', [nome])[0].values[0][0];
      db.run(
        'INSERT INTO artigos_tags (artigo_id, tag_id, principal) VALUES (?, ?, ?)',
        [item.id, tagId, i === 0 ? 1 : 0]
      );
    }
  }

  salvarBanco(db, caminhoBanco);
  db.close();
  console.log('Seed executado com sucesso.');
}

seed();
