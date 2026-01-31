import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Cabecalho } from '../componentes/Cabecalho';
import { detalharArtigo, editarArtigo } from '../servicos/artigos';

export function PaginaEditarArtigo() {
  const params = useParams();
  const navigate = useNavigate();
  const id = Number(params.id);

  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [tags, setTags] = useState('');
  const [tagPrincipal, setTagPrincipal] = useState('');
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const a = await detalharArtigo(id);
        setTitulo(a.titulo);
        setConteudo(a.conteudo);
        setTags(a.tags.map((t) => t.nome).join(', '));
        setTagPrincipal(a.tags.find((t) => t.principal)?.nome ?? '');
      } catch (e: any) {
        setErro(e?.message ?? 'Não foi possível carregar o artigo.');
      }
    })();
  }, [id]);

  async function salvar() {
    setErro(null);
    try {
      const listaTags = tags.split(',').map((t) => t.trim()).filter(Boolean);
      await editarArtigo(id, { titulo, conteudo, imagemUrl: null, tags: listaTags, tagPrincipal: tagPrincipal.trim() || null });
      navigate(`/artigos/${id}`);
    } catch (e: any) {
      setErro(e?.message ?? 'Não foi possível editar o artigo.');
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Cabecalho />
      <main className="mx-auto max-w-4xl px-4 py-6">
        <h1 className="text-2xl font-semibold">Editar artigo</h1>

        <div className="mt-6 space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6">
          <div>
            <label className="text-sm text-zinc-200">Título</label>
            <input className="mt-2 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-yellow-400" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
          </div>

          <div>
            <label className="text-sm text-zinc-200">Conteúdo</label>
            <textarea className="mt-2 min-h-[180px] w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-yellow-400" value={conteudo} onChange={(e) => setConteudo(e.target.value)} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm text-zinc-200">Tags (vírgula)</label>
              <input className="mt-2 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-yellow-400" value={tags} onChange={(e) => setTags(e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-zinc-200">Tag principal</label>
              <input className="mt-2 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-yellow-400" value={tagPrincipal} onChange={(e) => setTagPrincipal(e.target.value)} />
            </div>
          </div>

          {erro ? <p className="text-sm text-red-400">{erro}</p> : null}

          <div className="flex justify-end">
            <button onClick={salvar} className="rounded-md bg-yellow-400 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-yellow-300">Salvar</button>
          </div>
        </div>
      </main>
    </div>
  );
}
