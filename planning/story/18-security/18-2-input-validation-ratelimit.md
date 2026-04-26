# ZY-18-02 · 输入校验 + 限流

> Epic：E18 · 估算：M · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 后端工程师
**I want** 全 API zod 校验 + 分级限流（IP / user / 接口）
**So that** 抵御注入 / 暴力 / 爬虫。

## 上下文
- zod-to-openapi 已就绪（ZY-08-02）
- 限流自实现：基于 redis SETEX + lua 原子操作；**不**用 @upstash/ratelimit
- 默认配置：登录 5/IP/min；OTP 1/邮箱/min；写接口 60/user/min；读接口 600/IP/min

## Acceptance Criteria
- [ ] zod schema 100% 覆盖（lint 强制）
- [ ] RateLimiter 中间件（redis）
- [ ] 4 默认策略 + 可注解覆盖
- [ ] 触发返回 429 + Retry-After

## 测试方法
```bash
cd /opt/projects/zhiyu/system/docker
docker compose exec zhiyu-app-be pnpm vitest run security.ratelimit
```

## DoD
- [ ] 限流准确（≤±5%）

## 依赖
- 上游：ZY-01-04
