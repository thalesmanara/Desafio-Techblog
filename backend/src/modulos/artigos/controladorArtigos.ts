import { Request, Response } from 'express';
import { atualizarArtigo, buscarArtigoPorId, criarArtigo, excluirArtigo, listarArtigos, parsearFiltrosListagem } from './repositorioArtigos';
import { validarCriacaoArtigo, validarEdicaoArtigo } from '../../utils/validarArtigo';

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


export async function criar(req: Request, res: Response): Promise<void> {
  if (!req.usuario) {
    res.status(401).json({ mensagem: 'Não autenticado.' });
    return;
  }

  const dados = validarCriacaoArtigo(req.body);
  if (!dados) {
    res.status(400).json({ mensagem: 'Dados inválidos para criação do artigo.' });
    return;
  }

  const criado = await criarArtigo(obterCaminhoBanco(), {
    titulo: dados.titulo,
    conteudo: dados.conteudo,
    imagemUrl: dados.imagemUrl,
    autorId: req.usuario.id,
    tags: dados.tags,
    tagPrincipal: dados.tagPrincipal
  });

  res.status(201).json({ id: criado.id });
}


export async function editar(req: Request, res: Response): Promise<void> {
  if (!req.usuario) {
    res.status(401).json({ mensagem: 'Não autenticado.' });
    return;
  }

  const id = parsearId(req.params.id);
  if (!id) {
    res.status(400).json({ mensagem: 'Id inválido.' });
    return;
  }

  const dados = validarEdicaoArtigo(req.body);
  if (!dados) {
    res.status(400).json({ mensagem: 'Dados inválidos para edição do artigo.' });
    return;
  }

  const resultado = await atualizarArtigo(obterCaminhoBanco(), id, {
    titulo: dados.titulo,
    conteudo: dados.conteudo,
    imagemUrl: dados.imagemUrl,
    autorId: req.usuario.id,
    tags: dados.tags,
    tagPrincipal: dados.tagPrincipal
  });

  if (!resultado.encontrado) {
    res.status(404).json({ mensagem: 'Artigo não encontrado.' });
    return;
  }

  if (!resultado.permitido) {
    res.status(403).json({ mensagem: 'Você não tem permissão para editar este artigo.' });
    return;
  }

  res.json({ ok: true });
}


export async function excluir(req: Request, res: Response): Promise<void> {
  if (!req.usuario) {
    res.status(401).json({ mensagem: 'Não autenticado.' });
    return;
  }

  const id = parsearId(req.params.id);
  if (!id) {
    res.status(400).json({ mensagem: 'Id inválido.' });
    return;
  }

  const resultado = await excluirArtigo(obterCaminhoBanco(), id, req.usuario.id);

  if (!resultado.encontrado) {
    res.status(404).json({ mensagem: 'Artigo não encontrado.' });
    return;
  }

  if (!resultado.permitido) {
    res.status(403).json({ mensagem: 'Você não tem permissão para excluir este artigo.' });
    return;
  }

  res.json({ ok: true });
}
