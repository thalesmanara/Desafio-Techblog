import { Link } from 'react-router-dom';
import { BarraTopo } from '../componentes/BarraTopo';
import { ContainerPagina } from '../componentes/ContainerPagina';
import { BotaoVerde } from '../componentes/BotaoVerde';

export function PaginaLanding() {
  return (
    <div className="min-h-screen bg-fundo">
      <BarraTopo mostrarEntrar />

      <ContainerPagina>
        <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
          <h1 className="font-serif text-5xl font-semibold tracking-tight text-slate-900 md:text-6xl">
            Insights &amp; Learning
          </h1>
          <p className="mt-4 max-w-xl text-sm text-slate-600">
            Explorando tendências Tech, um post por vez
          </p>

          <Link to="/login" className="mt-8">
            <BotaoVerde className="px-6 py-2">Começar a ler</BotaoVerde>
          </Link>
        </div>
      </ContainerPagina>
    </div>
  );
}
