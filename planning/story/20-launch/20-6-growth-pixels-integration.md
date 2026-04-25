# Story 20.6: 增长接入（GTM / Meta Pixel / TikTok Pixel）

Status: ready-for-dev

## Story

作为 **增长 / 投放**，
我希望 **统一通过 Google Tag Manager 加载 Meta Pixel 和 TikTok Pixel，并联动 PostHog Funnel**，
以便 **付费投放可归因、CAC 可计算、再营销人群可构建，且 cookie 合规**。

## Acceptance Criteria

1. **GTM 容器**：营销站 + app 各一个；env 区分（prod/preview/staging）；CSP 允许 GTM 域名。
2. **加载时机**：必须在用户 cookie 同意（20-9）后注入；同意前不加载任何第三方脚本。
3. **Meta Pixel**：标准事件：`PageView / ViewContent / CompleteRegistration / InitiateCheckout / Purchase`；Conversion API（CAPI）服务端补发关键事件（去重 dedup_id）。
4. **TikTok Pixel**：`PageView / ViewContent / CompleteRegistration / InitiateCheckout / CompletePayment`；Events API 服务端补发。
5. **PostHog Funnel**：注册→首课→付费 漏斗 + 渠道维度（utm_source / utm_medium / utm_campaign）。
6. **UTM 解析**：所有进入营销站 / app 的 UTM 写入 cookie（30d）；注册时持久化到 `users.acquisition`；用于归因。
7. **去重**：服务端 + 客户端双发同一事件，必须 `event_id` 去重；测试矩阵 100% 通过。
8. **隐私**：advanced matching 仅传 `email_hash` / `phone_hash` / `country`；禁止明文 PII。
9. **测试**：Meta Test Events tool / TikTok Test Events 验证；CAPI 服务端事件可见。
10. **关停 / 切换**：每个 Pixel 可通过 admin Feature Flag 一键关停；故障 / 投放暂停场景。

## Tasks / Subtasks

- [ ] **GTM**（AC: 1, 2）
  - [ ] 容器 + tag/trigger/variable
  - [ ] 同意 trigger（cookie consent state）
- [ ] **Meta Pixel + CAPI**（AC: 3, 7, 8）
  - [ ] FE pixel via GTM
  - [ ] BE Conversion API（apps/api/src/lib/meta-capi.ts）
  - [ ] event_id 去重
- [ ] **TikTok Pixel + Events API**（AC: 4, 7, 8）
  - [ ] 同上模式
- [ ] **UTM**（AC: 6）
  - [ ] middleware 解析 + cookie
  - [ ] 注册时 persist
- [ ] **PostHog Funnel**（AC: 5）
  - [ ] dashboard JSON
- [ ] **Admin 开关**（AC: 10）
  - [ ] Feature Flag 包裹

## Dev Notes

### 关键约束
- **iOS 14.5+ ATT** + Safari ITP：FE Pixel 数据丢失高，CAPI 必须双发。
- GTM 不可放任何第三方代码不经审；CSP 严格白名单。
- email/phone 一律 hash（sha256, lowercase）后传；服务端再 hash 一次（avoid double-encoded mismatch）。
- 关停 Pixel 不影响 PostHog（自有数据兜底）。
- 投放归因优先级：UTM > Pixel > 自报问卷。

### 关联后续 stories
- 20-1 营销站 CTA 事件
- 20-9 Cookie 同意
- 19-3 PostHog 配额（Pixel 不影响 PH）

### Project Structure Notes
- `apps/marketing/components/GTM.tsx`
- `apps/web/components/GTM.tsx`
- `apps/api/src/lib/{meta-capi,tiktok-events}.ts`
- `infra/gtm/container-export.json`（备份）

### References
- [planning/epics/20-launch.md ZY-20-06](../../epics/20-launch.md)
- [planning/spec/07-integrations.md](../../spec/07-integrations.md)

### 测试标准
- 单元：UTM 解析 / hash 一致性
- 集成：Meta/TikTok Test Events 验证
- 隐私：Cookie 拒绝时 0 第三方请求

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
