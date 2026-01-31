import { Link, useNavigate } from 'react-router-dom';
import { removerToken } from '../servicos/autenticacao';

export function Cabecalho() {
  const navigate = useNavigate();

  function sair() {
    removerToken();
    navigate('/login');
  }

  return (
    <header className="w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/home" className="text-lg font-semibold tracking-wide">TechBlog</Link>
        <button onClick={sair} className="rounded-md bg-zinc-900 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800">
          Sair
        </button>
      </div>
    </header>
  );
}
