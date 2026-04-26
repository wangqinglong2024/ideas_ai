# ZY-15-02 · Realtime 通道 + 派单服务

> Epic：E15 · 估算：L · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 用户开会话 → BE 创建 conversation
- [ ] 客服在线时 supabase realtime broadcast 到 `agent:<aid>` 频道
- [ ] 全部客服离线 → 自动转工单 + EmailAdapter（fake）通知
- [ ] 转接 / 升级 actions 写库 + emit broadcast 到 `conv:<id>`
- [ ] **不引入** Socket.io / 自建 Redis adapter

## 测试方法
- 集成：在线 / 全离线 两路径
- MCP Puppeteer：双客户端实时收消息

## DoD
- [ ] supabase realtime only
