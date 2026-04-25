# Story 15.3: 客服派单服务 + 转接

Status: ready-for-dev

## Story

作为 **平台**，
我希望 **新会话按客服在线 / 负载 / 语言能力自动派给最合适的 agent，并支持转接 / 升级**，
以便 **用户等待最短，agent 负载均衡，复杂问题能升级到高阶 / 工单**。

## Acceptance Criteria

1. **agent 在线状态**：登录 + ws 连接 + presence 心跳（30s）维护 `agent_presence`（admin_id / status: online | away | busy | offline / current_load / languages text[] / skills text[] / last_heartbeat_at）。
2. **派单触发**：用户发起新会话（首条 message）→ `dispatcher.assign(conversationId)`：
   - 候选过滤：online 且 current_load < max_load (默认 5) 且 language ∈ agent.languages。
   - 优先级排序：load 升序 → skill match 降序 → 随机抖动。
   - 选定 agent → 更新 `conversations.agent_id` + 广播 `system:event` to conv & agent。
3. **离线兜底**：候选为空 → 转 15-6 工单（auto_create_ticket=true，附 conversation_id）+ 站内通知用户「客服离线，已为您建工单」。
4. **转接**：客服点击「转接」选其他 agent → `dispatcher.transfer(conversationId, fromAgentId, toAgentId, reason)`：
   - 校验 toAgent online + load 未满。
   - 更新 conversation.agent_id，写 system message「会话已转接给 {toAgent}」。
   - 双方 load 调整。
5. **升级**：客服点击「升级」→ 提升 conversation 优先级 + 通知 senior agent group + 不离开当前 agent（除非主动转接）。
6. **load 调整**：assigned/transfer 增；resolved/close 减；agent 离线 → load 强制为 0，未关闭会话回到队列重派。
7. **重派队列**：会话被解绑（agent 掉线 / 离职）→ enqueue `cs-redispatch`，1s 后重试 assign，失败 5 次 → 转工单。
8. **公平性**：60min 内 single agent 接单 ≤ 30 + 24h 内 ≤ 100；超限 status='busy' 强制不派。
9. **API**：
   - `POST /api/admin/cs/conversations/:id/transfer`
   - `POST /api/admin/cs/conversations/:id/escalate`
   - `POST /api/admin/cs/agent/presence`（agent 改自己 status）
10. **观测**：派单延迟 / 重派率 / 兜底工单率；告警阈值。

## Tasks / Subtasks

- [ ] **agent_presence 表 + presence API**（AC: 1,9）
  - [ ] `packages/db/schema/agent-presence.ts`
  - [ ] WS heartbeat handler 写 presence

- [ ] **dispatcher**（AC: 2,4,5,6,7）
  - [ ] `packages/cs/dispatcher.ts`
  - [ ] assign / transfer / escalate

- [ ] **重派队列**（AC: 7）
  - [ ] BullMQ `cs-redispatch`

- [ ] **公平性限制**（AC: 8）
  - [ ] redis sliding window counter per agent

- [ ] **离线兜底**（AC: 3）
  - [ ] 调 15-6 ticket service

- [ ] **观测**（AC: 10）
  - [ ] Prometheus + Grafana panel

## Dev Notes

### 关键约束
- agent.languages 来自 admin_users（E17 扩展字段）。
- 转接保留消息历史（不分会话）；UI 显示转接事件。
- 高峰期所有 agent busy → 显示用户「平均等待 X 分」（基于 last 30min 中位数）。

### 关联后续 stories
- 15-2 提供 WS 广播
- 15-5 工作台触发 transfer / escalate
- 15-6 工单兜底
- 15-10 SLA 拉指标

### Project Structure Notes
- `packages/cs/dispatcher.ts`
- `apps/api/src/routes/admin/cs/`
- `apps/ws-gateway/src/handlers/presence.ts`
- `packages/db/schema/agent-presence.ts`

### References
- `planning/epics/15-customer-service.md` ZY-15-03

### 测试标准
- 单元：候选过滤 / 排序
- 集成：assign → transfer → resolve → load 正确
- 压测：100 并发新会话派单 < 5s
- 故障：agent 掉线 → 重派

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
