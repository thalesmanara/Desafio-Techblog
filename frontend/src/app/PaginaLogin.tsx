import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requisitar } from '../servicos/api';
import { salvarToken } from '../servicos/autenticacao';

type RespostaLogin = { token: string };

export function PaginaLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('carlos.henrique@techblog.local');
  const [senha, setSenha] = useState('senha123');
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function entrar(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    try {
      const res = await requisitar<RespostaLogin>('/api/autenticacao/login', {
        method: 'POST',
        body: JSON.stringify({ email, senha })
      });
      salvarToken(res.token);
      navigate('/home');
    } catch (err: any) {
      setErro(err?.message ?? 'Não foi possível entrar.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6">
        <form onSubmit={entrar} className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h1 className="text-xl font-semibold">Login</h1>

          <label className="mt-6 block text-sm text-zinc-200">E-mail</label>
          <input
            className="mt-2 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-yellow-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />

          <label className="mt-4 block text-sm text-zinc-200">Senha</label>
          <input
            type="password"
            className="mt-2 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-yellow-400"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            autoComplete="current-password"
          />

          {erro ? <p className="mt-4 text-sm text-red-400">{erro}</p> : null}

          <button disabled={carregando} className="mt-6 w-full rounded-md bg-yellow-400 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-yellow-300 disabled:opacity-60">
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </main>
  );
}
