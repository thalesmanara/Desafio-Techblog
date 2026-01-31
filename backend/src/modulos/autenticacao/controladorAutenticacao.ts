import { Request, Response } from 'express';
import { buscarUsuarioPorEmail } from './repositorioUsuarios';
import { gerarHashSenha } from '../../utils/gerarHashSenha';
import { gerarToken } from './servicoJwt';

function obterCaminhoBanco(): string {
  const caminho = process.env.CAMINHO_BANCO;
  if (!caminho) throw new Error('CAMINHO_BANCO não definido no .env');
  return caminho;
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, senha } = req.body as { email?: string; senha?: string };

  if (!email || !senha) {
    res.status(400).json({ mensagem: 'Email e senha são obrigatórios.' });
    return;
  }

  const usuario = await buscarUsuarioPorEmail(obterCaminhoBanco(), email);
  if (!usuario) {
    res.status(401).json({ mensagem: 'Credenciais inválidas.' });
    return;
  }

  const senhaHash = gerarHashSenha(senha);
  if (senhaHash !== usuario.senha_hash) {
    res.status(401).json({ mensagem: 'Credenciais inválidas.' });
    return;
  }

  const usuarioSeguro = { id: usuario.id, nome: usuario.nome, email: usuario.email };
  const token = gerarToken(usuarioSeguro);

  res.json({ token, usuario: usuarioSeguro });
}
