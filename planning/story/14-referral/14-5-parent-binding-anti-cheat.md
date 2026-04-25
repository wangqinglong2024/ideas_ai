# Story 14.5: 上级关系建立 + 反作弊拒绑

Status: ready-for-dev

## Story

作为 **平台 / 反作弊系统**，
我希望 **新用户绑定上级时实时识别欺诈信号并拒绑或标 suspicious**，
以便 **避免「自我邀请」「IP 农场」「设备指纹同源」「短时间集团注册」等套利行为**。

## Acceptance Criteria

1. `referralService.bindParent(childUserId, code)`：
   - 校验 code 存在；找到 inviter（l1）；inviter ≠ child（不能自邀）。
   - 反作弊检查（下方 AC 2-5）通过 → 写 `referral_relations(child, l1, l2, source_ip, source_device_id, source_country)`。
   - 检查不通过 → 仍写但 `is_suspicious=true` + reason 字符串；commission 在 14-6/14-7 时被冻结（不进 confirm）。
2. **设备指纹同源（拒绑）**：
   - child 与 l1 的最近 5 个设备指纹有 ≥1 相同 → **拒绑**（不写 referral_relations）+ 记 `referral_anti_cheat_logs`（reason=device_match）。
3. **同 IP 24h 集群（标 suspicious）**：
   - 同 IP 24h 内同 l1 注册 ≥4 → 全部标 suspicious，reason=ip_cluster。
4. **同设备多账号（标 suspicious）**：
   - child 设备指纹 24h 内 ≥3 不同 user_id 注册 → 标 suspicious，reason=device_multi_account。
5. **国家不一致告警（不拒绑，仅标）**：
   - child 与 l1 country_code 距离 > 2 跳（如 VN ↔ AR）+ ip_country 与 child profile 不一致 → 标 suspicious，reason=geo_anomaly（仅记，不影响佣金）。
6. **L2 自动派生**：
   - 查 `referral_relations.l1_user_id WHERE child_user_id = inviter_l1_user_id` → 取出作为 child 的 l2。
   - 没有则 l2 = NULL。
7. 单一绑定：每个 user 最多 1 条 `referral_relations`（unique constraint on child_user_id）；重复调用幂等。
8. 时窗：注册超过 30 天后再访问 `/r/:code` → 不绑定（v1 不允许后绑定）。
9. 设备指纹源：从 E18 安全模块 `device_fingerprints` 表取 child 当次注册时的 fp_id；缺失则放行（标 reason=fingerprint_missing 但不拒绑）。
10. 性能：bindParent P95 < 200ms（同步路径）；反作弊检查 ≤ 4 次 DB 查询。
11. 后台审计：`referral_anti_cheat_logs` 表（id / event / child_user_id / l1_user_id / reason / payload_jsonb / created_at）；保留 2 年。

## Tasks / Subtasks

- [ ] **bindParent 主流程**（AC: 1,6,7,8）
  - [ ] `packages/referral/services/bind-parent.ts`
  - [ ] 事务保护

- [ ] **反作弊检查器**（AC: 2-5,9）
  - [ ] `packages/referral/anti-cheat/checks.ts`
  - [ ] 4 类规则单独函数

- [ ] **anti-cheat 日志表**（AC: 11）
  - [ ] `referral_anti_cheat_logs` migration

- [ ] **集成测试**（AC: 2-5,7,8）
  - [ ] mock 设备指纹同源 → 拒绑断言
  - [ ] 同 IP 4 注册 → 全 suspicious
  - [ ] 30 天超时 → 拒绑

- [ ] **性能基准**（AC: 10）
  - [ ] k6 100 并发 bindParent

## Dev Notes

### 关键约束
- 「拒绑」与「suspicious」严格分开：拒绑根本不创建关系；suspicious 创建关系但 14-7 cron 跳过 confirm。
- 不要把 IP 直接暴露给前端日志；只存后端 `inet`。
- 反作弊规则可在 14-10 后台 / config 调阈值（不 hardcode）。

### 关联后续 stories
- 14-4 落地页触发
- 14-7 cron 跳过 suspicious
- 14-10 监控 + 申诉

### Project Structure Notes
- `packages/referral/services/bind-parent.ts`
- `packages/referral/anti-cheat/`
- `packages/db/schema/referral-anti-cheat-logs.ts`

### References
- `planning/epics/14-referral.md` ZY-14-05
- `planning/prds/09-referral/02` § 邀请关系绑定逻辑

### 测试标准
- 单元：4 类规则 boundary
- 集成：拒绑 / suspicious 两路径
- E2E：自邀拒绑

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
