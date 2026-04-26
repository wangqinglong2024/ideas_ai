# ZY-15-05 · 工单流

> Epic：E15 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 用户提交工单（分类 / 描述 / 附件）
- [ ] 后台派单 + 状态机（new → assigned → in_progress → resolved → closed）
- [ ] EmailAdapter（fake）通知用户状态变更
- [ ] 用户可补充消息

## 测试方法
- 集成：状态流转完整链路
- MCP Puppeteer：用户提交 → 后台处理

## DoD
- [ ] 状态机准确
