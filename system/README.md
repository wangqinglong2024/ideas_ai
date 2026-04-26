# Zhiyu (知语) Monorepo

**Single environment: `dev` only.** All code lives under `system/`. Run everything via Docker on `115.159.109.23`.

## Layout

```
system/
├── apps/
│   ├── web         # C-side PWA (Vite + React)
│   ├── api         # C-side BE (Fastify)
│   ├── admin       # B-side admin PWA (Vite + React)
│   ├── admin-api   # B-side admin BE (Fastify)
│   └── worker      # BullMQ consumer
├── packages/
│   ├── config      # eslint / prettier / tsconfig / zod env loader
│   ├── sdk         # Supabase wrapper + adapters (email/sms/llm/...)
│   ├── ui          # placeholder UI lib
│   ├── i18n        # placeholder i18n
│   └── db          # drizzle schema + migrations + seed
└── docker/
    ├── docker-compose.yml
    ├── .env.example
    └── Dockerfile.{web,admin,api,admin-api,worker}
```

## Quickstart

```bash
cd /opt/projects/zhiyu/system
cp docker/.env.example docker/.env       # fill in real values; ok to leave optional ones blank
cd docker && docker compose up -d --build
```

External endpoints (server: `115.159.109.23`):

| Role        | URL                                  |
|-------------|--------------------------------------|
| App FE      | `http://115.159.109.23:3100`         |
| App BE      | `http://115.159.109.23:8100`         |
| Admin FE    | `http://115.159.109.23:4100`         |
| Admin BE    | `http://115.159.109.23:9100`         |

## Local hooks

After `pnpm install`, husky auto-installs a `pre-commit` hook running prettier on staged files.

## Rules

- See `planning/00-rules.md` (project root) for the binding constraints.
- Docker-only. No GitHub Actions / Cloudflare / Render / Doppler / Sentry / PostHog / Better Stack / Dify.
- Missing optional API keys → mock adapters; never block startup.
