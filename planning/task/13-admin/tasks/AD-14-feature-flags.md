# AD-14 · 实现 Feature Flags

## PRD 原文引用

- `AD-FR-011`：“列表 + 编辑（payment.provider / promo.banner / game.live / 等）。”
- `AD-FR-011`：“灰度发布（按用户 / 国家 / Persona 标签）。”

## 需求落实

- 页面：`/admin/settings/feature-flags` 或 `/admin/flags`。
- 组件：FlagTable、FlagEditor、RolloutRuleBuilder。
- API：`GET /admin/api/flags`、`PATCH /admin/api/flags/:key`。
- 数据表：`feature_flags`、`admin_audit_logs`。
- 状态逻辑：flag 修改实时生效但必须可回滚；payment.provider 本期不得开启真实外部支付。

## 不明确 / 风险

- 风险：flag 错误配置影响全站。
- 处理：保存前校验 schema，保留历史版本。

## 技术假设

- 前后端通过共享 config SDK 读取 flags。

## 最终验收清单

- [ ] flag 列表/编辑可用。
- [ ] 支持按用户/国家/Persona 灰度。
- [ ] 修改写审计并可回滚。
- [ ] 禁止通过 flag 启用未实现外部 provider。