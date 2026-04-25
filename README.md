# 知语 Zhiyu

Docker-first monorepo foundation for the Zhiyu learning platform.

## Quick Start

All build and test commands are designed to run inside Docker.

```bash
docker compose -f docker-compose.test.yml run --rm --build test
docker compose up --build
```

Local services after `docker compose up --build`:

| Service | URL                          |
| ------- | ---------------------------- |
| App     | http://localhost:5173        |
| Admin   | http://localhost:5174        |
| Web     | http://localhost:5175        |
| Docs    | http://localhost:5176        |
| API     | http://localhost:3000/health |

Missing external credentials never block local verification. Use `.env.example` or `.env.docker.example`; values that are not supplied fall back to local mock adapters.

## Deployment stance

E01 does not require GitHub Actions or any external SaaS account. The pass/fail gate is local Docker:

```bash
docker compose -f docker-compose.test.yml run --rm --build test
```

Services that need real API keys in later epics must keep mock defaults so tests continue without secrets. The current foundation uses generic `DATABASE_URL` and `REDIS_URL` adapters; no database tables are created in E01.
