import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { abrirBanco, inicializarSqlJs } from '../banco/conexao';
import { gerarHashSenha } from '../utils/gerarHashSenha';

dotenv.config();

type Usuario = {
  id: number;
  nome: string;
  email: string;
  senha_hash: string;
};

export async function autenticarUsuario(email: string, senha: string) {
  const segredo = process.env.JWT_SEGREDO;
  const caminhoBanco = process.env.CAMINHO_BANCO;

  if (!segredo || !caminhoBanco) {
    throw new Error('Configuração de autenticação inválida');
  }

  await inicializarSqlJs();
  const db = abrirBanco(caminhoBanco);

  try {
    const hash = gerarHashSenha(senha);
    const resultado = db.exec(
      'SELECT id, nome, email, senha_hash FROM usuarios WHERE email = ?;',
      [email]
    );

    if (resultado.length === 0 || resultado[0].values.length === 0) {
      return null;
    }

    const [id, nome, emailDb, senhaHash] = resultado[0].values[0];

    if (String(senhaHash) !== hash) {
      return null;
    }

    const token = jwt.sign(
      { idUsuario: id, nome: nome, email: emailDb },
      segredo,
      { expiresIn: '8h' }
    );

    return {
      token,
      usuario: {
        id,
        nome,
        email: emailDb
      }
    };
  } finally {
    db.close();
  }
}
