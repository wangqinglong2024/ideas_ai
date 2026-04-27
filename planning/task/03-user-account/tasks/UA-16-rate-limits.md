# UA-16 · 账号接口限流

## PRD 原文引用

- `planning/prds/06-user-account/02-data-model-api.md`：“register / login：10/min/IP。”
- 同文件：“send-otp：1/60s/email，5/h/email。”
- 同文件：“数据导出：1/月/user。”

## 需求落实

- 页面：限流错误提示在登录、注册、OTP、导出页显示。
- 组件：RateLimitNotice。
- API：register、login、send-otp、data-exports 中间件。
- 数据表：Redis 计数；必要时 `security_events`。
- 状态逻辑：超限返回 429，带 retry_after。

## 技术假设

- Redis 是限流计数存储。
- admin 手动操作不绕过安全审计。

## 不明确 / 风险

- 风险：SC 安全文档有更细粒度规则。
- 处理：账号模块按本 PRD 下限实现，SC 可叠加更严格全局规则。

## 最终验收清单

- [ ] login/register 超限返回 429。
- [ ] OTP 重发 60s 冷却。
- [ ] 数据导出每月 1 次限制生效。
