FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps/worker/package.json apps/worker/package.json
COPY packages/types/package.json packages/types/package.json
COPY packages/adapters/package.json packages/adapters/package.json
COPY packages/backend/package.json packages/backend/package.json
COPY packages/db/package.json packages/db/package.json
RUN corepack enable && pnpm install --frozen-lockfile

FROM deps AS build
COPY apps/worker apps/worker
COPY packages packages
RUN pnpm --filter @zhiyu/worker build

FROM node:20-alpine AS runtime
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/worker/node_modules ./apps/worker/node_modules
COPY --from=deps /app/packages ./packages
COPY --from=build /app/apps/worker/dist ./apps/worker/dist
USER app
ENV NODE_ENV=production
CMD ["node", "apps/worker/dist/worker.js"]

FROM deps AS dev
COPY --chown=node:node apps/worker apps/worker
COPY --chown=node:node packages packages
RUN chown -R node:node /app/apps/worker /app/packages
USER node
ENV NODE_ENV=development
CMD ["pnpm", "--filter", "@zhiyu/worker", "dev"]