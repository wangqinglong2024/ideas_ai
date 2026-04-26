# ZY-18-02 · API 输入校验 + Rate Limit

> Epic：E18 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 所有 BE 入口 zod schema 校验（query / body / params）
- [ ] `express-rate-limit` + `ioredis` store
- [ ] 全局 + 端点级；IP + user 双键
- [ ] 429 响应含 retry-after
- [ ] **禁止** import @upstash/ratelimit

## 测试方法
- 集成：超阈值 → 429
- 单元：zod 校验失败 → 400

## DoD
- [ ] 全 API 覆盖
