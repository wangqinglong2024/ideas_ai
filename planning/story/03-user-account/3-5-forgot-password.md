# Story 3.5: 找回密码

Status: ready-for-dev

## Story

As a 忘记密码的用户,
I want 通过邮箱链接重置密码，旧密码不可与最近 5 个相同,
so that 安全找回账号且避免密码重用。

## Acceptance Criteria

1. `POST /v1/auth/forgot-password { email }`：无论邮箱是否存在均返回 200（防枚举）；存在则发送重置邮件，含 1h 有效 token。
2. token 256-bit 随机；hash 存 `password_reset_tokens`；同用户多次申请 → 旧 token 立即失效。
3. `POST /v1/auth/reset-password { token, new_password }`：校验 token → 校验密码强度（同 3-2）→ 校验**最近 5 个密码不可重复**（`password_history` 表）→ bcrypt(12) 更新 → 删 token → 失效**所有 sessions** + 通知邮件。
4. 密码历史表：每次密码变更（注册 / 重置 / 修改）均插入；保留最近 10 条，自动清理。
5. 限流：同 email 申请 5 分钟 1 次；24h 最多 3 次；同 IP 1 分钟 5 次。
6. 邮件模板 4 语；按用户 `preferred_language`。
7. 安全审计日志：申请 / 成功 / 失败 全部记入 `audit_logs`。
8. 测试：正常 / 重复密码 / 过期 token / 重发 / 限流。

## Tasks / Subtasks

- [ ] Task 1: 表迁移（AC: #2, #4）
  - [ ] `0008_password_reset_tokens.sql`
  - [ ] `0009_password_history.sql`
- [ ] Task 2: forgot-password 路由（AC: #1, #2, #5）
- [ ] Task 3: reset-password 路由（AC: #3, #4）
  - [ ] sessions 全失效（删 Redis + 删 sessions 行）
- [ ] Task 4: 邮件模板（AC: #6）
- [ ] Task 5: audit log（AC: #7）
- [ ] Task 6: 测试（AC: #8）

## Dev Notes

### 关键约束
- 密码历史比对：bcrypt.compare 循环最近 5 条；CPU 友好
- 全失效 sessions：通过 sessions.user_id 查 jti 集合 → 批量 Redis del

### 依赖链
- 依赖：3-1, 3-2, 3-3
- 被依赖：3-10

### Project Structure Notes
```
apps/api/src/
  routes/auth/{forgot-password,reset-password}.ts
  migrations/0008_password_reset_tokens.sql
  migrations/0009_password_history.sql
  email/templates/{password-reset,password-changed}.{lang}.tsx
```

### References
- [Source: planning/epics/03-user-account.md#ZY-03-05](../../epics/03-user-account.md)
- [Source: planning/spec/04-backend.md](../../spec/04-backend.md)
- [Source: planning/spec/09-security.md](../../spec/09-security.md)

## Dev Agent Record

### Agent Model Used

(Filled by dev agent at execution time)

### Debug Log References

### Completion Notes List

### File List
