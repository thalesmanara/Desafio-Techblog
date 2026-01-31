import { FormEvent, useEffect, useMemo, useState } from 'react';
import { BotaoVerde } from './BotaoVerde';
import { criarComentario, listarComentarios, responderComentario } from '../servicos/comentarios';
import { ComentarioTopo } from '../tipos/comentario';

type Props = { artigoId: number };

export function ComentariosArtigo({ artigoId }: Props) {
  const tamanho = 5;

  const [pagina, setPagina] = useState(1);
  const [total, setTotal] = useState(0);
  const [itens, setItens] = useState<ComentarioTopo[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const [novoConteudo, setNovoConteudo] = useState('');

  const podeVerMais = useMemo(() => pagina * tamanho < total, [pagina, total]);

  async function carregar(paginaDesejada: number, anexar: boolean) {
    setErro(null);
    setCarregando(true);
    try {
      const res = await listarComentarios(artigoId, paginaDesejada, tamanho);
      setTotal(res.total);
      setPagina(res.pagina);
      setItens((antigos) => (anexar ? [...antigos, ...res.itens] : res.itens));
    } catch (e: any) {
      setErro(e?.message ?? 'Não foi possível carregar comentários.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artigoId]);

  async function enviarComentario(e: FormEvent) {
    e.preventDefault();
    const texto = novoConteudo.trim();
    if (texto.length < 3) {
      setErro('Comentário muito curto.');
      return;
    }

    setCarregando(true);
    setErro(null);
    try {
      await criarComentario(artigoId, texto);
      setNovoConteudo('');
      await carregar(1, false);
    } catch (e: any) {
      setErro(e?.message ?? 'Não foi possível enviar comentário.');
    } finally {
      setCarregando(false);
    }
  }

  async function enviarResposta(comentarioId: number, conteudo: string) {
    const texto = conteudo.trim();
    if (texto.length < 3) {
      setErro('Resposta muito curta.');
      return;
    }

    setCarregando(true);
    setErro(null);
    try {
      await responderComentario(artigoId, comentarioId, texto);
      await carregar(1, false);
    } catch (e: any) {
      setErro(e?.message ?? 'Não foi possível enviar resposta.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="mt-10">
      <h2 className="text-sm font-semibold text-slate-900">Comentários</h2>

      <form onSubmit={enviarComentario}>
        <textarea
          className="mt-3 min-h-[90px] w-full rounded-md bg-verdeClaro px-4 py-3 text-xs text-slate-900 outline-none placeholder:text-slate-500"
          placeholder="Escreva um comentário..."
          value={novoConteudo}
          onChange={(e) => setNovoConteudo(e.target.value)}
          disabled={carregando}
        />

        <div className="mt-3">
          <BotaoVerde disabled={carregando}>Comentar</BotaoVerde>
        </div>
      </form>

      {erro ? <p className="mt-4 text-[11px] text-red-600">{erro}</p> : null}

      <div className="mt-6 space-y-4">
        {itens.map((c) => (
          <ComentarioItem
            key={c.id}
            comentario={c}
            aoResponder={enviarResposta}
            desabilitado={carregando}
          />
        ))}

        {itens.length === 0 && !carregando ? (
          <p className="text-[11px] text-slate-500">Ainda não há comentários.</p>
        ) : null}
      </div>

      {podeVerMais ? (
        <div className="mt-6">
          <button
            type="button"
            className="text-xs font-semibold text-verde hover:text-verdeEscuro"
            onClick={() => carregar(pagina + 1, true)}
            disabled={carregando}
          >
            Ver mais comentários
          </button>
        </div>
      ) : null}
    </div>
  );
}

function ComentarioItem({
  comentario,
  aoResponder,
  desabilitado
}: {
  comentario: ComentarioTopo;
  aoResponder: (comentarioId: number, conteudo: string) => Promise<void>;
  desabilitado: boolean;
}) {
  const [mostrarResposta, setMostrarResposta] = useState(false);
  const [conteudoResposta, setConteudoResposta] = useState('');

  async function enviar(e: FormEvent) {
    e.preventDefault();
    await aoResponder(comentario.id, conteudoResposta);
    setConteudoResposta('');
    setMostrarResposta(false);
  }

  return (
    <div className="rounded-md border border-slate-200 bg-white px-4 py-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-slate-900">{comentario.autor.nome}</p>
          <p className="mt-2 whitespace-pre-wrap text-xs text-slate-700">{comentario.conteudo}</p>
        </div>
        <span className="text-[10px] text-slate-400">{new Date(comentario.criadoEm).toLocaleString('pt-BR')}</span>
      </div>

      <div className="mt-3">
        <button
          type="button"
          className="text-[11px] font-semibold text-verde hover:text-verdeEscuro"
          onClick={() => setMostrarResposta((v) => !v)}
        >
          {mostrarResposta ? 'Cancelar' : 'Responder'}
        </button>
      </div>

      {mostrarResposta ? (
        <form onSubmit={enviar} className="mt-3 space-y-2">
          <textarea
            value={conteudoResposta}
            onChange={(e) => setConteudoResposta(e.target.value)}
            placeholder="Escreva uma resposta..."
            className="min-h-[70px] w-full rounded-md bg-verdeClaro px-4 py-3 text-xs text-slate-900 outline-none placeholder:text-slate-500"
            disabled={desabilitado}
          />
          <div className="flex gap-3">
            <button
              type="button"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
              onClick={() => { setMostrarResposta(false); setConteudoResposta(''); }}
              disabled={desabilitado}
            >
              Cancelar
            </button>
            <button
              className="text-xs font-semibold text-verde hover:text-verdeEscuro disabled:opacity-60"
              disabled={desabilitado}
            >
              Enviar
            </button>
          </div>
        </form>
      ) : null}

      {comentario.respostas?.length ? (
        <div className="mt-4 space-y-3 border-l border-slate-200 pl-4">
          {comentario.respostas.map((r) => (
            <div key={r.id} className="rounded-md bg-slate-50 px-3 py-2">
              <p className="text-[11px] font-semibold text-slate-900">{r.autor.nome}</p>
              <p className="mt-1 whitespace-pre-wrap text-xs text-slate-700">{r.conteudo}</p>
              <p className="mt-2 text-[10px] text-slate-400">{new Date(r.criadoEm).toLocaleString('pt-BR')}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
