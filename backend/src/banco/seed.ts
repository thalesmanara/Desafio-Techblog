import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { abrirBanco, inicializarSqlJs, salvarBanco } from './conexao';
import { gerarEmailAPartirDoNome } from '../utils/gerarEmail';
import { gerarHashSenha } from '../utils/gerarHashSenha';
import { normalizarTag, normalizarTexto } from '../utils/normalizarTexto';

dotenv.config();

type ArtigoInicial = {
  id: number;
  title: string;
  author: string;
  content: string;
  tag1?: string | null;
  tag2?: string | null;
  tag3?: string | null;
};

function obterCaminhoBanco(): string {
  const caminho = process.env.CAMINHO_BANCO;
  if (!caminho) throw new Error('Variável CAMINHO_BANCO não definida no .env');
  return caminho;
}

function obterSenhaPadrao(): string {
  return process.env.SENHA_PADRAO_USUARIOS || 'senha123';
}

function obterCaminhoJson(): string {
  return path.resolve(__dirname, '../../dados/artigos-iniciais.json');
}

function agoraIso(): string {
  return new Date().toISOString();
}

function diasAtrasIso(dias: number): string {
  const d = new Date();
  d.setDate(d.getDate() - dias);
  return d.toISOString();
}

function prepararListaTags(artigo: ArtigoInicial): string[] {
  const tagsBrutas = [artigo.tag1, artigo.tag2, artigo.tag3]
    .filter((t): t is string => typeof t === 'string' && t.trim().length > 0)
    .map((t) => normalizarTag(t));

  // remove duplicadas preservando ordem
  return Array.from(new Set(tagsBrutas));
}

function seed(): void {
  const caminhoJson = obterCaminhoJson();
  if (!fs.existsSync(caminhoJson)) throw new Error(`JSON não encontrado em: ${caminhoJson}`);

  const artigos: ArtigoInicial[] = JSON.parse(fs.readFileSync(caminhoJson, 'utf-8'));

  const senhaPadrao = obterSenhaPadrao();
  const senhaHash = gerarHashSenha(senhaPadrao);

  const caminhoBanco = obterCaminhoBanco();

  // Inicializa DB
  const criadoEmBase = agoraIso();

  const autoresUnicos = Array.from(new Set(artigos.map((a) => normalizarTexto(a.author))));

  // Usaremos uma transação simples (BEGIN/COMMIT)
  // sql.js não tem API de transação "bonita", mas suporta comandos SQL.
  // Também usamos prepared statements para inserts.
  (async () => {
    await inicializarSqlJs();
    const db = abrirBanco(caminhoBanco);

    try {
      db.run('BEGIN;');

      // 1) Usuarios
      const stmtInserirUsuario = db.prepare(
        'INSERT OR IGNORE INTO usuarios (nome, email, senha_hash, criado_em) VALUES (?, ?, ?, ?);'
      );

      for (const nomeAutor of autoresUnicos) {
        const email = gerarEmailAPartirDoNome(nomeAutor);
        stmtInserirUsuario.run([nomeAutor, email, senhaHash, criadoEmBase]);
      }
      stmtInserirUsuario.free();

      // Mapear autor -> id
      const stmtBuscarUsuario = db.prepare('SELECT id, nome, email FROM usuarios;');
      const usuarios = stmtBuscarUsuario.getAsObject(); // not useful for all rows
      stmtBuscarUsuario.free();

      // sql.js: para pegar todas as linhas, usamos exec
      const resultadoUsuarios = db.exec('SELECT id, nome FROM usuarios;');
      const mapaAutorParaId = new Map<string, number>();
      if (resultadoUsuarios.length > 0) {
        const colunas = resultadoUsuarios[0].columns;
        const linhas = resultadoUsuarios[0].values;
        const idxId = colunas.indexOf('id');
        const idxNome = colunas.indexOf('nome');
        for (const linha of linhas) {
          mapaAutorParaId.set(normalizarTexto(String(linha[idxNome])), Number(linha[idxId]));
        }
      }

      // 2) Tags
      const stmtInserirTag = db.prepare('INSERT OR IGNORE INTO tags (nome) VALUES (?);');
      const tagsUnicas = new Set<string>();
      for (const artigo of artigos) {
        for (const t of prepararListaTags(artigo)) tagsUnicas.add(t);
      }
      for (const tag of tagsUnicas) stmtInserirTag.run([tag]);
      stmtInserirTag.free();

      // Mapear tag -> id
      const resultadoTags = db.exec('SELECT id, nome FROM tags;');
      const mapaTagParaId = new Map<string, number>();
      if (resultadoTags.length > 0) {
        const colunas = resultadoTags[0].columns;
        const linhas = resultadoTags[0].values;
        const idxId = colunas.indexOf('id');
        const idxNome = colunas.indexOf('nome');
        for (const linha of linhas) {
          mapaTagParaId.set(String(linha[idxNome]), Number(linha[idxId]));
        }
      }

      // 3) Artigos + relacoes
      const stmtInserirArtigo = db.prepare(
        'INSERT OR REPLACE INTO artigos (id, titulo, conteudo, imagem_url, autor_id, criado_em, atualizado_em) VALUES (?, ?, ?, ?, ?, ?, ?);'
      );
      const stmtInserirArtigoTag = db.prepare(
        'INSERT OR REPLACE INTO artigos_tags (artigo_id, tag_id, principal) VALUES (?, ?, ?);'
      );

      let dias = 1;
      for (const artigo of artigos) {
        const autorId = mapaAutorParaId.get(normalizarTexto(artigo.author));
        if (!autorId) continue;

        const criadoEm = diasAtrasIso(dias);
        const atualizadoEm = criadoEm;

        stmtInserirArtigo.run([
          artigo.id,
          normalizarTexto(artigo.title),
          artigo.content,
          null,
          autorId,
          criadoEm,
          atualizadoEm
        ]);

        const tagsDoArtigo = prepararListaTags(artigo);
        const tagPrincipal = tagsDoArtigo[0] || null;

        for (const tag of tagsDoArtigo) {
          const tagId = mapaTagParaId.get(tag);
          if (!tagId) continue;
          const principal = tagPrincipal === tag ? 1 : 0;
          stmtInserirArtigoTag.run([artigo.id, tagId, principal]);
        }

        dias += 1;
      }

      stmtInserirArtigo.free();
      stmtInserirArtigoTag.free();

      db.run('COMMIT;');

      salvarBanco(db, caminhoBanco);
      console.log('Carga inicial aplicada com sucesso.');
      console.log(`Senha padrão dos usuários: ${senhaPadrao}`);
      console.log('Os emails foram gerados a partir do nome do autor (domínio techblog.local).');
    } catch (e) {
      try { db.run('ROLLBACK;'); } catch {}
      throw e;
    } finally {
      db.close();
    }
  })().catch((erro) => {
    console.error('Erro ao aplicar carga inicial:', erro);
    process.exit(1);
  });
}

seed();
