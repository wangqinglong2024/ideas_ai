# ZY-13-06 · 财务对账视图（后台）

> Epic：E13 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] admin `/admin/finance` 每日订单聚合：成交 / 退款 / 净额
- [ ] CSV 导出
- [ ] 按 provider 分组（为未来真实供应商接入预留）
- [ ] 数据走 supabase RPC 聚合

## 测试方法
- admin UI：日期范围筛选 → 数据准确
- CSV 文件可下载

## DoD
- [ ] 视图准确；接口可复用
