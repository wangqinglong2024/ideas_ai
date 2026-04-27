# FP-18 · 实现 EmailAdapter Fake

## 原文引用

- `planning/spec/02-tech-stack.md`：“邮件 | EmailAdapter | console/fake | Resend / SES。”
- `planning/rules.md`：“缺失第三方 API key 时使用 mock/fake 适配器，禁止因缺 key 阻塞容器启动或测试。”

## 需求落实

- 页面：无。
- 组件：EmailAdapter interface、FakeEmailAdapter、email template renderer。
- API：供 UA、PY、CS、LE、AD 调用。
- 数据表：可选 `email_outbox` 或日志事件，若建表需由具体模块确认。
- 状态逻辑：fake adapter 记录发送请求，不真实发邮件。

## 技术假设

- dev 默认 provider=fake。
- 未来真实 provider 不在本期实现。

## 不明确 / 风险

- 风险：测试依赖真实邮箱收件。
- 处理：测试读取 fake outbox/log。

## 最终验收清单

- [ ] 缺邮件 key 时注册/重置密码流程不崩。
- [ ] fake 邮件记录包含 to、template、locale、payload。
- [ ] 日志不输出敏感 token 明文。
