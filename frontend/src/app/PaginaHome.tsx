import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cabecalho } from '../componentes/Cabecalho';
import { listarArtigos } from '../servicos/artigos';
import { ArtigoResumo } from '../tipos/artigo';

export function PaginaHome() {
  const [pagina, setPagina] = useState(1);
  const [busca, setBusca] = useState('');
  const [tag, setTag] = useState('');
  const [itens, setItens] = useState<ArtigoResumo[]>([]);
  const [total, setTotal] = useState(0);
  const tamanho = 10;

  const totalPaginas = useMemo(() => Math.max(1, Math.ceil(total / tamanho)), [total]);

  useEffect(() => {
    (async () => {
      const res = await listarArtigos(pagina, tamanho, busca, tag);
      setItens(res.itens);
      setTotal(res.total);
    })();
  }, [pagina, busca, tag]);

  return (
    <div className="min-h-screen bg-zinc-950">
      <Cabecalho />

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Artigos</h1>
            <p className="mt-1 text-sm text-zinc-400">Home privada.</p>
          </div>

          <Link to="/artigos/novo" className="inline-flex items-center justify-center rounded-md bg-yellow-400 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-yellow-300">
            Novo artigo
          </Link>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <input
            className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-yellow-400"
            placeholder="Buscar por título..."
            value={busca}
            onChange={(e) => { setPagina(1); setBusca(e.target.value); }}
          />
          <input
            className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-yellow-400"
            placeholder="Filtrar por tag..."
            value={tag}
            onChange={(e) => { setPagina(1); setTag(e.target.value); }}
          />
        </div>

        <section className="mt-6 space-y-3">
          {itens.map((a) => (
            <Link key={a.id} to={`/artigos/${a.id}`} className="block rounded-2xl border border-zinc-800 bg-zinc-900/30 p-4 hover:bg-zinc-900/50">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold">{a.titulo}</h2>
                  <p className="mt-2 text-sm text-zinc-400">{a.resumo}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-zinc-300">
                    <span className="rounded-full bg-zinc-800 px-2 py-1">{a.autor.nome}</span>
                    {a.tagPrincipal ? <span className="rounded-full bg-yellow-400/10 px-2 py-1 text-yellow-300">{a.tagPrincipal}</span> : null}
                  </div>
                </div>
                <span className="text-xs text-zinc-500">#{a.id}</span>
              </div>
            </Link>
          ))}
          {itens.length === 0 ? <p className="text-sm text-zinc-400">Nenhum artigo encontrado.</p> : null}
        </section>

        <div className="mt-8 flex items-center justify-between">
          <button className="rounded-md bg-zinc-900 px-3 py-2 text-sm hover:bg-zinc-800 disabled:opacity-60" disabled={pagina <= 1} onClick={() => setPagina((p) => Math.max(1, p - 1))}>
            Anterior
          </button>

          <span className="text-sm text-zinc-400">Página {pagina} de {totalPaginas}</span>

          <button className="rounded-md bg-zinc-900 px-3 py-2 text-sm hover:bg-zinc-800 disabled:opacity-60" disabled={pagina >= totalPaginas} onClick={() => setPagina((p) => p + 1)}>
            Próxima
          </button>
        </div>
      </main>
    </div>
  );
}
