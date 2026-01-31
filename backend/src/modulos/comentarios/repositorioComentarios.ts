import { abrirBanco, inicializarSqlJs, salvarBanco } from '../../banco/conexao';
import { ComentarioTopo, ResultadoPaginado } from './tipos';
import { normalizarTexto } from '../../utils/normalizarTexto';

type FiltrosComentarios = { pagina: number; tamanho: number };

function lerNumeroSeguro(valor: unknown, padrao: number): number {
  const n = Number(valor);
  if (Number.isNaN(n) || !Number.isFinite(n) || n <= 0) return padrao;
  return Math.floor(n);
}

export function parsearFiltrosComentarios(query: any): FiltrosComentarios {
  return {
    pagina: lerNumeroSeguro(query.pagina, 1),
    tamanho: Math.min(lerNumeroSeguro(query.tamanho, 5), 20)
  };
}

export async function listarComentariosPorArtigo(
  caminhoBanco: string,
  artigoId: number,
  filtros: FiltrosComentarios
): Promise<ResultadoPaginado<ComentarioTopo>> {
  await inicializarSqlJs();
  const db = abrirBanco(caminhoBanco);

  const offset = (filtros.pagina - 1) * filtros.tamanho;

  try {
    // total de comentários topo
    const stmtTotal = db.prepare(
      'SELECT COUNT(*) as total FROM comentarios WHERE artigo_id = ? AND comentario_pai_id IS NULL;'
    );
    stmtTotal.bind([artigoId]);
    stmtTotal.step();
    const totalObj = stmtTotal.getAsObject() as any;
    const total = Number(totalObj.total || 0);
    stmtTotal.free();

    // comentários topo paginados
    const stmtTopo = db.prepare(`
      SELECT c.id, c.conteudo, c.criado_em, u.id as autor_id, u.nome as autor_nome
      FROM comentarios c
      JOIN usuarios u ON u.id = c.autor_id
      WHERE c.artigo_id = ? AND c.comentario_pai_id IS NULL
      ORDER BY c.criado_em DESC
      LIMIT ? OFFSET ?;
    `);
    stmtTopo.bind([artigoId, filtros.tamanho, offset]);

    const comentarios: ComentarioTopo[] = [];
    const idsTopo: number[] = [];

    while (stmtTopo.step()) {
      const r = stmtTopo.getAsObject() as any;
      const id = Number(r.id);
      idsTopo.push(id);
      comentarios.push({
        id,
        conteudo: String(r.conteudo),
        criadoEm: String(r.criado_em),
        autor: { id: Number(r.autor_id), nome: String(r.autor_nome) },
        respostas: []
      });
    }
    stmtTopo.free();

    if (idsTopo.length > 0) {
      const placeholders = idsTopo.map(() => '?').join(',');
      const stmtResp = db.prepare(`
        SELECT c.id, c.conteudo, c.criado_em, c.comentario_pai_id, u.id as autor_id, u.nome as autor_nome
        FROM comentarios c
        JOIN usuarios u ON u.id = c.autor_id
        WHERE c.comentario_pai_id IN (${placeholders})
        ORDER BY c.criado_em ASC;
      `);
      stmtResp.bind(idsTopo);

      const mapa = new Map<number, ComentarioTopo>();
      for (const c of comentarios) mapa.set(c.id, c);

      while (stmtResp.step()) {
        const r = stmtResp.getAsObject() as any;
        const paiId = Number(r.comentario_pai_id);
        const pai = mapa.get(paiId);
        if (!pai) continue;
        pai.respostas.push({
          id: Number(r.id),
          conteudo: String(r.conteudo),
          criadoEm: String(r.criado_em),
          autor: { id: Number(r.autor_id), nome: String(r.autor_nome) }
        });
      }
      stmtResp.free();
    }

    return { itens: comentarios, pagina: filtros.pagina, tamanho: filtros.tamanho, total };
  } finally {
    db.close();
  }
}

function validarConteudoComentario(conteudo: unknown): string | null {
  if (typeof conteudo !== 'string') return null;
  const c = normalizarTexto(conteudo);
  if (c.length < 2) return null;
  if (c.length > 1000) return null;
  return c;
}

export async function criarComentarioTopo(
  caminhoBanco: string,
  artigoId: number,
  autorId: number,
  conteudo: unknown
): Promise<{ id: number } | null> {
  const conteudoValido = validarConteudoComentario(conteudo);
  if (!conteudoValido) return null;

  await inicializarSqlJs();
  const db = abrirBanco(caminhoBanco);

  try {
    // verifica se artigo existe
    const stmtArtigo = db.prepare('SELECT id FROM artigos WHERE id = ? LIMIT 1;');
    stmtArtigo.bind([artigoId]);
    const existe = stmtArtigo.step();
    stmtArtigo.free();
    if (!existe) return null;

    db.run('BEGIN;');

    const stmtIns = db.prepare(
      'INSERT INTO comentarios (artigo_id, autor_id, conteudo, comentario_pai_id, criado_em) VALUES (?, ?, ?, NULL, ?);'
    );
    const agora = new Date().toISOString();
    stmtIns.run([artigoId, autorId, conteudoValido, agora]);
    stmtIns.free();

    const stmtId = db.prepare('SELECT last_insert_rowid() as id;');
    stmtId.step();
    const obj = stmtId.getAsObject() as any;
    const id = Number(obj.id);
    stmtId.free();

    db.run('COMMIT;');
    salvarBanco(db, caminhoBanco);

    return { id };
  } catch (e) {
    try { db.run('ROLLBACK;'); } catch {}
    throw e;
  } finally {
    db.close();
  }
}

export async function criarResposta(
  caminhoBanco: string,
  artigoId: number,
  comentarioPaiId: number,
  autorId: number,
  conteudo: unknown
): Promise<{ id: number } | null> {
  const conteudoValido = validarConteudoComentario(conteudo);
  if (!conteudoValido) return null;

  await inicializarSqlJs();
  const db = abrirBanco(caminhoBanco);

  try {
    // garante que o comentário pai existe, é topo (sem pai) e pertence ao artigo
    const stmtPai = db.prepare(
      'SELECT id, artigo_id, comentario_pai_id FROM comentarios WHERE id = ? LIMIT 1;'
    );
    stmtPai.bind([comentarioPaiId]);
    if (!stmtPai.step()) {
      stmtPai.free();
      return null;
    }
    const pai = stmtPai.getAsObject() as any;
    stmtPai.free();

    if (Number(pai.artigo_id) !== artigoId) return null;
    if (pai.comentario_pai_id !== null && pai.comentario_pai_id !== undefined) return null; // evita árvore infinita

    db.run('BEGIN;');

    const stmtIns = db.prepare(
      'INSERT INTO comentarios (artigo_id, autor_id, conteudo, comentario_pai_id, criado_em) VALUES (?, ?, ?, ?, ?);'
    );
    const agora = new Date().toISOString();
    stmtIns.run([artigoId, autorId, conteudoValido, comentarioPaiId, agora]);
    stmtIns.free();

    const stmtId = db.prepare('SELECT last_insert_rowid() as id;');
    stmtId.step();
    const obj = stmtId.getAsObject() as any;
    const id = Number(obj.id);
    stmtId.free();

    db.run('COMMIT;');
    salvarBanco(db, caminhoBanco);

    return { id };
  } catch (e) {
    try { db.run('ROLLBACK;'); } catch {}
    throw e;
  } finally {
    db.close();
  }
}
