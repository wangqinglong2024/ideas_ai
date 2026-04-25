# Story 1.6: Render API + Worker 部署

Status: ready-for-dev

## Story

As a 开发者,
I want API 与 Worker 服务以容器化方式部署到 Render（Singapore region），并支持 blue-green 发布与健康检查,
so that 服务变更安全可回滚，第三方监控可探测可用性。

## Acceptance Criteria

1. `apps/api/Dockerfile` 与 `apps/worker/Dockerfile`：多阶段构建（builder + runtime），最终镜像基于 `node:20-alpine`，运行时镜像 ≤ 200MB。
2. Render 创建 2 个 services：`zhiyu-api`（Web Service）+ `zhiyu-worker`（Background Worker），均部署在 Singapore region，启动 plan = `Standard`。
3. 健康检查端点：`GET /health`（liveness，即使 DB down 也返 200）、`GET /ready`（readiness，DB+Redis 全通才返 200），与 Render Health Check Path 绑定。
4. 环境变量从 Doppler 注入（依赖 1.7），不允许在 Render 控制台手填业务密钥。
5. Blue-green：使用 Render `Preview Environments` + `Pre-deploy command` 跑 migration；切流前必须等 readiness 通过。
6. 自动部署：`main` push 触发 staging；`v*` tag 触发 production（手动 promote）。
7. 部署失败自动回滚至上一版本（Render 默认行为，文档中明示）。
8. 资源限制：`apps/api` 1 vCPU / 2GB，2 副本；`apps/worker` 1 vCPU / 1GB，2 副本。
9. 日志结构化 JSON（详见 1.9 / 19.1），带 `service` `env` `version` 字段。
10. 提供 `tools/render-rollback.sh` 与 runbook（`docs/runbooks/render.md`）。

## Tasks / Subtasks

- [ ] Task 1: Dockerfile（AC: #1）
  - [ ] `apps/api/Dockerfile` 多阶段：deps → builder → runner
  - [ ] `apps/worker/Dockerfile` 同结构
  - [ ] `.dockerignore`
- [ ] Task 2: Render services（AC: #2, #4, #6, #8）
  - [ ] dashboard 创建 2 services（或用 `render.yaml` blueprint）
  - [ ] 接 Doppler integration
  - [ ] 设置 plan + 副本数
- [ ] Task 3: 健康检查（AC: #3）
  - [ ] `apps/api` 实现 `/health` `/ready`，readiness 检查 DB ping + Redis ping + 第三方关键依赖
  - [ ] worker 实现内部 HTTP server 暴露 `/health`（Render web service 行为模拟，或用 render http monitoring）
- [ ] Task 4: Blue-green + migration（AC: #5）
  - [ ] `pre-deploy` 调 `pnpm db:migrate`（依赖 1.10）
  - [ ] readiness 必须 200 才切流
- [ ] Task 5: 自动回滚 + runbook（AC: #7, #10）
- [ ] Task 6: 验收（AC: 所有）
  - [ ] staging 环境推送测试，验证健康检查与回滚

## Dev Notes

### 决策记录
- 不使用 Fly.io 备选（保留 v1.5 评估）
- Worker Render 类型为 Background Worker（无 HTTP 端口），健康用 Render 自带 process check + 内部 metrics
- migration 在 `pre-deploy` 阶段，幂等设计

### 风险
- migration 在并发部署中可能竞态 → migration 内部加 advisory lock
- Render Singapore 故障 → 文档化降级到 Tokyo region 步骤

### References

- [Source: planning/epics/01-platform-foundation.md#ZY-01-06](../../epics/01-platform-foundation.md)
- [Source: planning/spec/08-deployment.md#§-5](../../spec/08-deployment.md)
- [Source: planning/spec/04-backend.md](../../spec/04-backend.md)
- [Source: planning/sprint/01-platform-foundation.md#W3](../../sprint/01-platform-foundation.md)

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
