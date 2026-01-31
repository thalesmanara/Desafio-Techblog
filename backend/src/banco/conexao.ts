import fs from 'fs';
import path from 'path';
import initSqlJs, { Database, SqlJsStatic } from 'sql.js';

export type ConexaoBanco = Database;

let sqlJs: SqlJsStatic | null = null;

/**
 * Inicializa o SQL.js (WASM). Precisa ser chamado antes de abrir o banco.
 */
export async function inicializarSqlJs(): Promise<void> {
  if (sqlJs) return;
  sqlJs = await initSqlJs({});
}

function garantirInicializado(): SqlJsStatic {
  if (!sqlJs) {
    throw new Error('SQL.js não foi inicializado. Chame inicializarSqlJs() antes.');
  }
  return sqlJs;
}

export function abrirBanco(caminhoBanco: string): ConexaoBanco {
  const SQL = garantirInicializado();

  const caminhoAbsoluto = path.resolve(caminhoBanco);
  if (fs.existsSync(caminhoAbsoluto)) {
    const buffer = fs.readFileSync(caminhoAbsoluto);
    return new SQL.Database(new Uint8Array(buffer));
  }

  return new SQL.Database();
}

export function salvarBanco(db: ConexaoBanco, caminhoBanco: string): void {
  const dados = db.export();
  fs.writeFileSync(path.resolve(caminhoBanco), Buffer.from(dados));
}
