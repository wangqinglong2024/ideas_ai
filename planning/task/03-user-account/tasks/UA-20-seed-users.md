# UA-20 · 用户账号种子数据

## 原文引用

- `planning/rules.md`：“UA | 种子用户 ≥5：admin、normal、vip、referrer、blocked。”
- `planning/rules.md`：“所有 seed 必须幂等：按 slug/code/external_id upsert。”

## 需求落实

- 页面：无。
- 组件：seed JSON/SQL、seed runner。
- API：无公开 API。
- 数据表：`users`、`user_preferences`、`user_devices`、`coin_wallets`、admin 相关表按 AD seed 联动。
- 状态逻辑：重复执行 seed 不产生重复用户；blocked 用户状态可用于权限/风控测试。

## 技术假设

- seed 路径 `system/packages/db/seed/user-account/*`。
- 密码使用固定 dev hash 或通过脚本生成，不明文写日志。

## 不明确 / 风险

- 风险：admin 用户同时属于 AD 模块。
- 处理：UA seed 创建基础用户，AD seed 赋予后台角色。

## 最终验收清单

- [ ] `pnpm seed:user-account` 幂等。
- [ ] 至少 5 类用户存在。
- [ ] normal/vip/referrer/blocked 可用于 E2E 测试。
