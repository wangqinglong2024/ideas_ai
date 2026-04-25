FROM node:20-bookworm-slim AS workspace

WORKDIR /workspace
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
ENV TURBO_TELEMETRY_DISABLED=1

RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

COPY package.json pnpm-workspace.yaml turbo.json tsconfig.base.json vitest.config.ts .npmrc ./
COPY eslint.config.mjs .prettierrc.json .prettierignore ./
COPY apps ./apps
COPY packages ./packages
COPY scripts ./scripts

RUN pnpm install --lockfile=false

COPY README.md CONTRIBUTING.md .env.example .env.docker.example ./
COPY content ./content
COPY docs ./docs
COPY planning ./planning

FROM workspace AS verify
CMD ["pnpm", "verify"]

FROM workspace AS build
RUN pnpm build

FROM node:20-bookworm-slim AS runtime

WORKDIR /workspace
ENV NODE_ENV=production
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
ENV TURBO_TELEMETRY_DISABLED=1

RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

COPY --from=build /workspace /workspace

EXPOSE 3000
CMD ["node", "apps/api/dist/server.js"]