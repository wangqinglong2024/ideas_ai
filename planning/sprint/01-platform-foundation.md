# Sprint S01 · 平台基础设施（Platform Foundation）

> Epic：[E01](../epics/01-platform-foundation.md) · 阶段：M0 · 周期：W1-W4（4 周） · 优先级：P0
> Story 数：12 · 估算合计：~M-L 12 ≈ 30 person-days
> 状态文件：[sprint-status.yaml](./sprint-status.yaml#epic-1)
> Story 文件夹：[planning/story/01-platform-foundation/](../story/01-platform-foundation/)

## Sprint 目标
搭建 monorepo、CI/CD、环境变量、部署管道与基础监控接入，为 E02-E20 全部 epic 提供工程基础。

## 成功度量
- PR 合入即触发 CI 全绿（lint / typecheck / test / build / bundle-size）
- Preview URL 自动评论
- Staging 每日有部署
- Sentry / PostHog / Better Stack 三件套有数据
- `pnpm i && pnpm build` < 5 min

## Story 列表与执行顺序

| 序 | Story Key | 标题 | 估 | 依赖 | 周次 |
|:-:|---|---|:-:|---|:-:|
| 1 | [1-1-init-monorepo](../story/01-platform-foundation/1-1-init-monorepo.md) | 初始化 Monorepo | M | - | W1 |
| 2 | [1-2-typescript-strict-config](../story/01-platform-foundation/1-2-typescript-strict-config.md) | TS 严格配置 | S | 1-1 | W1 |
| 3 | [1-3-eslint-prettier-commitlint](../story/01-platform-foundation/1-3-eslint-prettier-commitlint.md) | Lint/Prettier/Commit | S | 1-1 | W1 |
| 4 | [1-4-github-actions-ci](../story/01-platform-foundation/1-4-github-actions-ci.md) | GitHub Actions CI | M | 1-2,1-3 | W2 |
| 5 | [1-5-cloudflare-pages-deploy](../story/01-platform-foundation/1-5-cloudflare-pages-deploy.md) | CF Pages 部署 4 站 | M | 1-4 | W2 |
| 6 | [1-7-doppler-secrets](../story/01-platform-foundation/1-7-doppler-secrets.md) | Doppler Secrets | S | 1-4 | W2 |
| 7 | [1-10-supabase-init](../story/01-platform-foundation/1-10-supabase-init.md) | Supabase 初始化 | S | 1-7 | W2 |
| 8 | [1-6-render-api-worker-deploy](../story/01-platform-foundation/1-6-render-api-worker-deploy.md) | Render API/Worker | L | 1-5,1-7,1-10 | W3 |
| 9 | [1-11-redis-bullmq-skeleton](../story/01-platform-foundation/1-11-redis-bullmq-skeleton.md) | Redis + BullMQ | M | 1-7 | W3 |
| 10 | [1-8-sentry-integration](../story/01-platform-foundation/1-8-sentry-integration.md) | Sentry FE/BE | M | 1-5,1-6 | W3 |
| 11 | [1-9-posthog-betterstack](../story/01-platform-foundation/1-9-posthog-betterstack.md) | PostHog + Better Stack | M | 1-5,1-6 | W4 |
| 12 | [1-12-storybook-docs-init](../story/01-platform-foundation/1-12-storybook-docs-init.md) | Storybook + Docs 占位 | S | 1-5 | W4 |

## 周次计划

### W1 · 工程地基（5 工作日）
- 1-1：pnpm workspace + turbo.json + 4 apps + 5 packages 占位
- 1-2：tsconfig strict + 路径别名
- 1-3：ESLint + Prettier + husky + commitlint
- **W1 验收**：`pnpm i && pnpm build && pnpm typecheck && pnpm lint` 全绿

### W2 · CI/CD + 环境（5 工作日）
- 1-4：GitHub Actions（PR / main / tag 三条流水线 + Turbo remote cache）
- 1-5：Cloudflare Pages 4 项目（app/admin/web/storybook）+ PR preview
- 1-7：Doppler 三环境（dev/staging/prod）+ CI 注入
- 1-10：Supabase 三项目（SG region）创建
- **W2 验收**：PR 自动评论 4 个 preview URL；staging 每日构建

### W3 · 后端运行时 + 错误监控（5 工作日）
- 1-6：API + Worker Dockerfile + Render 服务 + Blue-green
- 1-11：Upstash Redis + BullMQ 骨架 + 演示 job
- 1-8：Sentry FE source map + BE 中间件 + release tracking
- **W3 验收**：API `/health /ready` 返回 200；Sentry 抓到测试错误

### W4 · 行为分析 + 文档（5 工作日）
- 1-9：PostHog identify + Better Stack pino transport
- 1-12：Storybook + docs 站上线 + 模板（CONTRIBUTING / PR / Issue）
- 缓冲：1 天用于回归与文档完善
- **W4 验收**：DAU 仪表板能看到内部测试事件；PR/Issue 模板生效

## 依赖关系图

```
1-1 ─┬─ 1-2
     ├─ 1-3
     └─ 1-4 ─┬─ 1-5 ─┬─ 1-8
             │       ├─ 1-9
             │       └─ 1-12
             └─ 1-7 ─┬─ 1-10
                     ├─ 1-6 ── 1-8
                     └─ 1-11
```

## 风险

| 风险 | 概率 | 影响 | 缓解 |
|---|:-:|:-:|---|
| Cloudflare + Render 跨厂账单分散 | M | M | 早期建立月度成本 review |
| Supabase SG region 容量限制 | L | H | 提前申请；准备 Tokyo 备份 region |
| Render Blue-green 切流不熟 | M | M | 先在 dev 做 3 次切换演练 |
| Doppler 学习曲线 | L | L | W1 末尾 1h workshop |
| Turbo remote cache 配置错误 | M | L | 文档化 + 验收 cache hit ratio ≥ 70% |

## DoD（Definition of Done）

- [ ] 所有 12 story 状态 = done 并通过 code-review
- [ ] PR 合入触发 CI 全绿，含 bundle-size check
- [ ] Preview URL 自动评论（4 站）
- [ ] Staging 自动部署 ≥ 7 天连续无失败
- [ ] Prod 通过 tag + 手动审批可发布
- [ ] Sentry / PostHog / Better Stack 三件套均能在仪表板看到事件
- [ ] 健康检查 `/health /ready` 返回结构化 JSON
- [ ] `_bmad/repo/frontend-patterns.md` 同步 + CONTRIBUTING.md 完整
- [ ] Retrospective（`epic-1-retrospective`）完成

## 退出标准（进入 S02 设计系统）
- 1-5 (CF Pages) + 1-12 (Storybook) 完成 → S02 即可启动
- 其余 stories 与 S02 并行进行无阻塞
