import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Cabecalho } from '../componentes/Cabecalho';
import { detalharArtigo, excluirArtigo } from '../servicos/artigos';
import { ArtigoDetalhe } from '../tipos/artigo';

export function PaginaDetalheArtigo() {
  const params = useParams();
  const navigate = useNavigate();
  const [artigo, setArtigo] = useState<ArtigoDetalhe | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const id = Number(params.id);

  useEffect(() => {
    (async () => {
      try {
        const res = await detalharArtigo(id);
        setArtigo(res);
      } catch (e: any) {
        setErro(e?.message ?? 'Não foi possível carregar o artigo.');
      }
    })();
  }, [id]);

  async function remover() {
    if (!artigo) return;
    if (!confirm('Deseja excluir este artigo?')) return;
    await excluirArtigo(artigo.id);
    navigate('/home');
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Cabecalho />
      <main className="mx-auto max-w-4xl px-4 py-6">
        <Link to="/home" className="text-sm text-zinc-400 hover:text-zinc-200">← Voltar</Link>

        {erro ? <p className="mt-6 text-sm text-red-400">{erro}</p> : null}
        {!artigo ? <p className="mt-6 text-sm text-zinc-400">Carregando...</p> : null}

        {artigo ? (
          <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h1 className="text-2xl font-semibold">{artigo.titulo}</h1>
                <p className="mt-2 text-sm text-zinc-400">por {artigo.autor.nome}</p>
              </div>

              <div className="flex gap-2">
                <Link to={`/artigos/${artigo.id}/editar`} className="rounded-md bg-zinc-900 px-3 py-2 text-sm hover:bg-zinc-800">Editar</Link>
                <button onClick={remover} className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-300 hover:bg-red-500/20">Excluir</button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {artigo.tags.map((t) => (
                <span key={t.nome} className={['rounded-full px-2 py-1 text-xs', t.principal ? 'bg-yellow-400/10 text-yellow-300' : 'bg-zinc-800 text-zinc-200'].join(' ')}>
                  {t.nome}
                </span>
              ))}
            </div>

            <pre className="mt-6 whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-200">{artigo.conteudo}</pre>
          </div>
        ) : null}
      </main>
    </div>
  );
}
