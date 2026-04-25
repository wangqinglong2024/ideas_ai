# Story 12.10: 反作弊

Status: ready-for-dev

## Story

作为 **平台**，
我希望 **检测异常获取与消耗，触发自动冻结并支持人工复核与申诉**，
以便 **防止刷币破坏经济**。

## Acceptance Criteria

1. 检测维度：
   - 单设备 / IP 当日获得超阈值（默认 daily_cap × 2）
   - 单用户高频低间隔触发（cooldown 绕过尝试）
   - 异常时区切换（24h 内时区差 > 12h）
   - 设备指纹聚簇（同 fingerprint > N 用户）
2. 命中规则：`fraud_signals` 表记录信号；累计分 ≥ 阈值 → 用户 `frozen_at` 设置（balance 转移 frozen）。
3. 冻结用户：spend / earn API 拒绝（403 account_frozen），登录可访问只读资源。
4. 后台审核页 `/admin/coins/fraud`：列表 / 信号详情 / 解冻 / 永封 / 退币动作。
5. 用户申诉：站内提交申诉表单 → 工单（可对接 E15）。
6. 全部行为审计；可导出 CSV。
7. 误伤率监控：周报指标 dashboard（E19 接入）。
8. 4 语 UI（用户冻结提示 + 申诉表单）。

## Tasks / Subtasks

- [ ] 检测规则 + 信号写入（AC: 1,2）
- [ ] 自动冻结（AC: 2,3）
- [ ] 后台审核页（AC: 4）
- [ ] 申诉流程（AC: 5）
- [ ] 审计 / 导出（AC: 6）
- [ ] 监控指标（AC: 7）
- [ ] i18n / 测试

## Dev Notes

### 关键约束
- 设备指纹来自 E18（FingerprintJS-like）。
- 冻结操作必须可逆（解冻恢复 balance）。
- 自动冻结仅触发"暂停发币"，不直接清零。

### Project Structure Notes
- `packages/db/schema/coins-fraud.ts`
- `apps/api/src/services/coins/fraud-detect.ts`
- `apps/admin/src/pages/coins/fraud.tsx`

### References
- [Source: planning/epics/12-economy.md#ZY-12-10]
- [Source: planning/epics/18-security.md]

### 测试标准
- 单元：每条规则
- e2e：触发 → 冻结 → 申诉 → 解冻

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
