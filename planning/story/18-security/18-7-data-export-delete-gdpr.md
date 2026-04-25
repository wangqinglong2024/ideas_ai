# Story 18.7: 数据下载 + 删除（GDPR / PDPA）

Status: ready-for-dev

## Story

作为 **C 端用户**，
我希望 **一键下载我的全部数据并提交账号删除请求**，
以便 **行使 GDPR / PDPA 规定的数据可携权与被遗忘权**。

## Acceptance Criteria

1. **数据下载** `POST /api/me/export` 创建异步任务；任务完成后邮件 + 站内信附带签名下载链接（24h 过期）；导出格式 JSON（zip）。
2. 导出范围：profile / sessions / orders / subscriptions / coins_ledger / referral / favorites / notes / progress / mistakes / vocab / chats（与 CS）/ legal_consents。
3. 单用户限制：30d 内最多 1 次导出；超出友好提示。
4. **数据删除** `POST /api/me/delete`：进入 30d 软删队列；用户在窗口期内可撤销（`POST /api/me/delete/cancel`）；30d 后 cron 永久删除。
5. **永久删除范围**：用户表 + 关联表（含分销关系 anonymize 但保留聚合统计）；ZC ledger 合规保留 7 年（匿名化 user_id → null）；orders / refunds 保留（监管要求）但 PII 脱敏。
6. **DPA 第三方覆盖**：删除时同步触发：Paddle 客户记录注销 / PostHog `$delete` API / Sentry user purge / Supabase Auth 删除 / R2 用户上传文件批删。
7. **审计**：每个 export / delete 操作 audit_logs（severity=high）+ 邮件通知用户。
8. **认证**：删除请求要求二次密码或 OTP 确认；导出请求只需登录。
9. **状态查询** `GET /api/me/data-rights/status`：返回 export / delete 当前状态。
10. **后台支持**：admin 在 17-5 用户详情可代发起请求（需用户邮件确认 link 后生效）。
11. **法律边界**：用户提出删除但有未结订单 / 客服争议时，可暂缓 + 解释（`status='blocked', reason`）。
12. e2e 测试覆盖 export / delete / cancel / 30d cron。

## Tasks / Subtasks

- [ ] **导出任务**（AC: 1-3）
  - [ ] BullMQ job 聚合多张表
  - [ ] zip + sign URL（R2 + signed presign）
- [ ] **删除流程**（AC: 4-6, 11）
  - [ ] 软删队列 + 撤销
  - [ ] 30d cron 永久删除
  - [ ] 第三方调用矩阵
- [ ] **认证 + 二次确认**（AC: 8）
- [ ] **状态查询**（AC: 9）
- [ ] **后台代发起**（AC: 10）
- [ ] **审计 + 邮件**（AC: 7）
- [ ] **测试**（AC: 12）

## Dev Notes

### 关键约束
- 删除范围矩阵必须有文档 `docs/security/gdpr-delete-matrix.md`（每张表 keep / anonymize / drop / archive 决策）。
- 导出 JSON 大于 100MB 拆分多文件 + 索引清单；签名 URL 24h 过期。
- 第三方调用失败必须重试并记录：失败 3d 仍未完成 → 告警 + 法务介入。
- 用户在删除窗口期内登录会触发提醒 banner + 取消按钮。
- 保留义务（订单 / 税务）VS 删除权冲突：法务定义保留 7 年，PII 字段脱敏（仍可识别但仅业务必要）。

### 关联后续 stories
- E03 用户账号
- 18-5 audit
- 18-6 隐私政策互链
- 17-5 admin 用户管理

### Project Structure Notes
- `apps/api/src/routes/me/data-rights.ts`
- `apps/api/src/jobs/data-export.ts`
- `apps/api/src/jobs/data-delete-cron.ts`
- `packages/security/src/third-party-purge/{paddle,posthog,sentry,supabase,r2}.ts`
- `docs/security/gdpr-delete-matrix.md`

### References
- `planning/epics/18-security.md` ZY-18-07
- `planning/epics/03-user-account.md` 3-9

### 测试标准
- e2e：完整 export → 下载；delete → 30d cron 执行
- 第三方：mock 响应矩阵
- 安全：导出链接 25h 后 403

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
