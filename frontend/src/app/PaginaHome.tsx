import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarraTopo } from '../componentes/BarraTopo';
import { ContainerPagina } from '../componentes/ContainerPagina';
import { BotaoVerde } from '../componentes/BotaoVerde';
import { Chip } from '../componentes/Chip';
import { listarArtigos } from '../servicos/artigos';
import { ArtigoResumo } from '../tipos/artigo';

const TAGS_SUGERIDAS = ['Frontend', 'Backend', 'Mobile', 'DevOps', 'AI'];

function IconeEditar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 20h4l10.5-10.5-4-4L4 16v4z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M13.5 6.5l4 4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function PaginacaoNumerica({
  paginaAtual,
  totalPaginas,
  onIrPara
}: {
  paginaAtual: number;
  totalPaginas: number;
  onIrPara: (p: number) => void;
}) {
  const paginas = useMemo(() => {
    const max = Math.min(totalPaginas, 5);
    return Array.from({ length: max }, (_, i) => i + 1);
  }, [totalPaginas]);

  return (
    <div className="mt-10 flex items-center justify-center gap-3 text-xs text-slate-600">
      {paginas.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onIrPara(p)}
          className={[
            'grid h-8 w-8 place-items-center rounded-full',
            p === paginaAtual ? 'bg-verdeClaro text-slate-900' : 'hover:bg-slate-100'
          ].join(' ')}
        >
          {p}
        </button>
      ))}
    </div>
  );
}

export function PaginaHome() {
  const [pagina, setPagina] = useState(1);
  const [busca, setBusca] = useState('');
  const [tag, setTag] = useState('');
  const [itens, setItens] = useState<ArtigoResumo[]>([]);
  const [total, setTotal] = useState(0);
  const tamanho = 5;

  const totalPaginas = useMemo(() => Math.max(1, Math.ceil(total / tamanho)), [total]);

  useEffect(() => {
    (async () => {
      const res = await listarArtigos(pagina, tamanho, busca, tag);
      setItens(res.itens);
      setTotal(res.total);
    })();
  }, [pagina, busca, tag]);

  return (
    <div className="min-h-screen bg-fundo">
      <BarraTopo />

      <ContainerPagina>
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-serif text-2xl font-semibold text-slate-900">Todos os artigos</h1>

          <Link to="/artigos/novo">
            <BotaoVerde>Criar artigo</BotaoVerde>
          </Link>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {TAGS_SUGERIDAS.map((t) => (
            <Chip
              key={t}
              texto={t}
              ativo={tag.toLowerCase() === t.toLowerCase()}
              onClick={() => {
                setPagina(1);
                setTag((atual) => (atual.toLowerCase() === t.toLowerCase() ? '' : t));
              }}
            />
          ))}
        </div>

        <div className="mt-3">
          <input
            className="w-full rounded-md bg-verdeClaro px-4 py-3 text-xs text-slate-900 outline-none placeholder:text-slate-500"
            placeholder="Pesquisar..."
            value={busca}
            onChange={(e) => {
              setPagina(1);
              setBusca(e.target.value);
            }}
          />
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-borda">
          {itens.map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-3 border-b border-borda px-3 py-3 last:border-b-0"
            >
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-slate-200">
                {a.imagemUrl ? (
                  <img src={a.imagemUrl} alt="" className="h-full w-full object-cover" />
                ) : null}
              </div>

              <Link to={`/artigos/${a.id}`} className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-slate-900">{a.titulo}</p>
                <p className="mt-0.5 line-clamp-1 text-[11px] text-slate-600">{a.resumo}</p>
                {a.tagPrincipal ? (
                  <span className="mt-1 inline-block rounded-full bg-verdeClaro px-2 py-0.5 text-[10px] text-slate-700">
                    {a.tagPrincipal}
                  </span>
                ) : null}
              </Link>

              <Link
                to={`/artigos/${a.id}/editar`}
                className="grid h-8 w-8 place-items-center rounded-md text-slate-600 hover:bg-slate-100"
                aria-label="Editar"
                title="Editar"
              >
                <IconeEditar />
              </Link>
            </div>
          ))}

          {itens.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-slate-600">Nenhum artigo encontrado.</div>
          ) : null}
        </div>

        <PaginacaoNumerica paginaAtual={pagina} totalPaginas={totalPaginas} onIrPara={setPagina} />
      </ContainerPagina>
    </div>
  );
}
