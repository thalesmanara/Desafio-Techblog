import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarraTopo } from '../componentes/BarraTopo';
import { ContainerPagina } from '../componentes/ContainerPagina';
import { BotaoVerde } from '../componentes/BotaoVerde';
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
    <div className="min-h-screen bg-fundo">
      <BarraTopo />

      <ContainerPagina>
        <div className="flex min-h-[70vh] items-center justify-center">
          <form onSubmit={entrar} className="w-full max-w-sm">
            <h1 className="text-center font-serif text-2xl font-semibold text-slate-900">
              Bem-vindo de volta
            </h1>

            <div className="mt-10">
              <label className="text-xs font-semibold text-slate-700">Email</label>
              <input
                className="mt-2 w-full rounded-md bg-verdeClaro px-4 py-3 text-xs text-slate-900 outline-none placeholder:text-slate-500"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div className="mt-4">
              <label className="text-xs font-semibold text-slate-700">Senha</label>
              <input
                type="password"
                className="mt-2 w-full rounded-md bg-verdeClaro px-4 py-3 text-xs text-slate-900 outline-none placeholder:text-slate-500"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            {erro ? <p className="mt-4 text-center text-xs text-red-600">{erro}</p> : null}

            <div className="mt-6">
              <BotaoVerde disabled={carregando} className="w-full py-2">
                {carregando ? 'Entrando...' : 'Entrar'}
              </BotaoVerde>
            </div>
          </form>
        </div>
      </ContainerPagina>
    </div>
  );
}
