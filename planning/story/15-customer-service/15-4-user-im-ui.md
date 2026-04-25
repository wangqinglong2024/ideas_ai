# Story 15.4: 用户端 IM UI

Status: ready-for-dev

## Story

作为 **遇到问题的用户**，
我希望 **点击右下角浮动按钮即可弹出 IM 抽屉与客服对话，支持文字 / 图片 / 表情 + 历史滚动**，
以便 **不离开当前页面就能获得帮助**。

## Acceptance Criteria

1. **浮动按钮**（FAB）：右下角圆形按钮，带未读小红点（来自 `inbox:update` 事件）；登录态可见，未登录隐藏（或引导登录）。
2. **抽屉/Drawer**：
   - 桌面：右侧 400px 滑出。
   - 移动：全屏 drawer。
   - 头部：客服头像 + 名 + 状态徽章；未派单显示「正在为您匹配客服…」。
3. **消息列表**：
   - 默认拉最近 50 条（`GET /api/me/conversations/:id/messages`）。
   - 滚动到顶继续加载更早 50 条。
   - 自己消息靠右气泡，客服靠左；system 居中灰条。
   - 时间戳分组（每 10min 显示一次）。
   - 已读回执：客服气泡下方「已读」。
4. **输入区**：
   - textarea 自适应（最多 6 行）。
   - 表情面板（emoji-mart）。
   - 图片上传（直传 R2 / S3，client-side 压缩 < 1MB，wide 1280px）。
   - 快捷回复按钮组（如「我要退款」「忘记密码」→ 自动填入）。
   - Enter 发送，Shift+Enter 换行。
5. **WS 接入**：使用 `packages/realtime/client.ts`：
   - 进入抽屉 → emit `conversation:join`。
   - 输入中 → emit `typing`（节流 2s）。
   - 收 `message:new` 实时追加 + 滚到底（用户在底部时）/ 角标提示（不在底部时）。
   - 收 `system:event` 渲染对应 UI（派单 / 转接 / 已关闭）。
6. **离线状态**：用户网络断开 → 显示「连接已断开，重连中」横幅；重连后自动 sync 缺失消息。
7. **首次问候**：新会话第一条消息后 5s 内未派单 → 系统消息「客服正在赶来，请稍等…」+ FAQ 推荐（15-7）。
8. **历史会话列表**：在抽屉顶部「历史」按钮 → `/me/support/history`：列出过去 conversations + 状态。
9. **i18n** 4 语；A11y：键盘可达 / aria-live 区域更新（屏幕阅读器朗读新消息）。
10. **性能**：抽屉首次打开 < 300ms；长列表 1000 条虚拟滚动 60fps。

## Tasks / Subtasks

- [ ] **FAB + 未读**（AC: 1）
  - [ ] `apps/app/src/features/support/SupportFab.tsx`

- [ ] **抽屉容器**（AC: 2,8）
  - [ ] `apps/app/src/features/support/SupportDrawer.tsx`
  - [ ] history 路由

- [ ] **消息列表 + 虚拟滚动**（AC: 3,10）
  - [ ] react-virtuoso
  - [ ] `MessageBubble`, `SystemMessage`, `DateDivider`

- [ ] **输入区 + 上传**（AC: 4）
  - [ ] `MessageComposer.tsx`
  - [ ] 图片直传 hook

- [ ] **WS 集成**（AC: 5,6）
  - [ ] `useConversationSocket` hook

- [ ] **首次问候 + FAQ**（AC: 7）
  - [ ] 5s timer + FAQ 推荐组件（复用 15-7）

- [ ] **i18n + a11y + 性能**（AC: 9,10）

## Dev Notes

### 关键约束
- 未读小红点逻辑基于 `messages.is_read_by_user=false`；进入会话标已读。
- 上传必须 client 压缩（避免移动网络浪费）。
- 从其他页面切换路由不应断开 WS（全局 socket）。

### 关联后续 stories
- 15-2 WS 客户端
- 15-7 FAQ 推荐嵌入
- 15-9 离线显示「客服离线，已为您建工单」

### Project Structure Notes
- `apps/app/src/features/support/`
- `apps/app/src/routes/me/support/history.tsx`

### References
- `planning/epics/15-customer-service.md` ZY-15-04
- `planning/prds/11-customer-service/`

### 测试标准
- 单元：composer keybinds
- E2E：发送 → 实时收 → 已读
- 视觉：4 语 + 桌面/移动 截图
- A11y：axe + 屏幕阅读器手测

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
