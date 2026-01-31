import { Request, Response } from 'express';
import { listarArtigos, parsearFiltrosListagem } from './repositorioArtigos';

function obterCaminhoBanco(): string {
  const caminho = process.env.CAMINHO_BANCO;
  if (!caminho) throw new Error('CAMINHO_BANCO não definido no .env');
  return caminho;
}

export async function listar(req: Request, res: Response): Promise<void> {
  const filtros = parsearFiltrosListagem(req.query);
  const resultado = await listarArtigos(obterCaminhoBanco(), filtros);
  res.json(resultado);
}
