import { Request, Response } from 'express';
import { buscarArtigoPorId, listarArtigos, parsearFiltrosListagem } from './repositorioArtigos';

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


function parsearId(param: unknown): number | null {
  const n = Number(param);
  if (!Number.isFinite(n) || Number.isNaN(n) || n <= 0) return null;
  return Math.floor(n);
}

export async function detalhar(req: Request, res: Response): Promise<void> {
  const id = parsearId(req.params.id);
  if (!id) {
    res.status(400).json({ mensagem: 'Id inválido.' });
    return;
  }

  const artigo = await buscarArtigoPorId(obterCaminhoBanco(), id);
  if (!artigo) {
    res.status(404).json({ mensagem: 'Artigo não encontrado.' });
    return;
  }

  res.json(artigo);
}
