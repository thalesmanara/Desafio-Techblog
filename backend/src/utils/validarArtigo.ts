import { normalizarTexto, normalizarTag } from './normalizarTexto';

export type DadosCriacaoArtigo = {
  titulo: string;
  conteudo: string;
  imagemUrl?: string | null;
  tags: string[];
  tagPrincipal?: string | null;
};

export type DadosArtigoValidados = {
  titulo: string;
  conteudo: string;
  imagemUrl: string | null;
  tags: string[];
  tagPrincipal: string;
};

export function validarCriacaoArtigo(body: any): DadosArtigoValidados | null {
  const titulo = typeof body?.titulo === 'string' ? normalizarTexto(body.titulo) : '';
  const conteudo = typeof body?.conteudo === 'string' ? body.conteudo : '';
  const imagemUrl = typeof body?.imagemUrl === 'string' && body.imagemUrl.trim() ? body.imagemUrl.trim() : null;

  const tagsBrutas = Array.isArray(body?.tags) ? body.tags : [];
  const tags = tagsBrutas
    .filter((t: any) => typeof t === 'string' && t.trim().length > 0)
    .map((t: string) => normalizarTag(t));

  const tagsUnicas = Array.from(new Set(tags)).slice(0, 5);

  const tagPrincipalBruta = typeof body?.tagPrincipal === 'string' ? normalizarTag(body.tagPrincipal) : null;

  if (titulo.length < 3) return null;
  if (conteudo.trim().length < 10) return null;
  if (tagsUnicas.length === 0) return null;

  const tagPrincipal = (tagPrincipalBruta && tagsUnicas.includes(tagPrincipalBruta)) ? tagPrincipalBruta : tagsUnicas[0];

  return { titulo, conteudo, imagemUrl, tags: tagsUnicas, tagPrincipal };
}


export function validarEdicaoArtigo(body: any): DadosArtigoValidados | null {
  // Para simplificar (nível junior), edição exige os mesmos campos mínimos da criação
  return validarCriacaoArtigo(body);
}
