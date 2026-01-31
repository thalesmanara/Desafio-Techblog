import { Request, Response } from 'express';
import { criarComentarioTopo, criarResposta, listarComentariosPorArtigo, parsearFiltrosComentarios } from './repositorioComentarios';

function obterCaminhoBanco(): string {
  const caminho = process.env.CAMINHO_BANCO;
  if (!caminho) throw new Error('CAMINHO_BANCO não definido no .env');
  return caminho;
}

function parsearId(param: unknown): number | null {
  const n = Number(param);
  if (!Number.isFinite(n) || Number.isNaN(n) || n <= 0) return null;
  return Math.floor(n);
}

export async function listar(req: Request, res: Response): Promise<void> {
  const artigoId = parsearId(req.params.artigoId);
  if (!artigoId) {
    res.status(400).json({ mensagem: 'Id de artigo inválido.' });
    return;
  }

  const filtros = parsearFiltrosComentarios(req.query);
  const resultado = await listarComentariosPorArtigo(obterCaminhoBanco(), artigoId, filtros);
  res.json(resultado);
}

export async function criar(req: Request, res: Response): Promise<void> {
  if (!req.usuario) {
    res.status(401).json({ mensagem: 'Não autenticado.' });
    return;
  }

  const artigoId = parsearId(req.params.artigoId);
  if (!artigoId) {
    res.status(400).json({ mensagem: 'Id de artigo inválido.' });
    return;
  }

  const criado = await criarComentarioTopo(obterCaminhoBanco(), artigoId, req.usuario.id, req.body?.conteudo);
  if (!criado) {
    res.status(400).json({ mensagem: 'Não foi possível criar o comentário.' });
    return;
  }

  res.status(201).json({ id: criado.id });
}

export async function responder(req: Request, res: Response): Promise<void> {
  if (!req.usuario) {
    res.status(401).json({ mensagem: 'Não autenticado.' });
    return;
  }

  const artigoId = parsearId(req.params.artigoId);
  const comentarioPaiId = parsearId(req.params.comentarioId);

  if (!artigoId || !comentarioPaiId) {
    res.status(400).json({ mensagem: 'Parâmetros inválidos.' });
    return;
  }

  const criado = await criarResposta(obterCaminhoBanco(), artigoId, comentarioPaiId, req.usuario.id, req.body?.conteudo);
  if (!criado) {
    res.status(400).json({ mensagem: 'Não foi possível criar a resposta.' });
    return;
  }

  res.status(201).json({ id: criado.id });
}
