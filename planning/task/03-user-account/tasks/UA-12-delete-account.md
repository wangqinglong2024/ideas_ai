# UA-12 · 销户与恢复期

## PRD 原文引用

- `UA-FR-011`：“‘销毁账户’按钮。”
- `UA-FR-011`：“二次确认 + 输入密码。”
- `UA-FR-011`：“软删：90 天可恢复（联系客服）。”
- `UA-FR-011`：“90 天后硬删（GDPR 兼容）。”
- `UA-FR-011`：“销户后：无法登录、订阅不退款（按 ToS）、知语币清零。”

## 需求落实

- 页面：`/profile/settings/privacy/delete-account`。
- 组件：DeleteAccountDangerZone、ConfirmDialog、PasswordConfirmInput。
- API：`POST /api/me/delete-account`、`POST /api/me/restore-account`（客服触发）。
- 数据表：`users.status/deleted_at`、`user_sessions`、`coin_wallets`、订阅/订单表只读保留审计。
- 状态逻辑：active → deleted_pending → deleted；90 天内客服可恢复；销户立即 revoke sessions。

## 技术假设

- 硬删任务由 worker cron 执行。
- 法务要求保留订单审计时，对个人字段做匿名化而非删除订单。

## 不明确 / 风险

- 风险：知语币清零与账本审计冲突。
- 处理：写一条清零 ledger 或冻结钱包，保留审计轨迹。

## 最终验收清单

- [ ] 销户必须输入密码并二次确认。
- [ ] 销户后无法登录。
- [ ] 90 天恢复和硬删路径可测试。
