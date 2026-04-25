# Story 20.5: 灰度发布（10% → 50% → 100%）

Status: ready-for-dev

## Story

作为 **SRE / 产品**，
我希望 **通过 PostHog Feature Flag 控制灰度比例 10% → 50% → 100%，每阶段稳定 24h 才推进，并具备一键回滚 runbook**，
以便 **将 D-day 风险最小化，故障可立即缩小爆炸半径**。

## Acceptance Criteria

1. **Feature Flag**：`launch.exposure` 数值 0/10/50/100；后端 / 前端 / 营销站统一读取。
2. **灰度门控**：
   - <flag 的用户：访问 app 时显示「Beta 邀请名单」候补页 + 营销站正常
   - ≥flag 的用户：完整 app
   - 已通过候补的用户：永久放行（独立 flag `launch.cohort.beta`）
3. **推进准则（每阶段）**：
   - SLO 达标（API uptime ≥ 99.9% / P95 < 300ms / 5xx < 1%）
   - Sentry 新 issue ≤ 5 条 / 24h 且无 P1
   - 支付成功率 ≥ 95%
   - 客服工单未积压（SLA 命中 ≥ 90%）
   - 业务指标无异常下跌（注册 / 付费 / 完课）
4. **回滚 runbook** `docs/runbooks/launch-rollback.md`：
   - 一键调小 flag（PostHog API + admin 双途径）
   - 数据库迁移回滚（migrations rollback 链路）
   - CDN 缓存清理
   - 告警 / 客服通知模板
   - 决策树（5min 小问题 → 15min 调小 → 30min 全回滚）
5. **观测**：每阶段对比基线（前 7 天）和当前 KPI；19-5 仪表板新增「灰度对比」面板。
6. **沟通**：每阶段推进前后 Slack `#launch` 通知 + 状态页公告（19-7）。
7. **演练**：D-day 前 7 天内一次 dry run（preview env 模拟 10→50→100）。
8. **数据迁移**：所有需要 migration 的变更 backward-compatible（双写 / 影子表），降低回滚成本。

## Tasks / Subtasks

- [ ] **Feature Flag**（AC: 1, 2）
  - [ ] PostHog flag 创建
  - [ ] 共享 SDK util（FE/BE/SSR/RSC）
  - [ ] beta cohort 永久放行
- [ ] **门控页**（AC: 2）
  - [ ] 候补页 4+1 语
  - [ ] 邮件订阅 → 上调阈值后自动通知
- [ ] **推进准则 + 仪表板**（AC: 3, 5）
  - [ ] 决策清单
  - [ ] 19-5「灰度对比」嵌入
- [ ] **回滚 runbook**（AC: 4）
  - [ ] 文档 + 模板
  - [ ] 一键脚本 `scripts/rollback.sh`
- [ ] **沟通**（AC: 6）
  - [ ] Slack template
  - [ ] status page incident 模板
- [ ] **dry run**（AC: 7）
  - [ ] preview env 全链路演练 + PIR
- [ ] **迁移策略**（AC: 8）
  - [ ] migration 兼容性 review checklist

## Dev Notes

### 关键约束
- **灰度判定单位** = `user_id` 的 `hash % 100 < flag`（确定性）；同一用户不会反复变 in/out。
- 灰度推进**必须数据驱动**：任一推进准则未达标 → 暂停，不可凭感觉。
- 回滚不是失败，是预案；D-day 前所有人达成共识。
- migration backward-compatible：**禁止** 删字段 / 改类型不向后兼容；必要时 v0 双写。
- 候补页**禁止**收集敏感信息；只邮箱。

### 关联后续 stories
- 19-3 PostHog FF
- 19-5 仪表板
- 19-6 告警
- 19-7 状态页
- 20-10 D-day

### Project Structure Notes
- `apps/web/middleware.ts`（flag 守卫）
- `apps/web/app/waitlist/`
- `scripts/rollback.sh`
- `docs/runbooks/launch-rollback.md`

### References
- [planning/epics/20-launch.md ZY-20-05](../../epics/20-launch.md)
- [planning/spec/08-deployment.md](../../spec/08-deployment.md)

### 测试标准
- 单元：flag 哈希一致性 / 边界
- 集成：候补页 / 放行链路
- 演练：preview 一次成功 dry run

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
