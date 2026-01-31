# Documentação Oficial

## Decisões iniciais

- Backend: Express + TypeScript
- Banco: SQLite (arquivo local)
- Autenticação: JWT (sem cadastro)
- Frontend: React + Vite + Tailwind
- Sem Docker

## Observação de compatibilidade

Para manter a instalação simples no Windows, foi usada a biblioteca `sql.js` (WASM) para acessar SQLite sem exigir ferramentas de compilação.

## Banco e carga inicial

A carga inicial lê `backend/dados/artigos-iniciais.json` e cria usuários (a partir dos autores), artigos e tags/relacionamentos.
A senha padrão dos usuários é definida por `SENHA_PADRAO_USUARIOS` no `.env`.

## Login

- Endpoint: `POST /api/autenticacao/login`
- Body: `{ "email": "...", "senha": "..." }`
- Resposta: `{ token, usuario }`

## Artigos (listagem)

- Endpoint: `GET /api/artigos`
- Protegido por JWT
- Query params: `pagina`, `tamanho`, `busca`, `tag`
- Retorno: `{ itens, pagina, tamanho, total }`

## Artigos (detalhe)

- Endpoint: `GET /api/artigos/:id`
- Protegido por JWT
- Retorna: artigo completo + autor + tags (com indicação de principal)

## Artigos (criação)

- Endpoint: `POST /api/artigos`
- Protegido por JWT
- Body: `{ titulo, conteudo, imagemUrl?, tags: string[], tagPrincipal? }`
- Retorna: `{ id }`

## Persistência no SQLite (sql.js)

Como o acesso ao SQLite é feito via `sql.js` (WASM), operações de escrita (criar/editar/excluir) precisam exportar e salvar o arquivo `.sqlite` após o `COMMIT`.

## Artigos (edição)

- Endpoint: `PUT /api/artigos/:id`
- Protegido por JWT
- Regra: somente o autor do artigo pode editar
- Body: `{ titulo, conteudo, imagemUrl?, tags: string[], tagPrincipal? }`
- Retorna: `{ ok: true }`

## Artigos (exclusão)

- Endpoint: `DELETE /api/artigos/:id`
- Protegido por JWT
- Regra: somente o autor do artigo pode excluir
- Retorna: `{ ok: true }`

## Comentários

- Listagem: `GET /api/artigos/:artigoId/comentarios?pagina=1&tamanho=5`
  - Retorna somente comentários de topo (paginados) e inclui as respostas (1 nível) dentro de cada item.
- Criar comentário: `POST /api/artigos/:artigoId/comentarios`
  - Body: `{ conteudo }`
- Responder (1 nível): `POST /api/artigos/:artigoId/comentarios/:comentarioId/respostas`
  - Body: `{ conteudo }`

Regras:
- Privado (exige JWT).
- Paginação default de 5 comentários de topo por página (ideal para botão “Ver mais”).
- Não permite resposta de resposta (evita árvore infinita).

## Frontend

- Stack: React + Vite + TypeScript + Tailwind + React Router.
- Rotas públicas: `/` (landing) e `/login`.
- Rotas privadas: `/home`, `/artigos/:id`, `/artigos/novo`, `/artigos/:id/editar`.
- `VITE_API_URL` aponta para o backend.

## CORS (desenvolvimento)

- Para o frontend (porta 5173) conseguir chamar a API (porta 3000), o backend libera CORS para uma origem configurável via `CORS_ORIGEM`.
- Padrão local: `http://localhost:5173`.

## Layout (UI)

O frontend usa Tailwind com um conjunto pequeno de cores customizadas para reproduzir o layout:
- `verde`: botões e ações principais
- `verdeClaro`: fundos de inputs/textarea e chips ativos
- títulos usam `font-serif` para aproximar do layout

Componentes base:
- `BarraTopo`: topo com logo e ação de entrar/sair
- `ContainerPagina`: centraliza e controla largura máxima
- `BotaoVerde` e `Chip`: padrões visuais reutilizados
