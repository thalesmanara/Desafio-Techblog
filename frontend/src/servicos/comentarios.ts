import { requisitar } from './api';
import { ComentarioTopo, ResultadoPaginado } from '../tipos/comentario';

export async function listarComentarios(artigoId: number, pagina: number, tamanho: number) {
  const params = new URLSearchParams();
  params.set('pagina', String(pagina));
  params.set('tamanho', String(tamanho));
  return requisitar<ResultadoPaginado<ComentarioTopo>>(
    `/api/artigos/${artigoId}/comentarios?${params.toString()}`,
    { autenticar: true }
  );
}

export async function criarComentario(artigoId: number, conteudo: string) {
  return requisitar<{ id: number }>(`/api/artigos/${artigoId}/comentarios`, {
    method: 'POST',
    autenticar: true,
    body: JSON.stringify({ conteudo })
  });
}

export async function responderComentario(artigoId: number, comentarioId: number, conteudo: string) {
  return requisitar<{ id: number }>(`/api/artigos/${artigoId}/comentarios/${comentarioId}/respostas`, {
    method: 'POST',
    autenticar: true,
    body: JSON.stringify({ conteudo })
  });
}
