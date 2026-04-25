# Story 18.5: 审计日志（append-only · 7 年保留）

Status: ready-for-dev

## Story

作为 **安全 / 合规 / 客服**，
我希望 **后台所有写操作 100% 写入 append-only 审计日志，并保留 7 年**，
以便 **支持事故追溯、合规审查、争议处理与司法协查**。

## Acceptance Criteria

1. 表 `audit_logs`：id uuid v7 / actor_type enum 'admin'|'user'|'system'|'cron' / actor_id / actor_email / action / resource_type / resource_id / before jsonb / after jsonb / diff jsonb / reason text / severity enum 'low'|'medium'|'high' / ip / user_agent / created_at；所有列只写不更新。
2. **append-only**：DB 触发器拒绝 UPDATE / DELETE（service_role 也禁止）；仅 partition pruning 允许过期分区 detach。
3. **分区**：按月 partition by range（created_at），便于归档与查询；自动每月创建下个分区（cron）。
4. **保留 7 年**：超过 7 年分区 detach 到冷存储（R2 parquet 导出）；查询接口可触发解冻（v1.5 实现）。
5. **后端中间件** `auditLog(action, builder)`：在 admin / GDPR / 危险操作的 handler 中包裹，自动写日志；失败时仍写日志（可降级成 stdout + Sentry 告警）。
6. **必须覆盖**：所有 17-x admin 写操作 / 18-7 GDPR 操作 / 13-x 退款 / 14-8 commission_reversed / 12-x ledger 调整 / 17-12 flag 切换 / 17-2 登录与失败。
7. **诊断**：`/admin/audit`（仅 `audit:read`）：分页 / 筛选 / 全文搜索（trgm index on action / resource_type）；一行点击查看 before/after diff。
8. **导出**：CSV / JSON（仅 `audit:export`）；超 100k 异步任务。
9. **不可篡改性**：每条 row 计算 sha256(prev_hash + payload) 链式；表多一列 hash；CI nightly 验证链完整。
10. **性能**：写入 P99 < 30ms（异步队列也可）；读取按 actor / resource 索引 P95 < 200ms。
11. **测试**：append-only 触发器拒绝；hash 链验证；中间件 6 类场景写入。

## Tasks / Subtasks

- [ ] **Schema + 触发器 + 分区**（AC: 1-3）
- [ ] **保留策略**（AC: 4）
  - [ ] cron detach 旧分区
- [ ] **中间件**（AC: 5）
  - [ ] 同步 + 失败降级
- [ ] **覆盖各模块**（AC: 6）
  - [ ] 协同 17-x 接入点
- [ ] **审计 UI**（AC: 7, 8）
- [ ] **链式哈希**（AC: 9）
  - [ ] CI nightly hash chain check
- [ ] **测试**（AC: 11）

## Dev Notes

### 关键约束
- append-only 触发器：`BEFORE UPDATE OR DELETE ON audit_logs RAISE EXCEPTION`；service_role 同样阻断（不绕过）。
- 中间件失败处理：写主库失败 → 写 BullMQ 死信 + Sentry，不允许悄悄丢失（合规高压线）。
- diff jsonb：使用 `json-diff` 计算 before/after；大对象（> 64KB）省略 + 标 `truncated`。
- 链式 hash：上一行 hash + 当前 row（除 hash 字段）的 sha256；导出冷存储时验证后再 detach。
- 7 年导出：parquet 每月一个文件，元数据写 `audit_archives` 表。

### 关联后续 stories
- 17-x 全部消费方
- 18-7 GDPR 删除（删除事件本身必须写）
- 19-x observability（告警链路）

### Project Structure Notes
- `packages/db/schema/audit.ts`
- `packages/db/migrations/2026xxxx_audit_logs.sql`
- `packages/audit/src/middleware.ts`
- `apps/admin/src/pages/audit/`
- `apps/api/src/routes/admin/audit.ts`
- `apps/api/src/jobs/audit-partition-rotate.ts`
- `.github/workflows/audit-hash-chain-check.yml`

### References
- `planning/epics/18-security.md` ZY-18-05
- `planning/spec/05-data-model.md` § 4.16

### 测试标准
- 单元：触发器 / hash 计算
- 集成：6 类操作端到端写日志
- 安全：UPDATE 拒绝；hash chain 验证

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
