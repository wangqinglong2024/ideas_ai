# Story 3.8: 设备 / 会话管理

Status: ready-for-dev

## Story

As a 登录用户,
I want 查看当前所有登录设备并能远程登出指定 / 全部设备,
so that 账号被借用后能立即收回。

## Acceptance Criteria

1. `GET /v1/me/sessions` 返回当前用户所有 active sessions：`id / device_label / ip / country / user_agent / last_active_at / created_at / current: bool`。
2. `DELETE /v1/me/sessions/:id` 远程登出指定 session：删 sessions 行 + 删 Redis refresh key；不能删除 current（除非 logout）。
3. `DELETE /v1/me/sessions` 全部登出（除当前）：批量删除其他 sessions 行 + Redis keys。
4. `last_active_at` 在每次 access token 校验时增量更新（节流：5 分钟一次）。
5. 设备识别：UA 解析出 OS / Browser / Device class，存 `sessions.device_label`（如 "Chrome on macOS"）。
6. 安全：操作均需 access token；危险操作（全部登出）建议 step-up（v1.5）。
7. 测试：列表 / 删除 / 拒绝删除 current / 全部登出。

## Tasks / Subtasks

- [ ] Task 1: GET /v1/me/sessions（AC: #1, #5）
  - [ ] ua-parser-js
- [ ] Task 2: DELETE /:id + 全部（AC: #2, #3, #6）
- [ ] Task 3: last_active_at 节流更新（AC: #4）
  - [ ] middleware + Redis throttle key
- [ ] Task 4: 测试（AC: #7）

## Dev Notes

### 关键约束
- current session 通过 access token 内 jti 与 sessions.refresh_token_jti 关联（约定）
- Redis 删除使用 SCAN + DEL；规模考虑：单用户 sessions 上限 ≈ 10
- ua-parser-js 体积 ~50KB；可接受

### 依赖链
- 依赖：3-1, 3-3
- 被依赖：3-10

### Project Structure Notes
```
apps/api/src/
  routes/me/sessions/{list,delete-one,delete-all}.ts
  middleware/last-active.ts
  lib/ua-parse.ts
```

### References
- [Source: planning/epics/03-user-account.md#ZY-03-08](../../epics/03-user-account.md)
- [Source: planning/spec/04-backend.md](../../spec/04-backend.md)

## Dev Agent Record

### Agent Model Used

(Filled by dev agent at execution time)

### Debug Log References

### Completion Notes List

### File List
