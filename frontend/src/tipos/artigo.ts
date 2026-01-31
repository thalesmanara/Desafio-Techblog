export type TagArtigo = { nome: string; principal: boolean };

export type ArtigoResumo = {
  id: number;
  titulo: string;
  resumo: string;
  imagemUrl: string | null;
  criadoEm: string;
  autor: { id: number; nome: string; email: string };
  tagPrincipal: string | null;
};

export type ArtigoDetalhe = {
  id: number;
  titulo: string;
  conteudo: string;
  imagemUrl: string | null;
  criadoEm: string;
  atualizadoEm: string;
  autor: { id: number; nome: string; email: string };
  tags: TagArtigo[];
};

export type ResultadoPaginado<T> = {
  itens: T[];
  pagina: number;
  tamanho: number;
  total: number;
};
