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
