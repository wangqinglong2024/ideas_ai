# 知语 Zhiyu · E01 平台基础与 DevOps · Retrospective

- 日期: 2026-04-26
- 范围: ZY-01-01 ~ ZY-01-06
- 交付物: `/opt/projects/zhiyu/system/`（monorepo + Docker 一键开发环境）
- 主机: `115.159.109.23`，复用既有 `supabase-*` 与 nginx，附加 `zhiyu-*` 容器栈

## 1. 验收结果（全部通过）

| Story | 验收命令 | 结果 |
| - | - | - |
| ZY-01-01 | `pnpm -r typecheck` | 10 个 workspace 全绿 |
| ZY-01-02 | `husky` + `lint-staged` 配置存在；prettier/eslint 共享 | OK |
| ZY-01-03 | `docker compose up -d --build` + `bash scripts/smoke.sh` | 6/6 容器 healthy，4 端口 200 |
| ZY-01-04 | (a) 删除 `RESEND_API_KEY` → 启动日志输出 `[zhiyu/adapter] email -> fake`；(b) 清空 `JWT_SECRET` → 启动失败 `Invalid environment configuration` | 双向均符合预期 |
| ZY-01-05 | `curl /api/v1/_db/check` → `{schema:"zhiyu", _meta_rows:1, supabase_kong_ok:true}`；`zhiyu._meta` 与 `zhiyu.error_events` 已建表；幂等 migration 第二次执行打印 `skip` | OK |
| ZY-01-06 | `/health` `/ready` `/metrics`(私网放行) `/api/v1/_telemetry/error` POST → `error_events` 行数 +1；BullMQ Worker `noop` 心跳运行 | OK |

> 网络拓扑：`zhiyu-app-be / admin-be / worker` 同时接入 `gateway_net + supabase_default + zhiyu-internal`；`zhiyu-app-fe / admin-fe` 仅在 `gateway_net`；`zhiyu-redis` 仅在 `zhiyu-internal`（不再外露 6379）。

## 2. 走得顺 / 走得不顺

走得顺：
- pnpm + Turborepo + 共享 `tsconfig.base` 让 typecheck 一次性通过 10 个包。
- `loadEnv()` 一处校验 + `deriveAdapterFlags()` 启动时打印 fake/real，DX 与"密钥缺失要求 mock"两个约束同时满足。
- 复用既有 `supabase-db`，无需自部署 Postgres，省去备份/磁盘规划。

走得不顺（已修复）：
- BusyBox `wget localhost` 优先走 IPv6，导致 nginx 容器 healthcheck 假阴；统一改 `127.0.0.1`。
- pnpm workspace 包采用 `main: ./src/index.ts`，runtime 直接 `node dist/index.js` 找不到入口；改为 `tsx src/index.ts` 在容器内直接运行 TS（保留 build 仅用于 typecheck 校验）。
- Fastify v4 strict 类型与 pino 实例不兼容：`logger: pinoInstance as unknown as boolean` 兜底，行为不变。
- backend 容器无法解析 `supabase-db`：把 `supabase_default` 加为 external network 并附加到 3 个 backend 服务即可。

## 3. 偏离 PRD 的有意约定

- E01 不绑任何外部 SaaS（Cloudflare/Render/Doppler/Sentry/PostHog/Better Stack）。所有 10 个适配器（email/sms/push/payment/captcha/llm/tts/asr/workflow/webSearch）默认走 fake，启动日志显式标记。
- pre-push、CI 工作流均未配置（按用户策略禁用 GitHub Actions）。
- 备份方案：宿主 cron `/etc/cron.d/zhiyu-backup` 每日 03:17 调 `scripts/backup.sh`，`pg_dump -n zhiyu -Fc` 写入 `/opt/backups/zhiyu/<ts>/` 并 prune 30 天；首跑已生成 `20260426T053203Z/zhiyu.dump`。

## 4. 遗留 / 后续 epic 需注意

1. `zhiyu` schema 还未在 PostgREST 中暴露（`PGRST_DB_SCHEMAS` 只含默认）。前端 anon-key `client.schema('zhiyu').from('_meta')` 当前会返回 schema-not-exposed 错误；E03 前需在 Supabase 配置追加 `zhiyu` 并重启 Kong/PostgREST。
2. `request.routerPath` 已在 Fastify 5 中废弃；当前埋点采用 `routerPath ?? url`，迁移 v5 时换 `req.routeOptions.url`。
3. 还未接入 SBOM/OSV-scan，留到 E18（安全）。
4. Redis 内部 only，bullmq 仅 `noop` 队列；E07 学习引擎落地真实队列时记得加 `concurrency` 与 metrics counter 的 label 维度治理。
5. Vite 构建时 `VITE_SUPABASE_URL` 走 build-arg 注入，迁机器时记得改 `docker/.env` 里的 `115.159.109.23` 与重建 `zhiyu-app-fe / admin-fe`。

## 5. 度量

- 容器: 6/6 healthy
- 镜像数: 5（app-be/admin-be/worker/app-fe/admin-fe），全部 multi-stage、runtime 非 root（FE 除外，nginx 进程模型）
- 代码量: `system/` 约 1.8k LoC，单文件 ≤ 800 行
- 验收时延: `/ready` 端到端 ≈ 130ms（DB 21ms + Redis 1ms + Kong 112ms）

## 6. Action Items

- [ ] (E03 启动前) 在 supabase `.env` 追加 `PGRST_DB_SCHEMAS=public,storage,graphql_public,zhiyu` 并 `docker compose restart kong rest`
- [ ] (E18) 接入本地化 SBOM (`syft`) + `osv-scanner` 到 backup cron 同级别
- [ ] (E19) 把 `prom-client` registry 暴露到 Prometheus scrape；当前 `/metrics` 私网放行已就绪
- [ ] (E20 上线前) 把 `ALLOW_METRICS=false` 默认值改为环境化决策、把 `GIT_SHA` 在 build 时注入 `ENV` label
