# UA-09 · 多设备会话管理

## PRD 原文引用

- `UA-FR-008`：“`/me/sessions` 列出所有活跃设备。”
- `UA-FR-008`：“显示：设备名 / IP / 最近活跃。”
- `UA-FR-008`：“可强制下线单个会话或全部。”

## 需求落实

- 页面：`/profile/settings/security` 或 `/profile/settings/sessions`。
- 组件：SessionList、SessionItem、RevokeSessionButton、LogoutAllButton。
- API：`GET /api/me/sessions`、`DELETE /api/me/sessions/:id`、`POST /api/auth/logout-all`。
- 数据表：`user_sessions`、`user_devices`。
- 状态逻辑：当前会话不可误删后留空白；撤销后 refresh token 失效。

## 技术假设

- device_name 可由 user-agent parser 生成，也可用户后续编辑。

## 不明确 / 风险

- 风险：IP 属敏感信息。
- 处理：用户只能看自己的最近 IP，后台访问写审计。

## 最终验收清单

- [ ] 会话列表显示设备名/IP/最近活跃。
- [ ] 单个下线后该 session 不能 refresh。
- [ ] 全部下线保留当前或要求重新登录，行为明确。
