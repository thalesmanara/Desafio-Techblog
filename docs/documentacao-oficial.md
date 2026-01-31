# Documentação oficial do projeto (MVP)

## 1. Visão geral

Este projeto implementa um MVP de uma plataforma interna para compartilhamento de artigos.
Usuários autenticados podem acessar a lista de artigos, pesquisar, filtrar por tags, ler detalhes, publicar novos artigos, editar/excluir artigos próprios e comentar em artigos.

O objetivo é atender ao desafio técnico com foco em simplicidade, clareza e boas práticas, evitando complexidade desnecessária.

## 2. Escopo do MVP

### 2.1. Funcionalidades

**Autenticação**
- Login com e-mail e senha (JWT).
- Não existe tela de cadastro: os usuários são pré-carregados via seed.

**Artigos**
- Listagem paginada de artigos (home privada).
- Busca simples (título e conteúdo).
- Filtro por tag.
- Detalhe do artigo.
- Criar, editar e excluir artigo (somente o autor pode editar/excluir).

**Tags**
- O artigo pode ter múltiplas tags.
- A interface exibe uma tag principal (a primeira tag do artigo).
- A lista de tags exibida como “pílulas” na interface é fixa (definida no frontend, conforme layout).

**Comentários**
- Criar comentário em artigo.
- Listar comentários em lotes de 5 (botão “Ver mais comentários” carrega mais 5).
- Respostas com 1 nível: um comentário pode responder outro comentário, mas não existe árvore infinita.

### 2.2. Fora do escopo (para manter o projeto enxuto)
- Cadastro, recuperação de senha e gestão avançada de usuários.
- Perfis, papéis (roles) e permissões complexas.
- Busca avançada (full-text), ranking e sugestões.
- Upload de arquivos (imagem é URL).
- Notificações, curtidas, compartilhamentos.
- Docker e infraestrutura de produção.

## 3. Layout (UI/UX)

A interface deve seguir o layout fornecido (desktop e mobile) o mais fielmente possível.
Foi adotado Tailwind CSS no frontend para agilizar a aderência visual com menos CSS manual.

## 4. Tecnologias e justificativas

### 4.1. Backend
- **Node.js + TypeScript + Express**
  - Express é direto e amplamente usado em projetos júnior/pleno.
  - TypeScript melhora legibilidade e reduz erros comuns.

- **JWT para autenticação**
  - Implementação simples e suficiente para o cenário de login e rotas privadas.

### 4.2. Banco de dados
- **SQLite (arquivo local)**
  - Reduz dependências externas e facilita execução local do projeto.
  - Atende ao requisito de banco relacional no contexto do desafio.
  - Ideal para MVP e avaliação rápida.

- **Acesso ao banco com SQL simples**
  - Evita camadas adicionais (ORM) para manter o projeto pequeno e transparente.
  - Facilita explicar consultas e relacionamentos em entrevista.

### 4.3. Frontend
- **React + Vite + TypeScript**
  - Setup rápido e comum em desafios técnicos.
- **Tailwind CSS**
  - Ajuda a reproduzir o layout com rapidez e consistência (desktop e mobile).

## 5. Decisões de implementação

### 5.1. Home privada
A home e todas as telas principais (lista, detalhe, criar/editar) são acessíveis somente com token válido.
Isso simplifica regras de acesso e segue o comportamento esperado para “plataforma interna”.

### 5.2. Tags fixas no frontend
A lista de tags exibida na interface é fixa para reduzir complexidade e seguir o layout.
No backend, as tags continuam existindo no banco para relacionamento com artigos e para filtro.

### 5.3. Comentários com 1 nível de resposta
Para limitar complexidade (principalmente no banco e na UI), respostas são permitidas somente para comentários de nível raiz.

### 5.4. Nomes em português
O código utiliza nomes em português sempre que possível (funções, variáveis, módulos e componentes), priorizando clareza.

## 6. Organização do código

A organização é modular por domínio, mantendo um padrão simples:

- **Backend**: módulos por responsabilidade (autenticação, artigos, comentários, usuários), middlewares e acesso ao banco.
- **Frontend**: páginas, componentes reutilizáveis, serviços de API e rotas protegidas.

## 7. Carga inicial (seed)

O banco é populado a partir do JSON fornecido no desafio.
O seed deve:
- Criar usuários únicos a partir do campo `author`.
- Criar artigos usando o `id` do JSON.
- Criar tags a partir de `tag1`, `tag2`, `tag3` (ignorando valores vazios).
- Relacionar artigos e tags, marcando como “principal” a primeira tag do artigo.

## 8. Segurança e validações (nível MVP)
- Senhas armazenadas com hash.
- Token JWT obrigatório em rotas privadas.
- Regras básicas de autorização:
  - somente o autor pode editar/excluir artigo.
- Validações mínimas de entrada (campos obrigatórios e tamanhos razoáveis).

