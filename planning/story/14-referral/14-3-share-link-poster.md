# ZY-14-03 · 分享链接 + 海报素材

> Epic：E14 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] GET `/api/v1/me/referral/share-link` → 完整 URL（dev：`http://115.159.109.23:3100/r/AB3K7Z`）
- [ ] 4 语种邀请文案模板
- [ ] QR 海报生成（PNG，写入 supabase-storage `posters/<uid>.png`）
- [ ] 系统分享按钮调 Web Share API；**不引入**第三方分享 SDK

## 测试方法
- MCP Puppeteer：进入分销页 → 复制链接 → 海报下载

## DoD
- [ ] 4 语 + QR 海报齐
