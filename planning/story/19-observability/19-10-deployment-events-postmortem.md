# Story 19.10: 部署事件 + Postmortem 模板

Status: ready-for-dev

## Story

作为 **SRE / 全员**，
我希望 **每次部署自动产生「部署事件」并通知 Slack、标注到 PostHog / Sentry，且事故有标准 PIR 模板**，
以便 **快速关联回归与发布、规范化复盘形成知识沉淀**。

## Acceptance Criteria

1. **部署事件**：CI 部署成功后调用：
   - Sentry `releases finalize` + `deploys new`
   - PostHog `Annotation`（事件 `release.deployed { app, version, env }`）
   - Better Stack `Deployment` event
   - Slack `#deployments` 富文本（app / sha / author / changelog 链接 / Render dashboard）
2. **失败部署** 同样上报，附错误链接；自动开 Sev3 ticket。
3. **回滚事件**：单独标记 `release.rolled_back`；Sentry / PostHog 同步。
4. **PIR 模板** `docs/templates/postmortem.md`：summary / impact / timeline / root cause / resolution / detection / what went well / what didn't / action items（owner + due）。
5. **PIR 流程**：Sev1/Sev2 故障必须 72h 内完成 PIR；PR 合入到 `docs/postmortems/yyyy/<incident-id>.md`；admin `/admin/postmortems` 列表。
6. **关联**：PIR 文件头自动从告警 / Sentry / status page 拉时间线 stub（CLI `pnpm pir:new --incident=<id>`）。
7. **Action Items 跟踪**：导出到 GitHub Issues（label `pir-action`），看板每周 review。
8. 演练：模拟一次 Sev2 → 完整 PIR 走完流程。

## Tasks / Subtasks

- [ ] **CI 集成**（AC: 1, 2, 3）
  - [ ] `.github/workflows/deploy.yml` 后置 step：webhook 多源
  - [ ] `scripts/release-event.ts` 通用工具
- [ ] **Slack 富卡片**（AC: 1）
  - [ ] block kit 模板
- [ ] **PIR 模板 / CLI**（AC: 4, 6）
  - [ ] `docs/templates/postmortem.md`
  - [ ] `pnpm pir:new` CLI（fetch BS/Sentry/PD timeline）
- [ ] **Admin 列表**（AC: 5）
  - [ ] `/admin/postmortems` 渲染 markdown 列表 + 搜索
- [ ] **GH 同步**（AC: 7）
  - [ ] PIR action items → gh api 创建 issue（label）
- [ ] **演练**（AC: 8）
  - [ ] runbook + 一次实战

## Dev Notes

### 关键约束
- 部署事件发送失败**不可阻塞**生产部署；仅 warn + retry 3 次。
- PIR 文件不可包含 PII / 真实用户数据；客户影响只用聚合数。
- 行动项必须有 owner + due date；空者 PR 不允许 merge（CI 校验）。
- 与 20-10 上线日 PIR 复用同模板。

### 关联后续 stories
- 19-2 Sentry release / 19-3 PostHog annotation
- 19-6 告警关联
- 20-10 上线日 PIR

### Project Structure Notes
- `.github/workflows/deploy.yml`
- `scripts/release-event.ts`
- `scripts/pir-new.ts`
- `docs/templates/postmortem.md`
- `apps/admin/src/pages/postmortems/`

### References
- [planning/epics/19-observability.md ZY-19-10](../../epics/19-observability.md)
- [planning/spec/10-observability.md](../../spec/10-observability.md)

### 测试标准
- 单元：webhook payload schema
- 集成：部署 → 4 通道全部到达
- E2E：PIR CLI 生成文件含完整 stub

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
