# ZY-18-05 · 隐私政策 + TOS（4+1 语）

> Epic：E18 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 4 语 (en/es/zh/ar) + 中文文案占位（律师终审由用户自处理）
- [ ] 静态路由 `/legal/privacy` `/legal/tos` `/legal/refund` `/legal/cookies`
- [ ] 注册必勾选；变更版本号 → 重确认弹窗
- [ ] `legal_consents(user_id, doc, version, ts)` 表

## 测试方法
- MCP Puppeteer：注册必须勾选
- 版本变更 → 下次登录强弹

## DoD
- [ ] 4+1 语齐 + 同意记录
