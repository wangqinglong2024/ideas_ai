# AD-05 · 实现用户管理

## PRD 原文引用

- `AD-FR-003`：“`/users` 列表 + 搜索（邮箱 / ID / 昵称 / 推荐码）。”
- `AD-FR-003`：“详情：profile + 订单 + 进度 + 币流水 + 客服历史 + 分销树。”
- `AD-FR-003`：“冻结 / 解冻 / 重置密码 / 强制下线 / 加币 / 扣币 / 模拟登录（审计）。”

## 需求落实

- 页面：`/admin/users`、`/admin/users/:id`。
- 组件：AdminUserTable、AdminUserDetail、UserActionMenu。
- API：`GET /admin/api/users`、`GET /admin/api/users/:id`、冻结/加扣币/模拟登录端点。
- 数据表：users/profiles、orders、coin_ledger、sessions、referral tables、admin_audit_logs。
- 状态逻辑：所有写操作必须填写 reason 并审计。

## 不明确 / 风险

- 风险：模拟登录权限高风险。
- 处理：仅 admin 可用，强审计，默认只读模拟。

## 技术假设

- 用户隐私字段在列表页脱敏。

## 最终验收清单

- [ ] 支持邮箱/ID/昵称/推荐码搜索。
- [ ] 用户详情聚合各模块信息。
- [ ] 冻结/解冻/强制下线生效。
- [ ] 所有操作写 audit log。