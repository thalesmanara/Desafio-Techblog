import { abrirBanco, inicializarSqlJs } from '../../banco/conexao';

type UsuarioDoBanco = { id: number; nome: string; email: string; senha_hash: string };

export async function buscarUsuarioPorEmail(caminhoBanco: string, email: string): Promise<UsuarioDoBanco | null> {
  await inicializarSqlJs();
  const db = abrirBanco(caminhoBanco);

  try {
    const stmt = db.prepare('SELECT id, nome, email, senha_hash FROM usuarios WHERE email = ? LIMIT 1;');
    stmt.bind([email]);
    if (!stmt.step()) return null;
    const linha = stmt.getAsObject() as any;
    return {
      id: Number(linha.id),
      nome: String(linha.nome),
      email: String(linha.email),
      senha_hash: String(linha.senha_hash)
    };
  } finally {
    db.close();
  }
}
