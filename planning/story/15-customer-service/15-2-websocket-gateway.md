# Story 15.2: WebSocket 网关（Socket.io + Redis adapter）

Status: ready-for-dev

## Story

作为 **后端 / 前端开发者**，
我希望 **建立基于 Socket.io + Redis adapter 的多实例 WS 网关，支持 JWT 握手与房间隔离**，
以便 **用户与客服可低延迟双向通信，集群水平扩展不丢消息**。

## Acceptance Criteria

1. Node 服务 `apps/ws-gateway` 启动 Socket.io 服务（默认端口 3030）；HTTP path `/socket.io`；CORS 限本站域 + admin 域。
2. **Redis adapter**：`@socket.io/redis-adapter` + `@socket.io/redis-streams-adapter`（更可靠）；Redis 集群配置 Sentinel / Cluster mode；adapter 跨实例广播。
3. **JWT 握手**：`io.use(authMiddleware)` 验证 `auth.token` (JWT)；过期 / 无效 → 拒绝；提取 `userId` / `role` 挂 socket.data。
4. **房间机制**：
   - `user:{userId}`：每个登录用户自动加入。
   - `agent:{adminId}`：客服 agent 自动加入。
   - `conv:{conversationId}`：参与者动态加入 / 离开。
   - `agent-pool`：所有在线 agent 加入用于派单广播。
5. **事件 contract**（`packages/realtime/events.ts`）：
   - `message:send`（client→server）：{conversationId, contentType, contentText, contentPayload?} → 校验 → 写 DB → 广播 `message:new` 到 conv 房间 + `inbox:update` 到对方 user/agent 房间。
   - `message:read`（双向）：标 is_read。
   - `typing`（双向）：节流 2s。
   - `presence:update`（agent 上下线）。
   - `system:event`（server→client）：派单 / 转接 / 关闭。
6. **限流**：每 socket 每秒 ≤ 10 events；超出断开 1min。
7. **心跳与重连**：默认 ping 25s / timeout 60s；客户端断线 → 5 次指数退避重连；恢复后拉缺失消息（`GET /api/conversations/:id/messages?since=`）。
8. **持久化解耦**：`message:send` 先入 BullMQ `cs-message-persist` 队列再异步写 DB（保证 < 50ms ack）；DB 失败 → 客户端收 `message:error` 重发。
9. **可观测**：Prometheus exporter（连接数 / 消息率 / latency p95）；Sentry 接入。
10. **横向扩展**：3 实例并发 10k 连接；P95 端到端 < 300ms。

## Tasks / Subtasks

- [ ] **服务骨架**（AC: 1）
  - [ ] `apps/ws-gateway/src/index.ts`
  - [ ] Dockerfile + k8s deploy

- [ ] **Redis adapter**（AC: 2）
  - [ ] `apps/ws-gateway/src/adapter.ts`

- [ ] **认证中间件**（AC: 3）
  - [ ] `apps/ws-gateway/src/middleware/auth.ts`

- [ ] **房间管理**（AC: 4）
  - [ ] `apps/ws-gateway/src/rooms.ts`

- [ ] **事件处理**（AC: 5,6,8）
  - [ ] `apps/ws-gateway/src/handlers/`
  - [ ] zod schema 校验
  - [ ] 限流（rate-limiter-flexible）

- [ ] **持久化 worker**（AC: 8）
  - [ ] `apps/api/src/workers/cs-message-persist.ts`

- [ ] **客户端 SDK**（AC: 7）
  - [ ] `packages/realtime/client.ts` + 重连 + 缺失补拉

- [ ] **观测 + 压测**（AC: 9,10）
  - [ ] k6 ws 10k 连接

## Dev Notes

### 关键约束
- Socket.io v4+；adapter 用 streams 模式（v2）以支持 ack。
- JWT 通过 `auth` 字段而非 query，避免日志泄漏。
- conv 房间动态加入：客户端 `conversation:join` 事件触发。
- agent role 在握手时校验，普通用户禁用 agent-pool 加入。

### 关联后续 stories
- 15-3 派单使用 agent-pool 广播
- 15-4 用户端 SDK
- 15-5 客服端 SDK
- 15-9 离线兜底转邮件

### Project Structure Notes
- `apps/ws-gateway/`
- `packages/realtime/`
- `apps/api/src/workers/cs-message-persist.ts`

### References
- `planning/epics/15-customer-service.md` ZY-15-02
- `planning/spec/12-realtime-and-im.md` § 3-5

### 测试标准
- 单元：auth middleware
- 集成：跨实例广播
- 压测：10k 连接 P95 < 300ms
- Chaos：Redis 重启不丢连

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
