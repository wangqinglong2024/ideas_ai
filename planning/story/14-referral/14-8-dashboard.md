# ZY-14-08 · 分销员仪表板 /me/referral

> Epic：E14 · 估算：L · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 累计 / 待确认 / 已发放 ZC 三大数字
- [ ] L1 / L2 推荐人数；30 天曲线
- [ ] 邀请链接 + 复制 / 海报按钮（**不显示纯 code**）
- [ ] 推荐人列表（脱敏：用户名首尾 + ***，时间脱敏到日）
- [ ] P95 < 500ms（数据走 RPC 聚合）

## 测试方法
- MCP Puppeteer：仪表板加载 + 复制链接
- 集成：聚合数字与 ledger 一致

## DoD
- [ ] 视觉 + 性能达标
