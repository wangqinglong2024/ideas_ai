# ZY-08-02 · 课程 + 节 API

> Epic：E08 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] GET `/api/v1/tracks`、`/tracks/:slug`、`/stages/:id`、`/lessons/:id`
- [ ] 付费校验：未付费 → 仅返回前 N 步骤 + 付费墙 hint
- [ ] 付费校验查 `entitlements`（接 E13）
- [ ] 节内步骤回答转发到 ZY-07-02

## 测试方法
- 集成：未付费用户访问付费节 → 返回受限 payload
- 已付费用户 → 完整 payload

## DoD
- [ ] API 完整 + RLS 与付费校验通
