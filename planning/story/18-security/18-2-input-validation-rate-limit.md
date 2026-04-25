# Story 18.2: API 输入校验 + Rate Limit

Status: ready-for-dev

## Story

作为 **后端工程师**，
我希望 **所有 API 入口具备 Zod 输入校验与多层 Rate Limit**，
以便 **防御注入 / 越权 / 暴力破解 / DoS，并为业务模块提供统一基础设施**。

## Acceptance Criteria

1. **Zod 校验**：所有 routes 必须声明 `request schema`（params / query / body / headers），中间件统一校验失败返回 400 + `{code:'INVALID_INPUT', errors:[{path,message}]}`。
2. **CI 守卫**：lint rule 检测 router 文件未导出 schema → 报错；新增 route 必须随 schema。
3. **全局 Rate Limit**：
   - 每 IP：120 RPM；
   - 每 user：300 RPM（已认证）；
   - 超限返回 429 + Retry-After。
4. **端点级 Rate Limit**：登录 / 注册 / 重置密码 / OTP 端点单独严格（5/min/IP + 5/min/key），覆盖默认。
5. **存储**：Redis token bucket（lua 原子脚本）；多区部署共享。
6. **白名单**：内部 IP / 监控 IP 可绕过（env 配置）。
7. **可观察**：429 上报 PostHog `rate_limit_hit`，含 path / key / threshold；连续高频 → Sentry breadcrumb（避免过量）。
8. **CSRF**：admin 后台 cookie 模式必须 CSRF token（双 cookie / X-CSRF header），端用户 Bearer 模式不需要。
9. **CORS**：白名单严格（zhiyu.io / *.zhiyu.io / localhost:5173 dev）；credentials true 时禁止 `*`。
10. **请求大小**：默认 body 1MB；上传端点单独 50MB；超限 413。
11. **测试**：每条规则单元测试 + 集成测试。

## Tasks / Subtasks

- [ ] **Zod 中间件**（AC: 1, 2）
  - [ ] `packages/api-utils/src/validate.ts`
  - [ ] eslint custom rule
- [ ] **Rate Limit**（AC: 3-7）
  - [ ] `packages/api-utils/src/rate-limit.ts` Redis lua
  - [ ] per-route override
- [ ] **CSRF / CORS / Body 大小**（AC: 8-10）
- [ ] **测试**（AC: 11）

## Dev Notes

### 关键约束
- Zod schema 共享：客户端可 import 同 schema 用于前端校验，避免漂移。
- error 返回不泄露内部字段名：白名单 path 翻译。
- 429 Retry-After header 必填，便于客户端退避。
- Redis lua 脚本使用 `EVALSHA` 缓存，注意 cluster 环境 hash tag。
- CORS preflight (OPTIONS) 同样校验 Origin。

### 关联后续 stories
- 18-1（鉴权）
- 18-3 安全 HTTP 头
- 18-9 WAF（互补但不重复）

### Project Structure Notes
- `packages/api-utils/src/validate.ts`
- `packages/api-utils/src/rate-limit.ts`
- `packages/api-utils/src/csrf.ts`
- `packages/api-utils/src/cors.ts`
- `eslint-rules/require-route-schema.ts`

### References
- `planning/epics/18-security.md` ZY-18-02
- `planning/spec/09-security.md` § 3

### 测试标准
- 单元：每规则
- 集成：429 + Retry-After
- 安全：CORS preflight 拒绝非白名单

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
