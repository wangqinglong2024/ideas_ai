# ZY-14-05 · 上级关系建立 + 反作弊拒绑

> Epic：E14 · 估算：L · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 写 `referral_relations(l1, l2, source_ip, source_device_id)`
- [ ] 设备指纹与 L1 相同 → 拒绑 + 写 audit_logs 告警
- [ ] 同 IP 24h 同上级注册 ≥ 4 → 标 suspicious
- [ ] L2 自动派生（l1 = parent.l1）

## 测试方法
- 集成：mock 同设备注册 → 拒绑
- 单元：聚集计数

## DoD
- [ ] 双层关系 + 反作弊基线
