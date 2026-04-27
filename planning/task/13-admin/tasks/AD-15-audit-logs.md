# AD-15 · 实现后台操作审计

## PRD 原文引用

- `AD-FR-012`：“所有写操作记录 audit_logs。”
- `AD-FR-012`：“字段：actor / action / resource / before / after / ip / ua / timestamp。”
- `AD-FR-012`：“7 年保留。”

## 需求落实

- 页面：`/admin/audit`。
- 组件：AuditLogTable、AuditDiffViewer。
- API：`GET /admin/api/audit?actor=&resource=&page=`。
- 数据表：`admin_audit_logs`。
- 状态逻辑：所有 `/admin/api` 写操作中间件自动记录；敏感字段脱敏。

## 不明确 / 风险

- 风险：before/after 可能含密码、token、TOTP secret。
- 处理：审计中间件强制脱敏字段黑名单。

## 技术假设

- 7 年保留仅定义策略，不在 dev 做物理归档。

## 最终验收清单

- [ ] 写操作 100% 有审计。
- [ ] 可按 actor/resource 查询。
- [ ] 敏感字段不落明文。
- [ ] audit 页面只读不可篡改。