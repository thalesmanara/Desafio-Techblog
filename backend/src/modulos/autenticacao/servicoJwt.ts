import jwt from 'jsonwebtoken';
import type { UsuarioAutenticado } from './tipos';

function obterSegredo(): string {
  const segredo = process.env.JWT_SEGREDO;
  if (!segredo) throw new Error('JWT_SEGREDO não definido no .env');
  return segredo;
}

function obterExpiracao(): string {
  return process.env.JWT_EXPIRACAO || '8h';
}

export function gerarToken(usuario: UsuarioAutenticado): string {
  return jwt.sign({ id: usuario.id, nome: usuario.nome, email: usuario.email }, obterSegredo(), {
    expiresIn: obterExpiracao()
  });
}

export function validarToken(token: string): UsuarioAutenticado {
  const payload = jwt.verify(token, obterSegredo()) as any;
  return { id: Number(payload.id), nome: String(payload.nome), email: String(payload.email) };
}
