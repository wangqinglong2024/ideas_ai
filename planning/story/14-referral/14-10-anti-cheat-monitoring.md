# Story 14.10: 反作弊监控 + 后台审计

Status: ready-for-dev

## Story

作为 **运营 / 风控管理员**，
我希望 **在后台实时监控同 IP / 同设备 / 突增等套利模式，并能冻结可疑账号 / 关系**，
以便 **保护佣金池不被农场攻击；同时给被误伤用户申诉通道**。

## Acceptance Criteria

1. **监控指标**：
   - 同 IP 24h 内同 inviter ≥ 6 注册 → 高危。
   - 同设备指纹 7d 内 ≥ 5 不同账号绑定同 inviter → 高危。
   - 单 inviter 小时级新下线突增（> 中位数 5×）→ 突增告警。
   - 单 inviter 24h pending 佣金突增（> 中位数 10×）→ 突增告警。
2. **检测引擎**：每 15min 跑一次 `referral-anti-cheat-detector`，写 `referral_alerts` 表。
3. **后台 `/admin/referral/alerts`**：
   - 列出最近 30 天告警（高危红 / 突增黄）。
   - 详情：涉及账号 / IP / 设备 / 关系 ID / 触发规则。
   - 操作：「冻结此关系」（is_suspicious=true）/「冻结此用户的所有 referral」（users.referral_status='frozen'）/「忽略此告警」/「永久白名单」。
   - 权限 `risk:referral`。
4. **冻结后行为**：
   - is_suspicious=true：14-7 cron 跳过 confirm；前端仪表板显示「待复核」。
   - users.referral_status='frozen'：所有该用户 commissions 不再 confirm，已 issued 的不撤回（除非另起 reverse）。
5. **`/admin/referral/relations` 关系列表**：
   - 筛选：is_suspicious / 时间 / inviter / country。
   - 批量操作：冻结 / 解冻。
6. **申诉链接**（v1 简版）：
   - 用户仪表板 14-9 顶部 banner 出现「您的某些佣金被暂停审核」时显示。
   - 点击 → 提交申诉表单（关联 ticket）→ 客服 / 风控人工审核（走 E15 工单流）。
7. **审计**：所有冻结 / 解冻 / 忽略 / 白名单操作落 `admin_audit_logs`，含 before / after。
8. **告警通知**：高危告警 → Slack #alerts-risk + 邮件 risk@；突增告警 → Slack 仅。
9. **指标暴露**：Prometheus `referral_alerts_total{severity}` / `referral_frozen_users_total`。
10. **可调阈值**：所有数字阈值放 `config/referral-anti-cheat.yaml`，不 hardcode；运行时 reload。

## Tasks / Subtasks

- [ ] **schema**（AC: 1,4）
  - [ ] `referral_alerts` 表
  - [ ] users 增加 `referral_status` 列（active / frozen）

- [ ] **检测引擎**（AC: 1,2,10）
  - [ ] `apps/api/src/crons/referral-anti-cheat-detector.ts`
  - [ ] 4 类规则模块

- [ ] **后台 UI**（AC: 3,5）
  - [ ] `apps/admin/src/routes/referral/alerts.tsx`
  - [ ] `apps/admin/src/routes/referral/relations.tsx`

- [ ] **冻结 / 解冻 API**（AC: 3,4,7）
  - [ ] `apps/api/src/routes/admin/referral/*`
  - [ ] RBAC + 审计

- [ ] **申诉**（AC: 6）
  - [ ] 复用 E15 ticket 系统
  - [ ] type='referral_appeal'

- [ ] **告警**（AC: 8）
  - [ ] Slack webhook + email

- [ ] **指标**（AC: 9）

- [ ] **配置**（AC: 10）
  - [ ] `config/referral-anti-cheat.yaml` + watcher

## Dev Notes

### 关键约束
- 阈值默认值：来源 `planning/prds/09-referral/01` RF-FR-011；可调以应对实际情况。
- 关系冻结不应级联到 child 学习账号（child 只是受害者 / 工具人）。
- 误伤指标：申诉通过率 / 冻结后正常率应监控（避免规则过严）。

### 关联后续 stories
- 14-7 cron 跳过冻结
- 14-11 通知触发申诉提示
- E15 ticket 申诉

### Project Structure Notes
- `apps/api/src/crons/referral-anti-cheat-detector.ts`
- `packages/referral/anti-cheat/detectors/`
- `apps/admin/src/routes/referral/`
- `config/referral-anti-cheat.yaml`

### References
- `planning/epics/14-referral.md` ZY-14-10
- `planning/prds/09-referral/01` RF-FR-011

### 测试标准
- 单元：4 类规则触发阈值
- 集成：冻结后 14-7 cron 跳过
- E2E：admin 操作 → 用户申诉 → 解冻

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
