export type ComentarioResposta = {
  id: number;
  conteudo: string;
  criadoEm: string;
  autor: { id: number; nome: string };
};

export type ComentarioTopo = {
  id: number;
  conteudo: string;
  criadoEm: string;
  autor: { id: number; nome: string };
  respostas: ComentarioResposta[];
};

export type ResultadoPaginado<T> = {
  itens: T[];
  pagina: number;
  tamanho: number;
  total: number;
};
