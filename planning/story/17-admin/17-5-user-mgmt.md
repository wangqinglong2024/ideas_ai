# ZY-17-05 · 用户管理

> Epic：E17 · 估算：L · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 列表 / 搜索 / 多维筛选；详情（学习 / 订单 / 设备）
- [ ] 操作：封禁 / 重置密码 / 调整 ZC / 强制登出
- [ ] 全部写 audit_logs（接 E18-04）
- [ ] 高危操作二次确认

## 测试方法
- MCP Puppeteer：搜索 → 详情 → 调整 ZC → ledger 出现

## DoD
- [ ] 全操作审计
