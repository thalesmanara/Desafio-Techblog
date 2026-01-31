import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { abrirBanco, inicializarSqlJs, salvarBanco } from './conexao';

dotenv.config();

function obterCaminhoBanco(): string {
  const caminho = process.env.CAMINHO_BANCO;
  if (!caminho) throw new Error('Variável CAMINHO_BANCO não definida no .env');
  return caminho;
}

function obterCaminhoSchema(): string {
  return path.resolve(__dirname, '../../sql/schema.sql');
}

async function criarBancoEAplicarSchema(): Promise<void> {
  const caminhoBanco = obterCaminhoBanco();
  const caminhoSchema = obterCaminhoSchema();
  if (!fs.existsSync(caminhoSchema)) throw new Error(`Schema não encontrado em: ${caminhoSchema}`);

  const schemaSql = fs.readFileSync(caminhoSchema, 'utf-8');

  await inicializarSqlJs();
  const db = abrirBanco(caminhoBanco);

  try {
    db.run(schemaSql);
    salvarBanco(db, caminhoBanco);
    console.log('Banco criado/atualizado com sucesso.');
    console.log(`Arquivo do banco: ${path.resolve(caminhoBanco)}`);
  } finally {
    db.close();
  }
}

criarBancoEAplicarSchema();
