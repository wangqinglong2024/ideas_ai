# Story 3.6: 个人资料 + 头像

Status: ready-for-dev

## Story

As a 登录用户,
I want 查看与编辑个人资料（昵称 / 国家 / 偏好语言 / 头像）,
so that 个性化我的账号。

## Acceptance Criteria

1. `GET /v1/me` 返回当前用户公开 + 私有字段（不含 password_hash）。
2. `PATCH /v1/me { nickname?, country_code?, preferred_language?, avatar_key? }` 部分更新；zod 校验。
3. 昵称：1-30 字符，敏感词过滤；country_code ISO-3166 alpha-2；language ∈ `[en, zh, vi, th, hi]`。
4. 头像上传走 R2 presign：
   - `POST /v1/me/avatar/presign` → 返回 `{ upload_url, key, expires_in }`，限 5MB，content-type ∈ image/jpeg|png|webp
   - 客户端 PUT 直传 R2
   - `POST /v1/me/avatar/confirm { key }` → 校验对象存在 + 尺寸 < 5MB → 写入 `users.avatar_key`
5. 头像处理：异步 worker 生成 3 档 webp（96/256/512）；上传 R2；CDN URL 通过 `users.avatar_key` 派生。
6. 旧头像延迟删除（24h grace），避免缓存破坏。
7. 限流：avatar presign 同用户 1 分钟 5 次。
8. 测试：CRUD / 校验 / presign / confirm / 旧头像清理。

## Tasks / Subtasks

- [ ] Task 1: GET/PATCH /v1/me（AC: #1, #2, #3）
- [ ] Task 2: avatar presign + confirm（AC: #4, #7）
  - [ ] R2 SDK + presign helper
- [ ] Task 3: 异步 webp 生成 worker（AC: #5）
  - [ ] BullMQ job + sharp
- [ ] Task 4: 旧头像清理（AC: #6）
  - [ ] BullMQ delayed job
- [ ] Task 5: 测试（AC: #8）

## Dev Notes

### 关键约束
- avatar_key 存对象 key，不存完整 URL；CDN 域名前置在 SDK
- sharp 在 worker 跑，不阻塞 API
- 5MB 限制 + content-type 双校验（headers + magic bytes）

### 依赖链
- 依赖：3-1, 3-3, S01 1-11 BullMQ, S01 1-10（Supabase）, R2 bucket（cloudinit 在 S01）
- 被依赖：3-7, 3-10

### Project Structure Notes
```
apps/api/src/
  routes/me/{index,patch,avatar-presign,avatar-confirm}.ts
  workers/avatar-process.ts
  workers/avatar-cleanup.ts
  lib/r2.ts
```

### References
- [Source: planning/epics/03-user-account.md#ZY-03-06](../../epics/03-user-account.md)
- [Source: planning/spec/07-integrations.md#9-R2](../../spec/07-integrations.md)
- [Source: planning/ux/09-screens-app.md](../../ux/09-screens-app.md)

## Dev Agent Record

### Agent Model Used

(Filled by dev agent at execution time)

### Debug Log References

### Completion Notes List

### File List
