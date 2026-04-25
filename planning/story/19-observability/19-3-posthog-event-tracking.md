# Story 19.3: PostHog 行为埋点（FE + BE）

Status: ready-for-dev

## Story

作为 **产品 / 增长 / 数据**，
我希望 **PostHog 同时接入前端自动埋点与服务端关键事件埋点，并由统一的事件 schema 文档治理**，
以便 **构建漏斗、留存、A/B 实验，并支撑后续业务仪表板（19-5）和增长（20-6）**。

## Acceptance Criteria

1. **事件 schema 文档** `packages/analytics/EVENTS.md`：每事件含 name / category / payload schema (zod) / 触发时机 / owner / 隐私等级；MR 评审强制更新。
2. **FE auto-capture**：pageview / click / form-submit 默认开启；敏感页（支付 / 设置）`disable_session_recording=true`。
3. **FE 关键自定义事件**（最少集合）：
   - `auth.signup_completed` / `auth.login_completed`
   - `course.lesson_started` / `course.lesson_completed` / `course.streak_updated`
   - `game.session_started` / `game.session_completed`
   - `novel.chapter_read_completed`
   - `economy.coin_earned` / `economy.coin_spent`
   - `payment.checkout_started` / `payment.success` / `payment.failed`
   - `referral.invite_sent` / `referral.invite_accepted`
4. **BE 服务端事件**（绕过广告拦截器）：`payment.webhook_received` / `ai_factory.task_completed` / `cs.ticket_created` / `cs.ticket_resolved`，使用 `posthog-node`。
5. **identify / alias** 链路：anon → 注册成功调用 `alias`；登录调用 `identify(user_id, { country, plan, locale })`。
6. **属性卫生**：禁止上报邮箱 / 手机；email 仅作 `email_hash`；与 19-1 redact list 复用。
7. **采样 + 配额**：自由额度 1M events/月；prod 全采，preview 0.5；超阈值 19-6 告警。
8. **特性开关**：通过 PostHog Feature Flag 包裹灰度（与 20-5 联动）；FE/BE 共享 SDK；RSC 用 server flag。
9. 单元 + E2E：每个关键事件至少 1 条 fixture 触发并 assert payload。

## Tasks / Subtasks

- [ ] **Analytics 包**（AC: 1, 2, 3, 4, 5, 6）
  - [ ] `packages/analytics/src/{client,server,events,redact}.ts`
  - [ ] zod schema per event；`track(event, payload)` 强类型
  - [ ] EVENTS.md 完整模板
- [ ] **FE 集成**
  - [ ] `apps/web/app/providers/PostHogProvider.tsx`
  - [ ] 路由变化 pageview hook
  - [ ] 敏感页禁录制
- [ ] **BE 集成**（AC: 4）
  - [ ] `apps/api/src/lib/analytics.ts` + flush on shutdown
  - [ ] webhook handler / 工厂回调埋点
- [ ] **Feature Flag**（AC: 8）
  - [ ] `useFlag(key)` / `getFlag(req, key)` SSR/RSC
- [ ] **配额监控**（AC: 7）
  - [ ] daily cron 拉 PostHog usage api → 19-5 dashboard + 19-6 告警
- [ ] **测试**（AC: 9）
  - [ ] Playwright：注册 → 登录 → 课程 → 支付 全链路 events 断言

## Dev Notes

### 关键约束
- **PII**：邮箱 / 手机 / 真实姓名 一律不上报；`email_hash = sha256(lowercase(email))`。
- **anon_id**：Cookie 1y；登录后 `alias` 一次合并；禁止重复 alias 引发分身。
- **payload 大小** ≤ 32KB，超出截断 + warn。
- 事件名固定 `domain.action_object` 格式（小写下划线）；新增需更新 EVENTS.md。
- session_recording 仅在用户明确同意 cookies 后启用（合规联动 20-9）。
- 与 Sentry trace_id 关联：`$sentry_trace_id` 自定义属性。

### 关联后续 stories
- 19-5：业务仪表板从 PostHog 拉漏斗
- 19-8：Web Vitals 通过 PostHog capture
- 19-6：配额告警
- 20-5 / 20-6：Feature Flag + 增长漏斗
- 20-9：Cookie 合规

### Project Structure Notes
- `packages/analytics/`
- `apps/web/app/providers/PostHogProvider.tsx`
- `apps/api/src/lib/analytics.ts`
- `apps/cron/jobs/posthog-usage.ts`

### References
- [planning/epics/19-observability.md ZY-19-03](../../epics/19-observability.md)
- [planning/spec/07-integrations.md § 10](../../spec/07-integrations.md)
- [planning/spec/10-observability.md § 4.2, § 10](../../spec/10-observability.md)

### 测试标准
- 单元：每事件 zod schema 拒绝非法 payload
- E2E：注册→课程→支付完整链路事件 assert
- 隐私：grep payload 无 PII

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
