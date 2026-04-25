# Story 12.9: 后台规则配置

Status: ready-for-dev

## Story

作为 **运营管理员**，
我希望 **在后台调节获得规则与单日上限，并保留审计日志**，
以便 **按经济模型快速调参不发版**。

## Acceptance Criteria

1. 管理员页 `/admin/coins/rules` 列表 / 编辑 `coins_earning_rules` 行（base_amount / daily_cap / cooldown / enabled / conditions）。
2. 编辑后立即生效（API 缓存 60s 内可接受）。
3. 审计：每次变更写 `audit_log(actor, action, target, before, after, ip, ua, ts)`。
4. 校验：base_amount ≥ 0 / daily_cap ≥ 0 / cooldown ≥ 0；conditions 必须合法 jsonb。
5. 权限：仅 `role in (admin, ops)` 可访问（E17 RBAC）。
6. 灰度：可对单规则置 `enabled=false` 立即停发（不删行）。
7. 国际化：管理员 UI 中文 + 英文。
8. 历史：列表显示 last_updated_by + ts。

## Tasks / Subtasks

- [ ] 管理 UI（AC: 1,7）
- [ ] CRUD API + RBAC（AC: 5）
- [ ] 审计接入（AC: 3）
- [ ] 校验（AC: 4）
- [ ] 缓存失效（AC: 2）
- [ ] 测试

## Dev Notes

### 关键约束
- 与 E17 admin 框架一致（侧边栏 / 权限）。
- audit_log 通用表（E18 安全 / E17 admin 通用）。

### Project Structure Notes
- `apps/admin/src/pages/coins/rules.tsx`
- `apps/api/src/routes/admin/coins-rules.ts`

### References
- [Source: planning/epics/12-economy.md#ZY-12-09]

### 测试标准
- e2e：编辑 → 立即生效 + 审计

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
