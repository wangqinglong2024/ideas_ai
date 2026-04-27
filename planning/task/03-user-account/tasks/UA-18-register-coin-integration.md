# UA-18 · 注册赠币与经济模块集成

## PRD 原文引用

- `UA-FR-001`：“注册立即送 100 知语币（详见 EC）。”
- `planning/prds/08-economy/01-functional-requirements.md`：“验证邮箱后 +100 ZC（一次）。”

## 需求落实

- 页面：注册成功/邮箱验证成功提示。
- 组件：CoinGrantedToast、VerificationRewardNotice。
- API：邮箱验证成功后调用 `coinService.grant`。
- 数据表：`coin_wallets`、`coin_ledger`。
- 状态逻辑：以邮箱验证成功为发放触发点；idempotency_key 防重复发放。

## 技术假设

- EC 模块提供内部 service，不通过公开 API 发币。
- 未验证账号不发币，降低刷号风险。

## 不明确 / 风险

- 明确冲突：UA 写注册立即送，EC 写验证后送。
- 处理：不删除 UA 需求，按“详见 EC”的细化规则执行验证后送。

## 最终验收清单

- [ ] 邮箱验证成功发 100 ZC。
- [ ] 重复验证不重复发币。
- [ ] 账本 type 为 register 或 verify_register_reward。
