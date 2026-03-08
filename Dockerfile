# Usa a imagem oficial do Node.js versão 24 baseada em Debian slim
# "AS base" cria um stage chamado base para reutilizar depois
FROM node:24-slim AS base

# Define onde o pnpm será instalado dentro do container
ENV PNPM_HOME="/pnpm"

# Adiciona o pnpm ao PATH do sistema para poder executá-lo em qualquer lugar
ENV PATH="$PNPM_HOME:$PATH"

# Ativa o corepack (gerenciador de gerenciadores de pacote do Node)
# e prepara a versão específica do pnpm para uso
RUN corepack enable && corepack prepare pnpm@10.30.0 --activate

# Define o diretório de trabalho dentro do container
# Todos os comandos seguintes serão executados dentro de /app
WORKDIR /app

# Copia apenas o package.json e o lockfile para dentro do container
# Isso permite cache de dependências no Docker build
COPY package.json pnpm-lock.yaml ./

# Copia a pasta do Prisma para dentro do container
# Isso é necessário porque o prisma gera client baseado no schema
COPY prisma ./prisma/


# -------- Dependencies --------

# Cria um novo stage chamado deps baseado no stage base
FROM base AS deps

# Instala todas as dependências do projeto
# --frozen-lockfile garante que o lockfile não seja modificado
RUN pnpm install --frozen-lockfile


# -------- Build --------

# Cria um stage de build baseado no stage de dependências
FROM deps AS build

# Copia todo o restante do código do projeto
COPY . .

# Executa o build do projeto (normalmente compila TypeScript → JavaScript)
# Depois copia o código gerado do Prisma para dentro da pasta dist
RUN pnpm run build && cp -r src/generated dist/generated


# -------- Production --------

# Cria o stage final de produção baseado novamente no base
FROM base AS production

# Instala apenas dependências de produção
# --prod remove dependências de desenvolvimento
# --ignore-scripts evita rodar scripts desnecessários
RUN pnpm install --frozen-lockfile --prod --ignore-scripts

# Copia apenas o código compilado do stage de build
# Isso evita incluir arquivos desnecessários no container final
COPY --from=build /app/dist ./dist

# Define o comando que será executado quando o container iniciar
# Inicia o servidor Node usando o código compilado
CMD ["node", "dist/index.js"]