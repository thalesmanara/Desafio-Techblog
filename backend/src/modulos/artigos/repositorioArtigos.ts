import { abrirBanco, inicializarSqlJs, salvarBanco } from '../../banco/conexao';

export type ArtigoResumo = {
  id: number;
  titulo: string;
  imagemUrl: string | null;
  criadoEm: string;
  atualizadoEm: string;
  autor: { id: number; nome: string };
  tagPrincipal: string | null;
};

export type ResultadoPaginado<T> = {
  itens: T[];
  pagina: number;
  tamanho: number;
  total: number;
};

type FiltrosListagem = {
  pagina: number;
  tamanho: number;
  busca?: string;
  tag?: string;
};

function lerNumeroSeguro(valor: unknown, padrao: number): number {
  const n = Number(valor);
  if (Number.isNaN(n) || !Number.isFinite(n) || n <= 0) return padrao;
  return Math.floor(n);
}

export function parsearFiltrosListagem(query: any): FiltrosListagem {
  return {
    pagina: lerNumeroSeguro(query.pagina, 1),
    tamanho: Math.min(lerNumeroSeguro(query.tamanho, 10), 50),
    busca: typeof query.busca === 'string' ? query.busca.trim() : undefined,
    tag: typeof query.tag === 'string' ? query.tag.trim().toLowerCase() : undefined
  };
}

export async function listarArtigos(caminhoBanco: string, filtros: FiltrosListagem): Promise<ResultadoPaginado<ArtigoResumo>> {
  await inicializarSqlJs();
  const db = abrirBanco(caminhoBanco);

  const offset = (filtros.pagina - 1) * filtros.tamanho;

  // Monta WHERE
  const condicoes: string[] = [];
  const params: any[] = [];

  if (filtros.busca && filtros.busca.length > 0) {
    condicoes.push('a.titulo LIKE ?');
    params.push(`%${filtros.busca}%`);
  }

  if (filtros.tag && filtros.tag.length > 0) {
    condicoes.push(`EXISTS (
      SELECT 1
      FROM artigos_tags at
      JOIN tags t ON t.id = at.tag_id
      WHERE at.artigo_id = a.id AND t.nome = ?
    )`);
    params.push(filtros.tag);
  }

  const whereSql = condicoes.length ? `WHERE ${condicoes.join(' AND ')}` : '';

  try {
    // total
    const sqlTotal = `SELECT COUNT(*) as total FROM artigos a ${whereSql};`;
    const stmtTotal = db.prepare(sqlTotal);
    stmtTotal.bind(params);
    stmtTotal.step();
    const totalObj = stmtTotal.getAsObject() as any;
    const total = Number(totalObj.total || 0);
    stmtTotal.free();

    // itens
    const sqlItens = `
      SELECT
        a.id,
        a.titulo,
        a.imagem_url,
        a.criado_em,
        a.atualizado_em,
        u.id as autor_id,
        u.nome as autor_nome,
        (
          SELECT t.nome
          FROM artigos_tags at2
          JOIN tags t ON t.id = at2.tag_id
          WHERE at2.artigo_id = a.id AND at2.principal = 1
          LIMIT 1
        ) as tag_principal
      FROM artigos a
      JOIN usuarios u ON u.id = a.autor_id
      ${whereSql}
      ORDER BY a.atualizado_em DESC
      LIMIT ? OFFSET ?;
    `;

    const stmtItens = db.prepare(sqlItens);
    const paramsItens = [...params, filtros.tamanho, offset];
    stmtItens.bind(paramsItens);

    const itens: ArtigoResumo[] = [];
    while (stmtItens.step()) {
      const r = stmtItens.getAsObject() as any;
      itens.push({
        id: Number(r.id),
        titulo: String(r.titulo),
        imagemUrl: r.imagem_url ? String(r.imagem_url) : null,
        criadoEm: String(r.criado_em),
        atualizadoEm: String(r.atualizado_em),
        autor: { id: Number(r.autor_id), nome: String(r.autor_nome) },
        tagPrincipal: r.tag_principal ? String(r.tag_principal) : null
      });
    }
    stmtItens.free();

    return { itens, pagina: filtros.pagina, tamanho: filtros.tamanho, total };
  } finally {
    db.close();
  }
}


export type ArtigoDetalhe = {
  id: number;
  titulo: string;
  conteudo: string;
  imagemUrl: string | null;
  criadoEm: string;
  atualizadoEm: string;
  autor: { id: number; nome: string; email: string };
  tags: { nome: string; principal: boolean }[];
};

export async function buscarArtigoPorId(caminhoBanco: string, id: number): Promise<ArtigoDetalhe | null> {
  await inicializarSqlJs();
  const db = abrirBanco(caminhoBanco);

  try {
    const stmtArtigo = db.prepare(`
      SELECT
        a.id,
        a.titulo,
        a.conteudo,
        a.imagem_url,
        a.criado_em,
        a.atualizado_em,
        u.id as autor_id,
        u.nome as autor_nome,
        u.email as autor_email
      FROM artigos a
      JOIN usuarios u ON u.id = a.autor_id
      WHERE a.id = ?
      LIMIT 1;
    `);

    stmtArtigo.bind([id]);
    if (!stmtArtigo.step()) {
      stmtArtigo.free();
      return null;
    }

    const r = stmtArtigo.getAsObject() as any;
    stmtArtigo.free();

    const stmtTags = db.prepare(`
      SELECT t.nome as nome, at.principal as principal
      FROM artigos_tags at
      JOIN tags t ON t.id = at.tag_id
      WHERE at.artigo_id = ?
      ORDER BY at.principal DESC, t.nome ASC;
    `);

    stmtTags.bind([id]);
    const tags: { nome: string; principal: boolean }[] = [];
    while (stmtTags.step()) {
      const tr = stmtTags.getAsObject() as any;
      tags.push({ nome: String(tr.nome), principal: Number(tr.principal) === 1 });
    }
    stmtTags.free();

    return {
      id: Number(r.id),
      titulo: String(r.titulo),
      conteudo: String(r.conteudo),
      imagemUrl: r.imagem_url ? String(r.imagem_url) : null,
      criadoEm: String(r.criado_em),
      atualizadoEm: String(r.atualizado_em),
      autor: { id: Number(r.autor_id), nome: String(r.autor_nome), email: String(r.autor_email) },
      tags
    };
  } finally {
    db.close();
  }
}


export type ArtigoCriado = { id: number };

export async function criarArtigo(
  caminhoBanco: string,
  dados: { titulo: string; conteudo: string; imagemUrl: string | null; autorId: number; tags: string[]; tagPrincipal: string }
): Promise<ArtigoCriado> {
  await inicializarSqlJs();
  const db = abrirBanco(caminhoBanco);

  try {
    db.run('BEGIN;');

    // Gerar id simples: max(id) + 1 (mantém compatível com seed, que usa ids do JSON)
    const resMax = db.exec('SELECT COALESCE(MAX(id), 0) as max_id FROM artigos;');
    const maxId = resMax.length ? Number(resMax[0].values[0][0]) : 0;
    const novoId = maxId + 1;

    const agora = new Date().toISOString();

    const stmtArtigo = db.prepare(
      'INSERT INTO artigos (id, titulo, conteudo, imagem_url, autor_id, criado_em, atualizado_em) VALUES (?, ?, ?, ?, ?, ?, ?);'
    );
    stmtArtigo.run([novoId, dados.titulo, dados.conteudo, dados.imagemUrl, dados.autorId, agora, agora]);
    stmtArtigo.free();

    // Inserir/garantir tags
    const stmtInserirTag = db.prepare('INSERT OR IGNORE INTO tags (nome) VALUES (?);');
    for (const tag of dados.tags) stmtInserirTag.run([tag]);
    stmtInserirTag.free();

    // Mapear tag -> id
    const stmtBuscarTag = db.prepare('SELECT id FROM tags WHERE nome = ? LIMIT 1;');

    const stmtInserirRel = db.prepare(
      'INSERT OR REPLACE INTO artigos_tags (artigo_id, tag_id, principal) VALUES (?, ?, ?);'
    );

    for (const tag of dados.tags) {
      stmtBuscarTag.bind([tag]);
      if (stmtBuscarTag.step()) {
        const obj = stmtBuscarTag.getAsObject() as any;
        const tagId = Number(obj.id);
        const principal = tag === dados.tagPrincipal ? 1 : 0;
        stmtInserirRel.run([novoId, tagId, principal]);
      }
      stmtBuscarTag.reset();
    }

    stmtBuscarTag.free();
    stmtInserirRel.free();

    db.run('COMMIT;');
    salvarBanco(db, caminhoBanco);
    return { id: novoId };
  } catch (e) {
    try { db.run('ROLLBACK;'); } catch {}
    throw e;
  } finally {
    db.close();
  }
}


export type ResultadoAtualizacao = { encontrado: boolean; permitido: boolean };

export async function atualizarArtigo(
  caminhoBanco: string,
  id: number,
  dados: { titulo: string; conteudo: string; imagemUrl: string | null; autorId: number; tags: string[]; tagPrincipal: string }
): Promise<ResultadoAtualizacao> {
  await inicializarSqlJs();
  const db = abrirBanco(caminhoBanco);

  try {
    // Verifica existência e autor
    const stmtExiste = db.prepare('SELECT autor_id as autor_id FROM artigos WHERE id = ? LIMIT 1;');
    stmtExiste.bind([id]);
    if (!stmtExiste.step()) {
      stmtExiste.free();
      return { encontrado: false, permitido: false };
    }
    const obj = stmtExiste.getAsObject() as any;
    const autorIdDoBanco = Number(obj.autor_id);
    stmtExiste.free();

    if (autorIdDoBanco !== dados.autorId) {
      return { encontrado: true, permitido: false };
    }

    db.run('BEGIN;');

    const agora = new Date().toISOString();

    const stmtAtualizar = db.prepare(
      'UPDATE artigos SET titulo = ?, conteudo = ?, imagem_url = ?, atualizado_em = ? WHERE id = ?;'
    );
    stmtAtualizar.run([dados.titulo, dados.conteudo, dados.imagemUrl, agora, id]);
    stmtAtualizar.free();

    // Atualiza tags (remove relações antigas e cria novas)
    const stmtLimparRel = db.prepare('DELETE FROM artigos_tags WHERE artigo_id = ?;');
    stmtLimparRel.run([id]);
    stmtLimparRel.free();

    const stmtInserirTag = db.prepare('INSERT OR IGNORE INTO tags (nome) VALUES (?);');
    for (const tag of dados.tags) stmtInserirTag.run([tag]);
    stmtInserirTag.free();

    const stmtBuscarTag = db.prepare('SELECT id FROM tags WHERE nome = ? LIMIT 1;');
    const stmtInserirRel = db.prepare(
      'INSERT OR REPLACE INTO artigos_tags (artigo_id, tag_id, principal) VALUES (?, ?, ?);'
    );

    for (const tag of dados.tags) {
      stmtBuscarTag.bind([tag]);
      if (stmtBuscarTag.step()) {
        const t = stmtBuscarTag.getAsObject() as any;
        const tagId = Number(t.id);
        const principal = tag === dados.tagPrincipal ? 1 : 0;
        stmtInserirRel.run([id, tagId, principal]);
      }
      stmtBuscarTag.reset();
    }

    stmtBuscarTag.free();
    stmtInserirRel.free();

    db.run('COMMIT;');
    salvarBanco(db, caminhoBanco);

    return { encontrado: true, permitido: true };
  } catch (e) {
    try { db.run('ROLLBACK;'); } catch {}
    throw e;
  } finally {
    db.close();
  }
}
