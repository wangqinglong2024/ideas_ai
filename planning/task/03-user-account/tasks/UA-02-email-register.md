# UA-02 · 邮箱注册

## PRD 原文引用

- `UA-FR-001`：“字段：邮箱、密码、母语（默认 UI 语言）、隐私同意。”
- `UA-FR-001`：“Turnstile 验证。”
- `UA-FR-001`：“注册立即送 100 知语币（详见 EC）。”
- `UA-FR-001`：“邮箱验证邮件触发。”

## 需求落实

- 页面：`/auth/register` 或登录注册 modal。
- 组件：RegisterForm、EmailInput、PasswordInput、LanguageSelect、PrivacyConsentCheckbox、CaptchaSlot。
- API：`POST /api/auth/register`。
- 数据表：`auth.users`、`users`、`user_preferences`、`user_email_otp`、`coin_wallets/coin_ledger`。
- 状态逻辑：注册成功后创建用户 profile，触发 OTP 邮件；赠币需等邮箱验证成功后幂等发放。

## 技术假设

- Turnstile 按铁律由 CaptchaAdapter always-pass/fake 实现。
- 隐私同意时间可写入 users meta 或单独合规表，若 SC 模块定义则迁移到合规模块。

## 不明确 / 风险

- 风险：PRD 写“注册立即送”，EC 写“验证邮箱后 +100”。
- 处理：为防刷币，执行 EC 原文“验证邮箱后 +100 ZC（一次）”，并在本任务标注冲突。

## 最终验收清单

- [ ] 缺 captcha key 时注册不失败。
- [ ] 注册后用户为未验证状态。
- [ ] 邮箱验证触发 fake email。
