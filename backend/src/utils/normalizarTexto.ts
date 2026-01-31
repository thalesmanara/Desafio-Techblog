export function normalizarTexto(valor: string): string {
  return valor.trim().replace(/\s+/g, ' ');
}

export function normalizarTag(valor: string): string {
  return normalizarTexto(valor).toLowerCase();
}
