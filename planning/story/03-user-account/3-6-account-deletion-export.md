# ZY-03-06 · 账号删除 + 数据导出（GDPR）

> Epic：E03 · 估算：L · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] `/api/v1/me/export` → 异步生成 JSON 包（profile + 学习 + 订单 + 收藏）→ 上传 supabase-storage 桶 `exports/<uid>/<ts>.json` 返回 signed URL
- [ ] 删除流程：验证密码 → 邮件二次确认（EmailAdapter fake，console 输出确认链）→ `profiles.deleted_at = now()`
- [ ] cron（zhiyu-worker）：每日扫 `deleted_at < now() - 30d` → 调 supabase auth admin deleteUser + cascade
- [ ] 30 天内可访问 `/me/restore` 取消删除

## 测试方法
- MCP Puppeteer：完整跑 export → 下载 → delete → restore
- 单元：cron 函数对边界日期处理

## DoD
- [ ] 全链路通
- [ ] 软删后无法登录
- [ ] restore 后数据可用
