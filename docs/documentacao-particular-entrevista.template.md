# Documentação particular (entrevista) — TEMPLATE

Este arquivo é um template para você criar sua documentação particular de entrevista.
A versão preenchida deve ficar em `docs/documentacao-particular-entrevista.md` e está no `.gitignore` (não deve ir ao GitHub).

## 1. Resumo do projeto em 30 segundos
- O que é?
- Quem usa?
- Quais problemas resolve?
- Quais principais telas?

## 2. Arquitetura e fluxo (explicação simples)
- Como o frontend conversa com o backend?
- Como o backend acessa o banco?
- Como o JWT é gerado e validado?

## 3. Banco de dados (perguntas comuns)
- Por que SQLite?
- Como você modelou artigos, tags e comentários?
- Como garantiu a regra de “resposta só 1 nível”?

## 4. API (perguntas comuns)
- Quais endpoints existem e por quê?
- Como é paginação e “ver mais comentários”?
- Como é a busca simples?

## 5. Segurança (nível MVP)
- Hash de senha: por quê?
- JWT: por quê?
- Como evitou que alguém edite artigo de outro usuário?

## 6. Frontend (perguntas comuns)
- Como fez rotas privadas?
- Como aplicou Tailwind para seguir o layout?
- Por que não usar uma biblioteca de estado?

## 7. Trade-offs e alternativas (o que você diria na entrevista)
- Por que sem Docker?
- Por que sem ORM?
- O que faria diferente com mais tempo?

## 8. Pontos de melhoria (próximos passos reais)
- Busca full-text
- Testes automatizados
- Deploy
- Observabilidade (logs/métricas)
