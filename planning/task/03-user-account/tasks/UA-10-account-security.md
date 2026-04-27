# UA-10 · 账户安全设置

## PRD 原文引用

- `UA-FR-009`：“修改密码（需当前密码）。”
- `UA-FR-009`：“修改邮箱（验证新邮箱）。”
- `UA-FR-009`：“启用 2FA（v1.5）。”

## 需求落实

- 页面：`/profile/settings/security`。
- 组件：ChangePasswordForm、ChangeEmailForm、TwoFactorPlaceholder。
- API：`POST /api/auth/password/change`、`POST /api/auth/email/send-otp`、`POST /api/auth/email/verify-otp`。
- 数据表：`users`、`user_email_otp`、`user_sessions`。
- 状态逻辑：改密码需当前密码；改邮箱需新邮箱验证；2FA 只占位不启用。

## 技术假设

- 2FA 用户端是 v1.5，不纳入 W0 必须实现；后台 admin 2FA 由 AD 模块单独实现。

## 不明确 / 风险

- 标注：用户端 2FA 暂不支持。
- 处理：UI 可显示“即将支持”，不得生成不可用开关。

## 最终验收清单

- [ ] 当前密码错误不能改密码。
- [ ] 新邮箱验证前不替换登录邮箱。
- [ ] 用户端 2FA 明确标注 v1.5。
