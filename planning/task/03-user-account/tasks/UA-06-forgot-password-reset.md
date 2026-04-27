# UA-06 · 忘记密码与重置

## PRD 原文引用

- `UA-FR-005`：“输入邮箱 → 收链接（10min 有效）。”
- `UA-FR-005`：“链接含一次性 token。”
- `UA-FR-005`：“重置密码 + 让所有现有 session 登出。”

## 需求落实

- 页面：`/auth/forgot-password`、`/auth/reset-password`。
- 组件：ForgotPasswordForm、ResetPasswordForm、PasswordStrengthHint。
- API：`POST /api/auth/password/reset-request`、`POST /api/auth/password/reset`。
- 数据表：`user_email_otp` 或 reset token 表、`user_sessions`。
- 状态逻辑：token 10min 过期且一次性；重置成功后 revoke 所有 session。

## 技术假设

- reset token 使用 HMAC token + ts + nonce 或 OTP 表 purpose=`reset_password`。
- EmailAdapter fake 记录链接。

## 不明确 / 风险

- 风险：泄露 reset token。
- 处理：日志脱敏，token 只在 fake outbox 供测试读取。

## 最终验收清单

- [ ] reset 链接 10 分钟后不可用。
- [ ] token 重放失败。
- [ ] 重置后旧 session 全部失效。
