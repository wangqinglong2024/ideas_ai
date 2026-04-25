# Story 3.9: 账号删除（GDPR）

Status: ready-for-dev

## Story

As a 用户,
I want 在符合 GDPR 的流程下删除账号 + 下载我的数据 + 30 天内可取消,
so that 我有完整数据控制权。

## Acceptance Criteria

1. `POST /v1/me/delete-account { password, confirm_email_token }`：
   - 校验当前密码（OAuth 用户跳过密码改用最近 OAuth 重认证）
   - 发送邮件确认链接 → 用户点击后完成软删
2. 软删：`users.deleted_at = now()`；标记后立即拒绝登录 / API（401 + reason "account_pending_deletion"）。
3. **30 天 grace**：cron 每日扫描 `deleted_at < now() - 30d` → 触发硬删 worker。
4. 硬删：所有用户相关表（sessions / oauth_accounts / progress / orders 摘要保留 / posts / 等）按 GDPR 范围删除或假名化（财务相关税法要求保留 5 年 → 假名化）。
5. `POST /v1/me/cancel-deletion` 30d 内调用：清 `deleted_at`；仅在该用户邮箱 + 密码可登录情况下（提供专用恢复登录端点）。
6. 数据下载：`POST /v1/me/data-export` 触发后台 worker → 30 分钟内生成 JSON + 头像 zip → 发链接邮件（24h 有效）。导出范围：profile / sessions（脱敏）/ progress / orders / posts / referrals。
7. 操作均记入 `audit_logs`（不可被硬删）。
8. 测试：软删 / 30d cron / 硬删 / 取消删除 / 数据导出格式。

## Tasks / Subtasks

- [ ] Task 1: 软删流程（AC: #1, #2）
  - [ ] 邮件确认 token 复用 3-2 模式
- [ ] Task 2: 软删后访问控制（AC: #2）
  - [ ] middleware 检查 deleted_at
- [ ] Task 3: 硬删 worker（AC: #3, #4）
  - [ ] BullMQ daily cron job
  - [ ] 财务表假名化（user_id → 'deleted-{uuid}'）
- [ ] Task 4: 取消删除（AC: #5）
  - [ ] 专用 recovery login 端点 `POST /v1/auth/recover-deleted`
- [ ] Task 5: 数据导出（AC: #6）
  - [ ] worker 生成 JSON + 打包到 R2
  - [ ] 邮件下载链接（presigned 24h）
- [ ] Task 6: audit log（AC: #7）
- [ ] Task 7: 测试（AC: #8）

## Dev Notes

### 关键约束
- GDPR Right to be Forgotten + Right to Data Portability
- 财务记录保留 5 年（PCI / 越南 / 中国法规）→ 假名化非删除
- 硬删 worker 必须事务 + 幂等（失败可重试）
- 数据导出：单用户 ≤ 100MB；超出分包

### 依赖链
- 依赖：3-1, 3-2, 3-3, 3-6, S01 1-11
- 被依赖：3-10, E18 安全

### Project Structure Notes
```
apps/api/src/
  routes/me/{delete-account,cancel-deletion,data-export}.ts
  routes/auth/recover-deleted.ts
  workers/{hard-delete-account,data-export}.ts
  middleware/check-deleted.ts
```

### Security
- OWASP A01
- 最小权限：硬删 worker 用 service_role + transaction

### References
- [Source: planning/epics/03-user-account.md#ZY-03-09](../../epics/03-user-account.md)
- [Source: planning/spec/09-security.md#4-Privacy](../../spec/09-security.md)

## Dev Agent Record

### Agent Model Used

(Filled by dev agent at execution time)

### Debug Log References

### Completion Notes List

### File List
