# Story 11.8: 追更通知

Status: ready-for-dev

## Story

作为 **追更读者**，
我希望 **收藏的小说有新章节时收到通知**，
以便 **第一时间阅读**。

## Acceptance Criteria

1. 后台发布章节（`status: published`）触发事件 → BullMQ 任务扫描收藏用户。
2. 通知通道：站内通知 + 邮件（默认）+ Web Push（用户开启后）。
3. 通知偏好：`notification_prefs(user_id, channel, novel_update_enabled)`；用户可关闭。
4. 频次合并：单用户单小说 24h 内多次更新合并为 1 条（"更新了 X 章"）。
5. 通知文案：4 语模板；含小说名 / 最新章标题 / 跳转链接。
6. 退订：每封邮件含一键退订；站内一键关闭追更。
7. 审计：通知发送日志。
8. 失败重试：最多 3 次。

## Tasks / Subtasks

- [ ] 发布事件订阅 + worker（AC: 1,4,8）
- [ ] 多通道发送（AC: 2）
- [ ] 偏好表 + UI（AC: 3,6）
- [ ] 模板 i18n（AC: 5）
- [ ] 审计 + 测试

## Dev Notes

### 关键约束
- 邮件走 E15 / 通用邮件服务；Web Push 走 PWA 通道（如已接入）。
- 24h 合并窗口：使用 Redis 滑窗 key。

### Project Structure Notes
- `apps/api/src/workers/novel-update-notify.ts`
- `packages/db/schema/notification-prefs.ts`
- `packages/i18n/locales/*/notifications.json`

### References
- [Source: planning/epics/11-novels.md#ZY-11-08]

### 测试标准
- 集成：发布 → 收到通知 / 合并 / 退订

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
