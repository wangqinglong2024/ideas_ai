# AD-17 · 实现通知与公告

## PRD 原文引用

- `AD-FR-014`：“站内公告（多语种 banner）。”
- `AD-FR-014`：“邮件群发（已订阅营销邮件用户）。”
- `AD-FR-014`：“推送（v1.5）。”

## 需求落实

- 页面：`/admin/settings/announcements`。
- 组件：AnnouncementEditor、AudienceSelector、SchedulePicker。
- API：`/admin/api/announcements`。
- 数据表：`admin_announcements`、users/preferences、admin_audit_logs。
- 状态逻辑：v1 支持 banner 和 fake email adapter；push 仅占位。

## 不明确 / 风险

- 风险：真实邮件服务未接入。
- 处理：EmailAdapter 默认 console/fake，不阻塞测试。

## 技术假设

- 多语标题和正文使用 JSONB。

## 最终验收清单

- [ ] 可创建多语 banner。
- [ ] 可按国家/persona/status 选择受众。
- [ ] 邮件群发走 fake adapter。
- [ ] 推送入口标记 v1.5 占位。