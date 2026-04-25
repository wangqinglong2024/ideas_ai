# Story 5.9: 通知中心 sheet

Status: ready-for-dev

## Story

作为 **App 用户**，
我希望 **顶栏通知图标点击后弹出通知列表**，
以便 **不离开当前页就能查看 / 处理通知**。

## Acceptance Criteria

1. 顶栏通知图标点击 → 右侧抽屉 sheet（移动端全屏 sheet）。
2. 列表项：图标 + 标题 + 摘要 + 时间（相对）+ 已读状态。
3. 类型过滤：全部 / 系统 / 学习 / 评论（后端类型枚举）。
4. 点击单条 → 跳对应业务页 + 标记已读。
5. 顶部「全部已读」按钮：调用 `POST /api/notifications/read-all`。
6. 列表分页（20/页，下拉加载更多）。
7. 红点数 = 未读总数；标记已读后红点同步。
8. 空态文案 + 4 语 i18n。
9. WebSocket / SSE 可选；MVP 用 30s polling 实现。

## Tasks / Subtasks

- [ ] **API 接入**（AC: 1-7）
  - [ ] `GET /api/notifications?type=&page=&size=`
  - [ ] `POST /api/notifications/:id/read`
  - [ ] `POST /api/notifications/read-all`
  - [ ] `GET /api/notifications/unread-count`（已在 5-6 使用）

- [ ] **组件实现**（AC: 1,2,3,8）
  - [ ] `<NotificationSheet>` 含 Tabs（全部 / 系统 / 学习 / 评论）
  - [ ] 列表 + 时间相对化（`dayjs.fromNow`）

- [ ] **分页**（AC: 6）
  - [ ] 使用 `useInfiniteQuery`

- [ ] **已读联动**（AC: 4,5,7）
  - [ ] 单条点击：mutation + 跳转
  - [ ] 全部已读 mutation
  - [ ] 成功后 invalidate unread-count

- [ ] **轮询**（AC: 9）
  - [ ] `refetchInterval: 30_000` 仅在 sheet 打开时

- [ ] **i18n**（AC: 8）

## Dev Notes

### 关键约束
- 30s 轮询在 App 后台时浏览器会节流，可接受。
- 跳转目标 URL 由通知 payload `url` 字段决定，需做 URL 白名单校验防注入。

### 关联后续 stories
- 5-6 顶栏触发
- 后续 E03 / E07 等模块产生通知

### Project Structure Notes
- `apps/app/src/components/NotificationSheet.tsx`
- `apps/app/src/hooks/use-notifications.ts`

### References
- `planning/epics/05-app-shell.md` ZY-05-09

### 测试标准
- 单元：URL 白名单
- E2E：打开 → 点击 → 跳转 → 红点更新
- E2E：全部已读 → 红点清零

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
