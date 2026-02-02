# TechBlog MVP

Projeto full stack (Express + SQLite / React + Tailwind) para desafio técnico.

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
