# TechBlog MVP — Documentação Oficial

## Visão geral

Aplicação full stack de um blog técnico com:
- autenticação via JWT (login com usuário pré-carregado via seed)
- CRUD completo de artigos (listar, detalhar, criar, editar, excluir)
- tags múltiplas por artigo (exibe a tag principal)
- comentários com paginação (5 em 5) e respostas com 1 nível (sem árvore infinita)

O foco é um MVP simples, seguro e compatível com um desafio de nível júnior.

---

## Stack e justificativas

### Backend
- **Node.js + Express + TypeScript**
  - Express é simples, popular e adequado para API REST.
  - TypeScript melhora a segurança do código (tipos) sem adicionar muita complexidade.
- **SQLite**
  - Banco local leve, ideal para desafio e execução sem Docker.
  - Arquivo único de banco facilita setup e demonstração.
- **JWT**
  - Implementa autenticação stateless com baixa complexidade.
  - Compatível com frontend simples e rotas protegidas.

### Frontend
- **Vite + React + TypeScript**
  - Setup rápido, boa DX e comum em desafios.
- **Tailwind CSS**
  - Facilita aproximar o layout do Figma rapidamente com poucas dependências.
- **Fetch API**
  - Evita bibliotecas extras para manter o projeto enxuto.

### Decisões para manter o projeto “mínimo”
- Sem Docker (reduz fricção de instalação).
- Sem Prisma/ORM (para o MVP, SQL simples e repositório enxuto são suficientes).
- Sem tela de criação de usuários (usuários são carregados via seed).

---

## Regras de negócio implementadas

### Autenticação
- Login via e-mail e senha pré-existentes no banco (seed).
- JWT emitido no login.
- Rotas privadas exigem header:
  - `Authorization: Bearer <token>`

### Artigos
- CRUD completo.
- Apenas o **autor** pode **editar** e **excluir**.
- Tags:
  - múltiplas tags por artigo
  - uma tag marcada como **principal**
  - na Home exibimos a **tag principal**
- Busca simples na Home (texto).

### Comentários
- Lista inicial: 5 comentários.
- Botão “Ver mais comentários”: carrega mais 5.
- Respostas: apenas 1 nível (comentário → respostas).

---

## Estrutura de pastas

- `backend/`: API Express + SQLite
  - `src/modulos/`: organização por domínio (autenticação, artigos, comentários)
  - `sql/`: schema e seed
  - `db/`: arquivo do banco (gerado localmente)
- `frontend/`: Vite + React + Tailwind
  - `src/app/`: páginas (landing, login, home, detalhe, criar, editar)
  - `src/componentes/`: componentes reutilizáveis
  - `src/servicos/`: chamadas HTTP e utilitários

---

## Como rodar o projeto

### Pré-requisitos
- Node.js 18+ (recomendado)
- npm

### 1) Backend
```bash
cd backend
npm install
cp .env.example .env
npm run banco:criar
npm run banco:seed
npm run dev
```

O backend sobe, por padrão, em `http://localhost:3000`.

### 2) Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Configure o arquivo `frontend/.env`:
```env
VITE_API_URL=http://localhost:3000
```

---

## Endpoints (resumo)

> Observação: os nomes exatos das rotas podem variar conforme o arquivo de rotas, mas o padrão do projeto segue esta estrutura.

### Health
- `GET /health` → `{ ok: true }`

### Autenticação
- `POST /auth/login`
  - body: `{ "email": "...", "senha": "..." }`
  - response: `{ "token": "...", "usuario": { ... } }`

### Artigos
- `GET /artigos?pagina=1&tamanho=10&busca=...&tag=...`
- `GET /artigos/:id`
- `POST /artigos` (privado)
- `PUT /artigos/:id` (privado, apenas autor)
- `DELETE /artigos/:id` (privado, apenas autor)

### Comentários
- `GET /artigos/:id/comentarios?pagina=1&tamanho=5`
- `POST /artigos/:id/comentarios` (privado)
- `POST /artigos/:id/comentarios/:comentarioId/respostas` (privado)

---

## Padronização de erros

- Erros de validação retornam mensagens simples e status apropriado.
- Rotas privadas retornam 401 se token ausente/inválido.
- Permissões (autor) retornam 403 quando aplicável.

---

## Limitações intencionais (MVP)

- Sem refresh token (token simples).
- Sem cadastro/gestão de usuários no frontend.
- Busca simples (sem ranking avançado).
- Comentários com 1 nível de resposta.
- SQLite local (sem deploy em produção).

---

## Melhorias possíveis

- Garantir por constraint no banco que apenas 1 tag seja principal por artigo.
- Testes automatizados.
- Paginação e busca com melhor UX.
- Melhor tratamento de erros no frontend.
- Deploy com Docker ou CI/CD.
