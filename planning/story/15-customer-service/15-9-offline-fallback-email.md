# Story 15.9: 离线兜底（邮件 + 站内 + push）

Status: ready-for-dev

## Story

作为 **平台**，
我希望 **客服全员离线 / 用户离线时消息不丢，自动通过邮件 / 站内 / push 兜底**，
以便 **任何场景沟通不中断**。

## Acceptance Criteria

1. **客服全员离线** → 用户发起新会话 / 发新消息：
   - 派单失败（15-3 兜底）→ 自动建工单（15-6），并在 IM 展示「客服离线，已为您建工单 #XXX，预计 X 小时回复」。
   - 已存在会话最后 agent 离线 ≥ 5min → 转工单 + 系统消息提示。
2. **用户离线（client 未连）** → agent 发消息：
   - 写 DB；标 `is_read_by_user=false`。
   - 触发 push（FCM/APNs）：标题「客服回复」+ 摘要 ≤ 80 字符。
   - 触发邮件：5min 内未读 → 发送邮件「您有新客服消息」附摘要 + 进入会话链接。
   - 用户上线读消息 → 取消未发送邮件队列。
3. **邮件双向**：
   - 出站：mjml 模板 4 语。
   - 入站：用户回复 `tickets+{ticketId}@support.zhiyu.app` → 解析（mailgun / postmark webhook）→ 写 ticket message + 通知 agent。
   - DKIM/SPF/DMARC 通过。
4. **去重与节流**：
   - 同会话 push 节流：30s 内多条合并为 1 条「{n} 条新消息」。
   - 邮件节流：同会话每 1h 至多 1 封（除非用户回邮件触发新轮）。
5. **用户偏好**：`notification_preferences.cs_email` / `cs_push` 可关。
6. **离线消息存储期**：消息表永久保存；通知队列保留 7 天。
7. **失败重试**：push / 邮件失败 BullMQ 重试 1m / 5m / 30m / 2h，4 次后 DLQ + 监控告警。
8. **Inbound 邮件附件**：≤ 10MB；上传 R2；URL 写入 message payload。
9. **观测**：兜底触发量 / 邮件回复率 / push CTR；告警阈值。
10. **降级**：邮件服务挂掉 → 仅 push + 站内；用户偏好关 push 且邮件挂 → 仅站内 + banner 警告。

## Tasks / Subtasks

- [ ] **离线兜底逻辑**（AC: 1,2,4）
  - [ ] `packages/cs/offline-fallback.ts`
  - [ ] 联通 15-3 派单 / 15-6 工单

- [ ] **push 通道**（AC: 2,4）
  - [ ] 调 E20 push service
  - [ ] 节流合并

- [ ] **出站邮件**（AC: 2,3,4）
  - [ ] mjml 4 语模板
  - [ ] BullMQ delayed job 5min

- [ ] **入站邮件 webhook**（AC: 3,8）
  - [ ] `apps/api/src/routes/webhooks/mailgun-inbound.ts`
  - [ ] 解析 + 附件存 R2 + 写 message

- [ ] **DKIM/SPF/DMARC**（AC: 3）
  - [ ] DNS 记录 + 文档

- [ ] **重试 + DLQ**（AC: 7）

- [ ] **观测 + 降级**（AC: 9,10）

## Dev Notes

### 关键约束
- 邮件 alias `support+{ticketId}@` 也支持（路由层兼容两种）。
- 防垃圾：入站邮件需校验 `In-Reply-To` 或 `References` 含原始 ticket id。
- push 摘要不含敏感（订单号 / 金额）。

### 关联后续 stories
- 15-2 / 15-3 / 15-6
- E20 push 服务

### Project Structure Notes
- `packages/cs/offline-fallback.ts`
- `apps/api/src/routes/webhooks/mailgun-inbound.ts`
- `packages/email/templates/cs-offline-*.mjml`

### References
- `planning/epics/15-customer-service.md` ZY-15-09

### 测试标准
- 集成：用户离线 → push + 5min 后邮件
- E2E：用户邮件回复 → 工单更新 + agent 通知
- Chaos：邮件服务挂 → 降级至 push

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
