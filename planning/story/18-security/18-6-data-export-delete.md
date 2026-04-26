# ZY-18-06 · 数据下载 + 删除（GDPR）

> Epic：E18 · 估算：L · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] GET `/api/v1/me/export` → 异步 BullMQ 任务 → JSON 包写 supabase-storage `exports/<uid>.zip` + 邮件链接
- [ ] DELETE `/api/v1/me` → 30d 软删（`profiles.deleted_at`）；30d 后 worker 物理删
- [ ] 30d 内可撤销
- [ ] DPA 文档占位（用户后续完善）

## 测试方法
- 集成：导出包含全表数据
- 删除 → 30d cron → 物理删

## DoD
- [ ] 双链路通；不丢业务表关联
