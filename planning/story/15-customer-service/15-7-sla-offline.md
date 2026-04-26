# ZY-15-07 · SLA 仪表板 + 离线兜底

> Epic：E15 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] admin SLA 页：平均首响时长 / 会话时长 / 满意度
- [ ] 用户离线 → 写 `pending_messages`，下次上线 supabase realtime 推
- [ ] 每客服在线时长统计

## 测试方法
- 集成：mock 数据 → 仪表板数字正确
- 离线消息：用户重连后收到

## DoD
- [ ] 数据准确；离线消息不丢
