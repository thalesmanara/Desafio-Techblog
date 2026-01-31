export type AutorComentario = { id: number; nome: string };

export type RespostaComentario = {
  id: number;
  conteudo: string;
  criadoEm: string;
  autor: AutorComentario;
};

export type ComentarioTopo = {
  id: number;
  conteudo: string;
  criadoEm: string;
  autor: AutorComentario;
  respostas: RespostaComentario[];
};

export type ResultadoPaginado<T> = {
  itens: T[];
  pagina: number;
  tamanho: number;
  total: number;
};
