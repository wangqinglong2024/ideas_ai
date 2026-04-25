# Story 11.7: 章节解锁付费（单章 / 整本 / VIP）

Status: ready-for-dev

## Story

作为 **学习者**，
我希望 **能用知语币单章解锁、整本订阅，或 VIP 全免阅读**，
以便 **按消费意愿灵活付费**。

## Acceptance Criteria

1. 单章解锁：付费墙点击 → 弹窗确认 `price_coins` → 调用 `POST /v1/coins/spend`（E12 幂等）→ 写 `novel_chapter_unlocks(user_id, chapter_id)` → 返回内容。
2. 整本订阅：商品 `novel_full_unlock_<novel_id>` 在 E12 商城可购；写 `novel_full_unlocks(user_id, novel_id)`。
3. VIP 全免：用户存在有效订阅（E13）即跳过付费校验。
4. 余额不足：弹窗引导前往充值 / 商城。
5. 幂等：同章重复 spend 必须返回 200 不重复扣币（基于 `unlock` 唯一索引）。
6. 退款：管理后台触发后回滚解锁记录 + 退币流水。
7. 全链路审计：`audit_log` 记录解锁事件。
8. 4 语 UI。

## Tasks / Subtasks

- [ ] 单章 spend + 写解锁表（AC: 1,5）
- [ ] 整本订阅商品定义（AC: 2）
- [ ] VIP 校验（AC: 3）
- [ ] 余额不足引导（AC: 4）
- [ ] 退款回滚（AC: 6）
- [ ] 审计 + i18n + 测试

## Dev Notes

### 关键约束
- 唯一索引：`(user_id, chapter_id)` 防重复扣。
- 解锁与 spend 必须同事务（DB 层）。

### Project Structure Notes
- `apps/api/src/routes/novels.unlock.ts`
- `packages/db/schema/novels-unlock.ts`
- `apps/web/src/components/novels/Paywall.tsx`

### References
- [Source: planning/epics/11-novels.md#ZY-11-07]
- [Source: planning/epics/12-economy.md#ZY-12-03]

### 测试标准
- 单元：解锁判定 / 幂等
- 集成：spend 失败回滚

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
