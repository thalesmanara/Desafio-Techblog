import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BarraTopo } from '../componentes/BarraTopo';
import { ContainerPagina } from '../componentes/ContainerPagina';
import { BotaoVerde } from '../componentes/BotaoVerde';
import { Chip } from '../componentes/Chip';
import { detalharArtigo, editarArtigo } from '../servicos/artigos';

const TAGS_SUGERIDAS = ['Frontend', 'Backend', 'Mobile', 'DevOps', 'AI'];

function normalizarTags(texto: string): string[] {
  return texto
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

export function PaginaEditarArtigo() {
  const navigate = useNavigate();
  const params = useParams();
  const id = Number(params.id);

  const [titulo, setTitulo] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [tagsTexto, setTagsTexto] = useState('');
  const [tagsSelecionadas, setTagsSelecionadas] = useState<string[]>([]);
  const [tagPrincipal, setTagPrincipal] = useState<string>('');
  const [erro, setErro] = useState<string | null>(null);

  const tagsFinal = useMemo(() => {
    const combinadas = Array.from(new Set([...normalizarTags(tagsTexto), ...tagsSelecionadas]));
    return combinadas;
  }, [tagsTexto, tagsSelecionadas]);

  useEffect(() => {
    (async () => {
      try {
        const a = await detalharArtigo(id);

        setTitulo(a.titulo);
        setImagemUrl(a.imagemUrl ?? '');
        setConteudo(a.conteudo);

        const lista = a.tags.map((t) => t.nome);
        const sugeridas = TAGS_SUGERIDAS.map((s) => s.toLowerCase());
        setTagsSelecionadas(lista.filter((t) => sugeridas.includes(t.toLowerCase())));
        setTagsTexto(lista.filter((t) => !sugeridas.includes(t.toLowerCase())).join(', '));

        setTagPrincipal(a.tags.find((t) => t.principal)?.nome ?? '');
      } catch (e: any) {
        setErro(e?.message ?? 'Não foi possível carregar o artigo.');
      }
    })();
  }, [id]);

  function alternarTag(tag: string) {
    setTagsSelecionadas((atual) => {
      const existe = atual.map((x) => x.toLowerCase()).includes(tag.toLowerCase());
      const proximo = existe ? atual.filter((x) => x.toLowerCase() !== tag.toLowerCase()) : [...atual, tag];

      if (tagPrincipal && !proximo.map((x) => x.toLowerCase()).includes(tagPrincipal.toLowerCase())) {
        setTagPrincipal('');
      }

      return proximo;
    });
  }

  async function salvar() {
    setErro(null);

    if (!titulo.trim()) {
      setErro('Título é obrigatório.');
      return;
    }
    if (conteudo.trim().length < 10) {
      setErro('Conteúdo deve ter pelo menos 10 caracteres.');
      return;
    }

    try {
      await editarArtigo(id, {
        titulo,
        conteudo,
        imagemUrl: imagemUrl.trim() || null,
        tags: tagsFinal,
        tagPrincipal: tagPrincipal.trim() || null
      });

      navigate(`/artigos/${id}`);
    } catch (e: any) {
      setErro(e?.message ?? 'Não foi possível salvar o artigo.');
    }
  }

  return (
    <div className="min-h-screen bg-fundo">
      <BarraTopo />

      <ContainerPagina>
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-serif text-2xl font-semibold text-slate-900">Editar artigo</h1>
          <BotaoVerde onClick={salvar}>Salvar</BotaoVerde>
        </div>

        <div className="mt-8 space-y-5">
          <div>
            <label className="text-xs font-semibold text-slate-700">Título do artigo *</label>
            <input
              className="mt-2 w-full rounded-md bg-verdeClaro px-4 py-3 text-xs text-slate-900 outline-none placeholder:text-slate-500"
              placeholder="Título"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">Imagem do artigo</label>
            <input
              className="mt-2 w-full rounded-md bg-verdeClaro px-4 py-3 text-xs text-slate-900 outline-none placeholder:text-slate-500"
              placeholder="URL da imagem"
              value={imagemUrl}
              onChange={(e) => setImagemUrl(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">Tags *</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {TAGS_SUGERIDAS.map((t) => (
                <Chip
                  key={t}
                  texto={t}
                  ativo={tagsSelecionadas.map((x) => x.toLowerCase()).includes(t.toLowerCase())}
                  onClick={() => alternarTag(t)}
                />
              ))}
            </div>

            <input
              className="mt-3 w-full rounded-md bg-verdeClaro px-4 py-3 text-xs text-slate-900 outline-none placeholder:text-slate-500"
              placeholder="Outras tags (separadas por vírgula)"
              value={tagsTexto}
              onChange={(e) => setTagsTexto(e.target.value)}
            />

            <div className="mt-3">
              <label className="text-xs font-semibold text-slate-700">Tag principal</label>
              <input
                className="mt-2 w-full rounded-md bg-verdeClaro px-4 py-3 text-xs text-slate-900 outline-none placeholder:text-slate-500"
                placeholder="Ex: Frontend"
                value={tagPrincipal}
                onChange={(e) => setTagPrincipal(e.target.value)}
              />
              <p className="mt-1 text-[11px] text-slate-500">A tag principal deve estar dentro das tags selecionadas.</p>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">Conteúdo *</label>
            <textarea
              className="mt-2 min-h-[180px] w-full rounded-md bg-verdeClaro px-4 py-3 text-xs text-slate-900 outline-none placeholder:text-slate-500"
              placeholder="Escreva aqui seu artigo..."
              value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
            />
          </div>

          {erro ? <p className="text-xs text-red-600">{erro}</p> : null}
        </div>
      </ContainerPagina>
    </div>
  );
}
