# Story 15.5: 客服后台 IM 工作台

Status: ready-for-dev

## Story

作为 **在线客服 agent**，
我希望 **在 `/admin/cs/workbench` 多会话 tab 切换、查看用户上下文（订单 / 学习）、用快捷回复 + 转工单**，
以便 **高效服务多个用户、避免重复劳动、顺畅升级**。

## Acceptance Criteria

1. 路由 `/admin/cs/workbench`（角色 cs_agent / cs_supervisor 可访问）；左侧会话队列、中间消息区、右侧用户上下文面板。
2. **会话队列**：
   - 我的会话（当前 assigned）+ 转给我的 + 团队池（cs_supervisor 可见）。
   - 列表项：用户脱敏名 / 最后消息预览 / 时间 / 未读徽章 / status。
   - 实时更新（WS `inbox:update`）。
3. **消息区**：
   - 复用消息组件（与 15-4 风格一致）。
   - 消息上下文操作：标重要 / 引用 / 复制。
   - 显示用户正在输入指示。
4. **用户上下文面板**：
   - 用户档案（display_name / level / hsk / country / 注册时间 / 付费状态）。
   - 最近 5 笔订单 + 订阅状态。
   - 当前学习（最近 enrollment / progress）。
   - 待处理 tickets。
   - 一键「跳订单详情」「跳工单」。
5. **快捷回复**：
   - 个人快捷库（admin 自维护）+ 团队共享库。
   - 触发 `/` 弹出筛选器，回车填入。
   - 模板支持变量 `{{user.display_name}}`。
6. **操作**：
   - 「转接给…」「升级」「转工单」「关闭会话」「设满意度调查」。
   - 关闭前必填「解决类型 + 备注」（落 conversations.metadata）。
7. **多 tab**：可同时打开 ≤ 6 会话；超出新会话进入队列；tab 标题闪烁未读。
8. **键盘操作**：Cmd+Enter 发送 / Cmd+K 搜索快捷回复 / Cmd+1-9 切换 tab。
9. **i18n**（agent 语言独立设置）；快捷回复模板分语种。
10. **性能**：1000 历史消息虚拟滚动；切换会话 < 100ms。

## Tasks / Subtasks

- [ ] **页面布局**（AC: 1）
  - [ ] `apps/admin/src/routes/cs/workbench.tsx`

- [ ] **会话队列**（AC: 2,7）
  - [ ] `<ConversationQueue />` + WS 订阅

- [ ] **消息区 + 操作**（AC: 3,6）
  - [ ] 复用 messaging 组件
  - [ ] CloseModal 含解决类型

- [ ] **上下文面板**（AC: 4）
  - [ ] `GET /api/admin/cs/users/:id/context` 聚合接口
  - [ ] 卡片组件

- [ ] **快捷回复**（AC: 5）
  - [ ] `quick_replies` 表 (id / admin_id nullable / team_shared / lang / title / template)
  - [ ] 编辑 UI + 触发器

- [ ] **键盘 + i18n**（AC: 8,9）

- [ ] **性能**（AC: 10）

## Dev Notes

### 关键约束
- 上下文面板请求需脱敏：不展示完整 email / phone（除非 supervisor）。
- 关闭会话必须有解决类型用于 SLA 报表。
- supervisor 可旁观团队池所有会话；普通 agent 只看自己 + 转入。

### 关联后续 stories
- 15-2 WS
- 15-3 派单 / 转接调用
- 15-6 转工单
- 15-8 AI 建议嵌入
- 15-10 SLA 报表

### Project Structure Notes
- `apps/admin/src/routes/cs/workbench.tsx`
- `apps/admin/src/features/cs/`
- `apps/api/src/routes/admin/cs/users/[id]/context.ts`
- `packages/db/schema/quick-replies.ts`

### References
- `planning/epics/15-customer-service.md` ZY-15-05

### 测试标准
- 集成：上下文聚合接口 < 200ms
- E2E：转接 → 升级 → 关闭 全流程
- 视觉：4 语 截图

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
