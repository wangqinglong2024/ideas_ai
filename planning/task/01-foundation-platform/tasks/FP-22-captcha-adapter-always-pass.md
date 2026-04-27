# FP-22 · 实现 CaptchaAdapter Always-pass

## 原文引用

- `planning/spec/02-tech-stack.md`：“Captcha | CaptchaAdapter | always-pass | Turnstile。”
- `planning/prds/06-user-account/01-functional-requirements.md`：“Turnstile 验证。”

## 需求落实

- 页面：登录/注册/重置密码页面可预留 captcha slot。
- 组件：CaptchaAdapter interface、AlwaysPassCaptchaAdapter。
- API：register、login、reset password、关键操作可调用 verify。
- 数据表：可写 `security_events` 记录校验绕过/失败。
- 状态逻辑：dev always-pass；风险事件仍可记录。

## 技术假设

- 不接真实 Turnstile。
- UI 上可显示 dev-only captcha bypass 标识，但不对最终用户暴露实现细节。

## 不明确 / 风险

- 风险：安全测试误认为未实现验证码需求。
- 处理：验收说明 Adapter 已实现，真实 provider 不在 dev 范围。

## 最终验收清单

- [ ] CaptchaAdapter verify 返回稳定通过。
- [ ] 缺 captcha key 不影响注册/登录测试。
- [ ] 调用点保留，未来可换 provider。
