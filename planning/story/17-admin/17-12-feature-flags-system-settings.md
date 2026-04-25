# Story 17.12: Feature Flags + 系统设置

Status: ready-for-dev

## Story

作为 **运营 / 工程**，
我希望 **管理 Feature Flags（含灰度规则）与系统全局设置（汇率 / 知语币规则等）**，
以便 **支持发布灰度、A/B 实验与运营参数动态调整，所有改动可审计**。

## Acceptance Criteria

### Feature Flags
1. 路由 `/admin/flags`：列表 / 新建 / 编辑。
2. Flag 字段：`key unique` / `name` / `description` / `enabled` / `rules: jsonb` / `default: bool` / `updated_at` / `updated_by`。
3. **规则**：支持百分比（0-100）、用户白名单（user_ids[]）、国家、语言、订阅状态、版本号等组合（AND/OR）。
4. **运行时**：服务端 `featureFlags.isEnabled(key, ctx)` + 前端 `useFlag(key)`；缓存 TTL 30s（Redis）。
5. **预设 flag**：`factory.global_pause`（与 16-12 联动）/ `economy.checkin_v2` / `referral.l2_enabled` / `payment.lemonsqueezy_enabled` 等。
6. **历史**：每次变更写历史表；可一键回滚。

### 系统设置
7. 路由 `/admin/settings`：分组（汇率 / 知语币 / 邮件模板 / R2 / SLA / TTS 配额 / 限速）。
8. **汇率**：USD → 各国本币；支持手动 + cron 拉取（v1.5）。
9. **知语币规则**：earn rules（每篇 / 每节 / 每游戏 / 每章 上限）；与 12-9 admin-rule-config 共享 schema（同表 `economy_rules`）。
10. **邮件模板**：4+1 语；变量预览。
11. **限速 / 配额**：API rate limit / TTS chars 配额，热更新（写 Redis）。
12. **导出 / 导入**：JSON 备份 + 恢复。
13. **审计**：所有变更 audit_logs（severity=high for flags / 汇率）。
14. **权限**：`flags:read|write` / `settings:read|write` / `settings:critical`（关键设置 critical role）。
15. e2e 测试。

## Tasks / Subtasks

### Feature Flags
- [ ] **Schema + 历史**（AC: 2, 6）
- [ ] **API**（AC: 1, 3）
- [ ] **运行时 SDK**（AC: 4）
- [ ] **UI**（AC: 1, 3, 6）

### 系统设置
- [ ] **Schema + API**（AC: 7-11）
- [ ] **UI 分组**（AC: 7-10）
- [ ] **导入导出**（AC: 12）
- [ ] **审计 + 权限**（AC: 13, 14）
- [ ] **测试**（AC: 15）

## Dev Notes

### 关键约束
- flags 缓存 30s 平衡实时性与 Redis 压力；紧急切换可显式 `flush`。
- 规则 evaluator：纯函数，输入 ctx 返回 bool；单元测试覆盖 AND/OR/百分比 hash 稳定性。
- 百分比 hash：sha256(`${flag_key}:${user_id}`) % 100，确保用户在多次请求中稳定命中或不命中。
- 系统设置某些字段（汇率 / 知语币）需 critical role 二次确认 + 审计。
- economy_rules 与 12-9 共享，避免双源数据；UI 路由互链接。

### 关联后续 stories
- 17-1 ~ 17-4
- 12-9 admin-rule-config（共表）
- 16-12 factory.global_pause flag
- 18-5 audit logs

### Project Structure Notes
- `apps/admin/src/pages/flags/`
- `apps/admin/src/pages/settings/`
- `apps/api/src/routes/admin/{flags,settings}/`
- `packages/feature-flags/src/runtime.ts`
- `packages/feature-flags/src/react.tsx`

### References
- `planning/epics/17-admin.md` ZY-17-12

### 测试标准
- 单元：规则 evaluator
- 集成：flag 切换 → 服务行为变化
- 安全：critical role 二次确认；导出包含全字段

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
