import { obterToken, removerToken } from './autenticacao';
import { montarUrlApi } from './api';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

type OpcaoRequisicao = RequestInit & { autenticar?: boolean };

export async function requisitar<T>(caminho: string, opcoes: OpcaoRequisicao = {}): Promise<T> {
  const headers = new Headers(opcoes.headers);

  if (opcoes.autenticar) {
    const token = obterToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }

  if (!headers.has('Content-Type') && opcoes.body) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(`${API_URL}${caminho}`, { ...opcoes, headers });

  if (res.status === 401) {
    removerToken();
  }

  const texto = await res.text();
  const dados = texto ? JSON.parse(texto) : null;

  if (!res.ok) {
    const mensagem = dados?.mensagem ?? 'Erro na requisição.';
    throw new Error(mensagem);
  }

  return dados as T;
}