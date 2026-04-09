# 🏋️ Gym Personal Trainer — API Backend

API RESTful para uma plataforma de personal trainer com geração de planos de treino via IA, autenticação segura e acompanhamento de sessões e estatísticas de evolução.

> ⚠️ Este repositório contém apenas o **backend**. O frontend está em desenvolvimento separado.

---

## 📋 Visão Geral

O **Gym Personal Trainer** é uma API que permite a personal trainers e alunos gerenciarem planos de treino de forma inteligente. A IA (Google Gemini / OpenAI) gera planos personalizados com base nos dados do usuário, enquanto o sistema registra sessões, acompanha progresso e exibe estatísticas de evolução.

---

## ✨ Funcionalidades

- Autenticação segura com **Better Auth** (sessão, JWT, OAuth ready)
- Geração de planos de treino personalizados via **IA** (Google Gemini e OpenAI)
- CRUD de planos de treino com dias e exercícios
- Registro e atualização de sessões de treino
- Dashboard com dados da home e estatísticas de progresso
- Gerenciamento de dados de treino do usuário (perfil físico)
- Documentação interativa da API com **Scalar** (`/reference`)
- Schema Swagger gerado automaticamente via **@fastify/swagger**
- Suporte a Docker para ambiente de desenvolvimento

---

## 🛠️ Stack Técnica

| Camada | Tecnologias |
|---|---|
| **Runtime** | Node.js 24 |
| **Framework** | Fastify 5 |
| **Linguagem** | TypeScript |
| **ORM** | Prisma 7 + PostgreSQL (adapter pg) |
| **IA** | Vercel AI SDK, Google Gemini, OpenAI |
| **Autenticação** | Better Auth |
| **Validação** | Zod + fastify-type-provider-zod |
| **Docs** | Swagger + Scalar API Reference |
| **Logs** | Pino + pino-pretty |
| **Datas** | Day.js |

---

## 🚀 Como rodar localmente

### Pré-requisitos

- Node.js 24
- pnpm
- PostgreSQL rodando localmente ou via Docker

### 1. Clone o repositório

```bash
git clone https://github.com/JoaoFabris/gym-personal-trainer.git
cd gym-personal-trainer
```

### 2. Instale as dependências

```bash
pnpm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/gym_trainer"

BETTER_AUTH_SECRET="seu_secret_aqui"
BETTER_AUTH_URL="http://localhost:3000"

GOOGLE_GENERATIVE_AI_API_KEY="sua_chave_google"
OPENAI_API_KEY="sua_chave_openai"
```

### 4. Suba o banco com Docker (opcional)

```bash
docker-compose up -d
```

### 5. Execute as migrations

```bash
npx prisma migrate dev
```

### 6. Inicie o servidor de desenvolvimento

```bash
pnpm dev
```

O servidor estará disponível em `http://localhost:3000`.

A documentação interativa da API estará em `http://localhost:3000/reference`.

---

## 🗂️ Estrutura do Projeto

```
src/
├── index.ts              # Entrypoint — inicializa o Fastify
├── lib/
│   ├── auth.ts           # Configuração do Better Auth
│   ├── db.ts             # Instância do Prisma
│   └── env.ts            # Validação das variáveis de ambiente
├── routes/
│   ├── ai.ts             # Rota de geração de treino via IA
│   ├── home.ts           # Dados da home/dashboard
│   ├── me.ts             # Dados do usuário autenticado
│   ├── stats.ts          # Estatísticas de evolução
│   └── workout-plan.ts   # CRUD de planos de treino
├── schemas/
│   └── index.ts          # Schemas Zod compartilhados
└── usecases/
    ├── CreateWorkoutPlan.ts
    ├── GetHomeData.ts
    ├── GetStats.ts
    ├── GetUserTrainData.ts
    ├── GetWorkoutDay.ts
    ├── GetWorkoutPlan.ts
    ├── ListWorkoutPlans.ts
    ├── StartWorkoutSession.ts
    ├── UpdateWorkoutSession.ts
    └── UpsertUserTrainData.ts

prisma/
├── schema.prisma         # Modelagem: User, WorkoutPlan, WorkoutDay,
│                         #            WorkoutExercise, WorkoutSession
└── migrations/

docs/
└── API_PROMPT.md         # Documentação de contexto para a IA
```

---

## 🤖 Geração de Treino com IA

A rota `/ai` recebe os dados do usuário (objetivo, nível, disponibilidade) e utiliza o Vercel AI SDK para invocar o modelo configurado (Google Gemini ou OpenAI) e retornar um plano de treino estruturado, pronto para ser salvo no banco.

---

## 📦 Scripts disponíveis

| Comando | Descrição |
|---|---|
| `pnpm dev` | Inicia o servidor com hot reload |
| `pnpm build` | Gera o Prisma Client e compila o TypeScript |
| `npx prisma migrate dev` | Executa as migrations |
| `npx prisma studio` | Abre o Prisma Studio (GUI do banco) |

---

## 🐳 Docker

O projeto inclui `Dockerfile` e `docker-compose.yml` para facilitar o setup do banco em desenvolvimento:

```bash
docker-compose up -d
```

---

Desenvolvido por [João Fabris](https://github.com/JoaoFabris) 🚀