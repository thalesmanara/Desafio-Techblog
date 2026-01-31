import { Request, Response, NextFunction } from 'express';
import { validarToken } from '../modulos/autenticacao/servicoJwt';

export function autenticarUsuario(req: Request, res: Response, next: NextFunction): void {
  const cabecalho = req.headers.authorization;

  if (!cabecalho || !cabecalho.startsWith('Bearer ')) {
    res.status(401).json({ mensagem: 'Token não informado.' });
    return;
  }

  const token = cabecalho.replace('Bearer ', '').trim();

  try {
    const usuario = validarToken(token);
    req.usuario = usuario;
    next();
  } catch {
    res.status(401).json({ mensagem: 'Token inválido ou expirado.' });
  }
}
