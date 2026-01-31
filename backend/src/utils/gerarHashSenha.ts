import crypto from 'crypto';

export function gerarHashSenha(senha: string): string {
  return crypto.createHash('sha256').update(senha).digest('hex');
}
