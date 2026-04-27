# FP-19 · 实现 SmsAdapter Fake

## 原文引用

- `planning/spec/02-tech-stack.md`：“SMS | SmsAdapter | console/fake | Twilio / 本地短信。”
- `planning/rules.md`：“缺失第三方 API key 时使用 mock/fake 适配器。”

## 需求落实

- 页面：无。
- 组件：SmsAdapter interface、FakeSmsAdapter。
- API：供安全验证、通知或未来模块调用。
- 数据表：无默认表；如需 outbox 后续模块定义。
- 状态逻辑：fake adapter 只记录请求，不发送短信。

## 技术假设

- 当前 UA 主流程使用邮箱 OTP，不依赖短信。
- SmsAdapter 作为规范要求的基础设施占位。

## 不明确 / 风险

- 风险：产品后续将短信设为必需但未补真实供应商。
- 处理：需求变更时新增真实 provider 任务。

## 最终验收清单

- [ ] SmsAdapter interface 可被 DI 注入。
- [ ] fake 发送返回稳定成功响应。
- [ ] 无短信 key 不影响容器启动。
