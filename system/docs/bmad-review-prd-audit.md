# BMAD Review And PRD Coverage Audit

日期：2026-04-27

范围：`planning/task/01-foundation-platform`、`planning/task/02-ux-design-system`、`planning/task/03-user-account`、`planning/task/13-admin` 到 `system` 当前实现。

口径：本审计只把 Docker 本地可验证的 dev-only 实现记为已实现。凡依赖真实 Postgres/RLS、真实 Supabase、真实第三方 OTP/TOTP/OAuth、真实异步导出或自动化无障碍报告但当前仍为 fake/in-memory/seed 的项目，均标记为“部分”。

## 验证证据

| 验证项 | 结果 |
| --- | --- |
| Docker-only `pnpm typecheck && pnpm test && pnpm build && pnpm preflight` | 通过，12 tasks successful，preflight `status: ok` |
| `docker compose -f docker/docker-compose.yml config` | 通过 |
| Compose 容器健康状态 | `zhiyu-app-be`、`zhiyu-admin-be`、`zhiyu-app-fe`、`zhiyu-admin-fe`、`zhiyu-worker`、`zhiyu-redis` 全部 healthy |
| Host health endpoints | `8100/health`、`9100/health`、`8100/ready`、`9100/ready`、`3100/healthz`、`4100/healthz` 通过 |
| Container healthcheck commands | API `127.0.0.1:8080/ready`、FE `127.0.0.1/healthz` 通过 |
| Docker API smoke | `{"status":"ok","checks":["health_ready_ok","app_api_ok","admin_api_ok","viewer_rbac_ok"]}` |
| MCP Browser screenshots | App 与 Admin 页面已逐页 smoke，发现并修复课程溢出、文章无效 slug、Badge/DataTable、Profile Toast、Admin 窄屏顶栏等问题 |

## BMAD Code Review Triage

| 分类 | 结论 |
| --- | --- |
| 已修复 | `.pnpm-store` 交付污染、临时 smoke 文件、rate-limit envelope、统一错误 handler、CORS allowlist、CSP、metrics header 信任、JWT payload 校验、refresh token 语义、deleted/suspended user 访问、OTP purpose/attempts、password 长度、data export 月窗口/过期、文章授权、Admin 登录限流/锁定、Admin 读接口 RBAC、coin/flag 校验、static/PWA fallback、migration fake 吞错、Compose healthcheck |
| 保留为 PRD 差距 | 真实 Postgres/RLS 未接入运行时、`/ready` 仍是配置级检查、OTP/TOTP/OAuth 是 dev-only、Admin 审计不是全局中间件、Admin 导出是同步 seed URL、Admin 搜索/筛选/分页多为前端/seed 行为、UX 缺 axe/Lighthouse 自动报告 |
| 不采纳/噪声 | Docker workspace 包解析风险在当前 `target: dev` compose 下已由实际 build/up/smoke 覆盖，但生产 runtime target 仍需单独审计 |

## PRD 覆盖矩阵

状态含义：已实现 = 本地 Docker/dev-only 口径可验证；部分 = 有实现但仍缺生产级持久化、真实外部服务、自动化质量门禁或完整业务闭环。

| 模块 | 已实现 | 部分/差距 |
| --- | --- | --- |
| FP | FP-01, FP-02, FP-03, FP-04, FP-05, FP-06, FP-07, FP-08, FP-09, FP-10, FP-11, FP-14, FP-15, FP-17, FP-18, FP-19, FP-20, FP-21, FP-22, FP-23, FP-24, FP-25, FP-26, FP-27, FP-31, FP-32, FP-33 | FP-12, FP-13, FP-16, FP-28, FP-29, FP-30, FP-34 |
| UX | UX-01, UX-02, UX-03, UX-04, UX-05, UX-06, UX-08, UX-10, UX-11, UX-12, UX-13, UX-14, UX-15, UX-16, UX-17, UX-18, UX-19, UX-21, UX-23, UX-25, UX-26 | UX-07, UX-09, UX-20, UX-22, UX-24 |
| UA | UA-02, UA-07, UA-08, UA-14, UA-15, UA-16, UA-19, UA-20 | UA-01, UA-03, UA-04, UA-05, UA-06, UA-09, UA-10, UA-11, UA-12, UA-13, UA-17, UA-18 |
| AD | AD-02, AD-08, AD-10, AD-14, AD-18, AD-19 | AD-01, AD-03, AD-04, AD-05, AD-06, AD-07, AD-09, AD-11, AD-12, AD-13, AD-15, AD-16, AD-17, AD-20 |

## 主要差距明细

| PRD | 当前状态 | 差距 |
| --- | --- | --- |
| FP-12, UA-01, AD-01 | 有 SQL migration、seed、env 与 fake fallback | 运行时业务数据仍写 in-memory state，未实际走 Postgres/RLS |
| FP-13, FP-28 | Redis service healthy，worker fake smoke 通过，`/ready` 返回 configured | `/ready` 未执行真实 DB/Redis/Supabase ping；队列不是持久任务队列 |
| FP-16 | migration runner 和 SQL 文件存在 | compose dev 默认 fake，未证明迁移已应用到真实数据库 |
| UX-09, UX-20, UX-22, UX-24 | 有 token tests、i18n tests、browser screenshots、Docker regression | 缺 Storybook/组件 stories、axe、Lighthouse、自动性能预算报告；Admin bundle 有 chunk warning |
| UA-03, UA-04, UA-06, UA-17 | OAuth/OTP/reset/JWT/cookie dev flow 可用 | OAuth、OTP、reset token、cookie secure 策略仍是 dev-only；验证码/TOTP 固定值不能按生产验收 |
| UA-09, UA-11, UA-12, UA-18 | session/export/delete/coin flow 可用 | 会话、导出、销户恢复期、知语币均为内存状态，缺真实账本和恢复期作业 |
| AD-03, AD-05, AD-07, AD-15, AD-16 | Admin 登录、RBAC、用户管理、coin、audit、export API 可 smoke | TOTP 固定值；用户/coin/audit/export 不是持久化完整后台；审计不是全链路自动中间件 |
| AD-04, AD-06, AD-11, AD-12, AD-13, AD-17, AD-20 | 管理端页面/API 有 seed 数据与操作入口 | KPI、订单、审校、客服、分销、公告、安全合规多为 seed/placeholder，非完整生产工作流 |

## 文件修改来源映射

| 文件范围 | 对应 PRD 需求 |
| --- | --- |
| Root workspace: `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `tsconfig.base.json`, `README.md` | FP-01, FP-02, FP-17, FP-31, FP-34 |
| Docker: `.dockerignore`, `.gitignore`, `docker/docker-compose.yml`, `docker/.env.example`, app/admin/api/worker Dockerfiles | FP-08, FP-09, FP-10, FP-11, FP-28, FP-31, FP-34 |
| Backend runtime: `packages/backend/src/runtime/*` | FP-14, FP-15, FP-27, FP-28, FP-29, UA-15, UA-16, UA-17, AD-02, AD-19 |
| App API: `packages/backend/src/modules/app-api.ts`, `apps/api/src/server.ts` | FP-04, FP-15, FP-30, UA-02 至 UA-20 |
| Admin API: `packages/backend/src/modules/admin-api.ts`, `apps/admin-api/src/server.ts` | FP-06, FP-15, AD-02 至 AD-20 |
| Worker/adapters: `apps/worker/*`, `packages/backend/src/modules/worker.ts`, `packages/adapters/*` | FP-07, FP-13, FP-18 至 FP-26 |
| Database: `packages/db/*`, `scripts/backup-postgres.sh` | FP-12, FP-16, FP-32, UA-01, UA-20, AD-01 |
| Shared packages: `packages/types`, `packages/sdk`, `packages/i18n`, `packages/ui` | FP-17, UX-01 至 UX-10, UX-20, UX-21, UX-25, UA-19 |
| App frontend: `apps/web/*` | FP-03, UX-03 至 UX-17, UX-21, UX-23, UX-26, UA-02 至 UA-19, FP-30 |
| Admin frontend: `apps/admin/*` | FP-05, UX-18, UX-19, UX-20, UX-24, AD-04 至 AD-20 |
| Tests and gates: `packages/*/tests`, `scripts/preflight.mjs`, `docs/w0-release-gate-dev-only.md`, this audit | FP-31, FP-33, FP-34, UX-09, UX-24, UA-15, AD-19 |

## 结论

当前交付已满足本地 Docker dev-only 的骨架、App/Admin 前后端入口、基础 UX、账号关键流、Admin 关键流、BMAD 后安全补丁和 smoke 验证。不能宣称完整生产级 PRD 完成；真实持久化/RLS、真实第三方服务、自动化质量门禁和若干后台生产工作流仍是后续必须补齐的差距。