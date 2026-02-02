import { Request, Response } from 'express';
import { listarTags } from './repositorioTags';

function obterCaminhoBanco(): string {
  const caminho = process.env.CAMINHO_BANCO;
  if (!caminho) throw new Error('CAMINHO_BANCO não definido no .env');
  return caminho;
}

export async function listar(req: Request, res: Response): Promise<void> {
  const limiteParam = typeof req.query.limite === 'string' ? Number(req.query.limite) : undefined;
  const limite = Number.isFinite(limiteParam) && (limiteParam as number) > 0 ? Math.min(limiteParam as number, 50) : 20;

  const itens = await listarTags(obterCaminhoBanco(), limite);
  res.json({ itens });
}
