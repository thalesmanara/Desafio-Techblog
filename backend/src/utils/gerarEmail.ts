import { normalizarTexto } from './normalizarTexto';

function removerAcentos(texto: string): string {
  return texto.normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

export function gerarEmailAPartirDoNome(nome: string): string {
  const base = removerAcentos(normalizarTexto(nome))
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .join('.');

  const usuario = base || 'usuario';
  return `${usuario}@techblog.local`;
}
