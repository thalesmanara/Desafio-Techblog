import { Link, useNavigate } from 'react-router-dom';
import { removerToken, estaAutenticado } from '../servicos/autenticacao';

function IconeSair() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M10 17l1.5-1.5L9 13h9v-2H9l2.5-2.5L10 7l-5 5 5 5z" fill="currentColor" />
      <path d="M20 3h-8v2h8v14h-8v2h8a2 2 0 002-2V5a2 2 0 00-2-2z" fill="currentColor" />
    </svg>
  );
}

export function BarraTopo({ mostrarEntrar }: { mostrarEntrar?: boolean }) {
  const navigate = useNavigate();
  const logado = estaAutenticado();

  function sair() {
    removerToken();
    navigate('/login');
  }

  return (
    <header className="w-full border-b border-borda bg-fundo">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link to={logado ? '/home' : '/'} className="font-serif text-sm font-semibold">
          TechBlog
        </Link>

        <div className="flex items-center gap-3">
          {mostrarEntrar ? (
            <Link to="/login" className="text-xs font-semibold text-verde hover:text-verdeEscuro">
              Entrar
            </Link>
          ) : null}

          {logado ? (
            <button
              type="button"
              onClick={sair}
              className="grid h-8 w-8 place-items-center rounded-md border border-borda text-slate-700 hover:bg-slate-50"
              aria-label="Sair"
              title="Sair"
            >
              <IconeSair />
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
