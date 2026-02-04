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

type UsuarioToken = { id: number; nome: string; email: string };

function decodificarBase64Url(valor: string): string {
  // JWT usa base64url (sem + / e com padding opcional)
  const base64 = valor.replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const texto = atob(base64 + padding);
  // converter para unicode
  return decodeURIComponent(
    texto
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
}

export function obterUsuarioDoToken(): UsuarioToken | null {
  const token = obterToken();
  if (!token) return null;

  const partes = token.split('.');
  if (partes.length !== 3) return null;

  try {
    const payloadJson = decodificarBase64Url(partes[1]);
    const payload = JSON.parse(payloadJson);
    if (!payload?.id) return null;

    return {
      id: Number(payload.id),
      nome: String(payload.nome ?? ''),
      email: String(payload.email ?? '')
    };
  } catch {
    return null;
  }
}

