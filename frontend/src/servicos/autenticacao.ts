const CHAVE_TOKEN = 'techblog_token';

export function salvarToken(token: string) {
  localStorage.setItem(CHAVE_TOKEN, token);
}

export function obterToken(): string | null {
  return localStorage.getItem(CHAVE_TOKEN);
}

export function removerToken() {
  localStorage.removeItem(CHAVE_TOKEN);
}

export function estaAutenticado(): boolean {
  return Boolean(obterToken());
}
