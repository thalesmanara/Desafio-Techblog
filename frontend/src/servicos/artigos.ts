import { requisitar } from './api';
import { ArtigoDetalhe, ArtigoResumo, ResultadoPaginado } from '../tipos/artigo';

export async function listarArtigos(pagina: number, tamanho: number, busca: string, tag: string) {
  const params = new URLSearchParams();
  params.set('pagina', String(pagina));
  params.set('tamanho', String(tamanho));
  if (busca) params.set('busca', busca);
  if (tag) params.set('tag', tag);

  return requisitar<ResultadoPaginado<ArtigoResumo>>(`/api/artigos?${params.toString()}`, { autenticar: true });
}

export async function detalharArtigo(id: number) {
  return requisitar<ArtigoDetalhe>(`/api/artigos/${id}`, { autenticar: true });
}

export async function criarArtigo(dados: { titulo: string; conteudo: string; imagemUrl: string | null; tags: string[]; tagPrincipal?: string | null; }) {
  return requisitar<{ id: number }>(`/api/artigos`, { method: 'POST', autenticar: true, body: JSON.stringify(dados) });
}

export async function editarArtigo(id: number, dados: { titulo: string; conteudo: string; imagemUrl: string | null; tags: string[]; tagPrincipal?: string | null; }) {
  return requisitar<{ ok: boolean }>(`/api/artigos/${id}`, { method: 'PUT', autenticar: true, body: JSON.stringify(dados) });
}

export async function excluirArtigo(id: number) {
  return requisitar<{ ok: boolean }>(`/api/artigos/${id}`, { method: 'DELETE', autenticar: true });
}
