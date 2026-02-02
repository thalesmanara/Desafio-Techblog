import { abrirBanco, inicializarSqlJs } from '../../banco/sqljs';

export type TagResumo = {
  nome: string;
  quantidade: number;
};

export async function listarTags(caminhoBanco: string, limite = 20): Promise<TagResumo[]> {
  await inicializarSqlJs();
  const db = abrirBanco(caminhoBanco);

  const stmt = db.prepare(
    `
    SELECT t.nome as nome, COUNT(*) as quantidade
    FROM tags t
    INNER JOIN artigos_tags at ON at.tag_id = t.id
    GROUP BY t.id
    ORDER BY quantidade DESC, t.nome ASC
    LIMIT ?
    `
  );

  stmt.bind([limite]);

  const itens: TagResumo[] = [];
  while (stmt.step()) {
    const row: any = stmt.getAsObject();
    itens.push({
      nome: String(row.nome),
      quantidade: Number(row.quantidade)
    });
  }
  stmt.free();

  return itens;
}
