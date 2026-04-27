# I18N-10 · 邮件 5 语模板

## PRD 原文引用

- `I18N-FR-009`：“邮件模板 4 语；按用户偏好语发送；推送 v1.5 占位。”
- 用户裁决新增 zh-CN，共 5 语。

## 需求落实

- 模板目录：`system/packages/backend/src/notifications/email-templates/{lang}/{template_name}.mjml`。
- 模板：welcome / verify_email / reset_password / order_success / certificate_ready / weekly_summary。
- 渲染：MJML → HTML；按用户 preferences.ui_lang 选模板，缺失回退 en。
- 邮件 NotificationAdapter 生产用 SMTP；v1 用 fake adapter 落 log。

## 状态逻辑

- 5 lang × 6 模板 = 30 文件。
- 占位变量统一 `{{user_name}} {{verification_url}} ...`。
- zh-CN 标题用中文（避免英文 subject 在中文邮件客户端乱）。

## 不明确 / 风险

- 风险：缺译模板回退 en 可能体验突兀。
- 处理：发邮件前检查模板存在；缺失时记 `notifications_missing_template` 事件。

## 最终验收清单

- [ ] 5 lang × 6 模板齐全。
- [ ] FakeAdapter log 包含 lang + template_id。
- [ ] zh-CN 用户收到中文标题。
- [ ] 缺模板自动 fallback 到 en + 告警。
