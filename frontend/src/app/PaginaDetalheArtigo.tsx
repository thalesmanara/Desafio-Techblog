import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BarraTopo } from '../componentes/BarraTopo';
import { ContainerPagina } from '../componentes/ContainerPagina';
import { BotaoVerde } from '../componentes/BotaoVerde';
import { detalharArtigo, excluirArtigo } from '../servicos/artigos';
import { ArtigoDetalhe } from '../tipos/artigo';
import { ComentariosArtigo } from '../componentes/ComentariosArtigo';
import { obterUsuarioDoToken } from '../servicos/autenticacao';

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

  const tagPrincipal = artigo?.tags.find((t) => t.principal)?.nome ?? '';
  const usuarioLogado = obterUsuarioDoToken();
  const podeGerenciar = Boolean(usuarioLogado && artigo && artigo.autor.id === usuarioLogado.id);

  return (
    <div className="min-h-screen bg-fundo">
      <BarraTopo />

      <ContainerPagina>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-serif text-3xl font-semibold text-slate-900">
              {artigo?.titulo ?? 'Carregando...'}
            </h1>

            {artigo ? (
              <p className="mt-1 text-[11px] text-slate-500">
                Publicado por {artigo.autor.nome} • {new Date(artigo.criadoEm).toLocaleDateString('pt-BR')}
              </p>
            ) : null}
          </div>

          {tagPrincipal ? (
            <span className="shrink-0 rounded-full bg-verdeClaro px-3 py-1 text-[11px] text-slate-700">
              {tagPrincipal}
            </span>
          ) : null}
        </div>

        {erro ? <p className="mt-6 text-xs text-red-600">{erro}</p> : null}

        {artigo ? (
          <>
            <div className="mt-6 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{artigo.conteudo}</div>
            <ComentariosArtigo artigoId={artigo.id} />
{podeGerenciar ? (
  <div className="mt-8 flex flex-wrap gap-4">
    <Link
      to={`/artigos/${artigo.id}/editar`}
      className="text-xs font-semibold text-verde hover:text-verdeEscuro"
    >
      Editar artigo
    </Link>
    <button onClick={remover} className="text-xs font-semibold text-red-600 hover:text-red-700">
      Excluir artigo
    </button>
  </div>
) : null}
          </>
        ) : null}

        {artigo && !podeGerenciar ? (
          <p className="mt-10 text-xs text-slate-500">Ações de edição e exclusão disponíveis apenas para o autor.</p>
        ) : null}
      </ContainerPagina>
    </div>
  );
}
