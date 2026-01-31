export function normalizarListaTags(texto: string): string[] {
  return texto
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => t.toLowerCase());
}
