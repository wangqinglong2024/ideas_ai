FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/types/package.json packages/types/package.json
COPY packages/adapters/package.json packages/adapters/package.json
COPY packages/backend/package.json packages/backend/package.json
COPY packages/db/package.json packages/db/package.json
RUN corepack enable && pnpm install --frozen-lockfile

FROM deps AS build
COPY apps/api apps/api
COPY packages packages
RUN pnpm --filter @zhiyu/api build

FROM node:20-alpine AS runtime
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/packages ./packages
COPY --from=build /app/apps/api/dist ./apps/api/dist
USER app
ENV NODE_ENV=production
EXPOSE 8080
HEALTHCHECK --interval=30s CMD wget -qO- http://localhost:8080/health || exit 1
CMD ["node", "apps/api/dist/server.js"]

FROM deps AS dev
COPY --chown=node:node apps/api apps/api
COPY --chown=node:node packages packages
RUN chown -R node:node /app/apps/api /app/packages
USER node
ENV NODE_ENV=development
EXPOSE 8080
CMD ["pnpm", "--filter", "@zhiyu/api", "dev"]