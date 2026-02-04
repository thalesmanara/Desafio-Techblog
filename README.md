# TechBlog MVP

Aplicação full stack de um blog técnico com:
- autenticação via JWT (login com usuário pré-carregado via seed)
- CRUD completo de artigos (listar, detalhar, criar, editar, excluir)
- tags múltiplas por artigo (exibe a tag principal)
- comentários com paginação (5 em 5) e respostas com 1 nível (sem árvore infinita)

O foco é um MVP simples, seguro e compatível com o desafio proposto

## Como rodar

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run banco:criar
npm run banco:seed
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Arquivo `frontend/.env`:
```env
VITE_API_URL=http://localhost:3000
```

## Documentação
- `docs/documentacao-oficial.md`
