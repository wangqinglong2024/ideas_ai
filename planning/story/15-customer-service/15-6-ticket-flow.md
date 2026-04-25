# Story 15.6: 工单流（提交 / 分类 / 派单 / 状态流转 / 邮件通知）

Status: ready-for-dev

## Story

作为 **遇到非即时问题的用户 / 客服离线时的求助用户**，
我希望 **能提交工单并被自动分类 / 派单 / 邮件通知状态变更**，
以便 **复杂或异步问题不会丢失，处理过程透明可查**。

## Acceptance Criteria

1. **用户提交**：
   - 路由 `/me/support/new`：表单（category dropdown / subject / description / 附件 ≤3）。
   - 提交 → POST `/api/me/tickets` → 创建 ticket（status=open, priority=normal）。
   - 自动从 IM 兜底创建（15-3 兜底）：附 conversation_id + 自动汇总最近消息为 description。
2. **自动分类**（AI 建议）：
   - 调 15-8 AI 接口对 description 分类 → 写 ticket.category（用户可修改）。
   - 失败回退默认 'other'。
3. **派单**：
   - 按 category → 默认 assignee_admin_id（`ticket_dispatch_rules` 表配置）。
   - 默认 assignee 离线 → 进入「待认领」队列；agent 工作台 `/admin/cs/tickets/queue` 自取。
4. **状态流转**：
   - open → in_progress（agent 接手）。
   - in_progress → waiting_user（agent 回复并等用户）。
   - waiting_user → in_progress（用户回复）。
   - in_progress → resolved（agent 标记）。
   - resolved → closed（用户确认 / 7 天自动）。
   - 用户随时可重开（< 30 天）→ in_progress。
5. **邮件通知**（4 语模板）：
   - 提交确认。
   - agent 回复。
   - status 变 resolved 请求确认。
   - 工单关闭 + 满意度调查链接（5 星评分 + 备注）。
6. **agent 工作台**：
   - `/admin/cs/tickets`：列表 + 筛选 (status / priority / assignee / due) + sort。
   - 详情页：用户上下文 + 消息线程（与用户邮件 / 站内 双通道）。
7. **due_at 自动**：根据 priority 设置 due_at（low: 5d / normal: 2d / high: 8h / urgent: 2h）；超时 + 1h 升级 priority。
8. **附件**：图片 / PDF / log 文件 ≤ 10MB / 个；存 R2 / S3；URL 签名 24h 过期。
9. **批量操作**（supervisor）：批量重派 / 批量关闭。
10. **审计**：所有 status 转移 + assignee 变更落 `ticket_audit_logs`。

## Tasks / Subtasks

- [ ] **用户表单 + API**（AC: 1）
  - [ ] `apps/app/src/routes/me/support/new.tsx`
  - [ ] `apps/api/src/routes/me/tickets.ts`

- [ ] **自动分类**（AC: 2）
  - [ ] 调 15-8

- [ ] **派单规则**（AC: 3）
  - [ ] `ticket_dispatch_rules` 表 + admin UI
  - [ ] 待认领队列页

- [ ] **状态机 + 自动关闭**（AC: 4）
  - [ ] `packages/cs/ticket-state-machine.ts`
  - [ ] cron 每日扫描 resolved > 7d 自动 close

- [ ] **邮件 + 满意度**（AC: 5）
  - [ ] 4 模板 mjml
  - [ ] 满意度提交端点

- [ ] **agent UI**（AC: 6,9）
  - [ ] `apps/admin/src/routes/cs/tickets/`

- [ ] **due_at + 升级 cron**（AC: 7）
  - [ ] `apps/api/src/crons/ticket-sla-escalation.ts`

- [ ] **附件直传**（AC: 8）
  - [ ] presigned URL endpoint

- [ ] **审计**（AC: 10）

## Dev Notes

### 关键约束
- 用户邮件回复可入工单（15-9 离线兜底也用此通道）：`tickets+{id}@support.zhiyu.app`，inbound mail webhook 解析回填。
- 满意度评分链接 unique token，30 天有效，匿名可填。
- ticket_dispatch_rules 字段：category / language / assignee_admin_id / fallback_admin_id / priority。

### 关联后续 stories
- 15-3 兜底创建
- 15-8 AI 分类
- 15-9 邮件通道复用
- 15-10 SLA 报表

### Project Structure Notes
- `apps/api/src/routes/me/tickets.ts`
- `apps/api/src/routes/admin/cs/tickets/`
- `apps/api/src/crons/ticket-sla-escalation.ts`
- `packages/cs/ticket-state-machine.ts`
- `packages/email/templates/ticket-*.mjml`

### References
- `planning/epics/15-customer-service.md` ZY-15-06

### 测试标准
- 单元：状态机
- 集成：邮件回复 → 工单更新
- E2E：提交 → 派单 → 回复 → 关闭 → 满意度
- SLA：超时升级 cron 触发

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
