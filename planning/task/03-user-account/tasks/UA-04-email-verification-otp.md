# UA-04 · 邮箱验证 OTP

## PRD 原文引用

- `UA-FR-003`：“6 位数字 OTP，15min 有效。”
- `UA-FR-003`：“重发限流：60s/次，5 次 / 小时。”
- `UA-FR-003`：“未验证：可登录但功能受限（不能付费 / 不能 1v1 客服）。”

## 需求落实

- 页面：`/auth/verify-email`、注册后验证提示。
- 组件：PinInput、ResendOtpButton、VerificationStatusBanner。
- API：`POST /api/auth/email/send-otp`、`POST /api/auth/email/verify-otp`。
- 数据表：`user_email_otp`、`users.email_verified_at`。
- 状态逻辑：OTP 过期、已消费、尝试次数、重发冷却；验证后解锁付费与 1v1 客服。

## 技术假设

- OTP code 存 hash，不存明文。
- EmailAdapter fake 记录邮件内容。

## 不明确 / 风险

- 风险：未验证仍可登录导致部分页面要处理受限状态。
- 处理：前端全局用户状态含 `email_verified`，业务动作前二次校验。

## 最终验收清单

- [ ] 6 位 OTP 15 分钟过期。
- [ ] 60 秒内不能重复发送。
- [ ] 未验证用户不能付费或进入 1v1 客服。
