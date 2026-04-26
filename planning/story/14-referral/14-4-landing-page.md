# ZY-14-04 · 邀请落地页 /r/:code

> Epic：E14 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 路由 `/r/:code` → 解析 + 校验存在
- [ ] 显示邀请人头像 + 名（脱敏）
- [ ] 30 天 cookie 写入 `ref_code`
- [ ] 注册成功后调用 `referralService.bindParent(userId, ref_code)`
- [ ] 失效 / 不存在 → 不阻塞继续注册

## 测试方法
- MCP Puppeteer：访问 /r/AB3K7Z → 注册 → 关系绑定

## DoD
- [ ] cookie + 绑定流程通
