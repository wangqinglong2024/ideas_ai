# Story 20.10: 上线日 + Postmortem（PIR）

Status: ready-for-dev

## Story

作为 **创始人 / 上线指挥官**，
我希望 **D-day 有完整检查清单、全员 on-call、24h/72h/168h 监控节奏，并在 D+7 完成 PIR 复盘**，
以便 **上线万无一失，问题可控，组织可学习**。

## Acceptance Criteria

1. **D-day 检查清单**（D-1 / D-day / D+1）`docs/runbooks/launch-day.md`：
   - DNS / TLS / CDN
   - 4 国支付通道 live
   - PostHog / Sentry / Better Stack 三件套绿
   - 状态页公开
   - 客服 24h 排班 + 培训完成
   - 灰度 flag 默认 10%
   - 营销站 + app + admin 全部健康
   - 法律页面 4+1 语 + 律师签字归档
   - 备份 24h 内 ≥ 1 次成功
2. **全员 on-call**：D-day 前后 24h，关键岗位（PM / 工程 / SRE / CS / 法务）双人；时区轮换。
3. **作战室**：物理 / 远程会议室 24h 不下线，含「灰度仪表板（19-5）+ 状态页 + Slack」三屏。
4. **监控节奏**：
   - **0-24h**：每 1h 例行 check-in
   - **24-72h**：每 4h
   - **72-168h**：每 12h
   - 异常 → 立即升级
5. **公告**：D-day 营销站 banner / 邮件 / 社媒（4+1 语）；状态页发布「Launch」事件。
6. **PIR**（D+7 内完成）：
   - 使用 19-10 PIR 模板
   - 含：成功度量 / 故障汇总 / 客服反馈 / 各国差异 / 财务初值 / 改进项
   - 全员评审会 90min
   - 行动项进入 GitHub Issues（label `pir-launch`）
7. **回滚预案**：每个故障类型对应回滚动作（联动 20-5 runbook）。
8. **指标基线**：上线 D+30 与原 PRD KPI 对比，差距分析。
9. **Lessons Learned**：写入 `docs/postmortems/launch-2026Qx.md` 永久归档。

## Tasks / Subtasks

- [ ] **检查清单**（AC: 1）
  - [ ] `docs/runbooks/launch-day.md`
  - [ ] D-1 全员 dry run
- [ ] **on-call + 作战室**（AC: 2, 3）
  - [ ] PD schedule
  - [ ] 远程会议链接 + 屏幕配置
- [ ] **监控节奏**（AC: 4）
  - [ ] check-in 模板（Slack thread）
  - [ ] timer / 自动提醒
- [ ] **公告 + 状态页**（AC: 5）
  - [ ] 4+1 语模板
  - [ ] 邮件 list
- [ ] **PIR**（AC: 6, 9）
  - [ ] 数据收集脚本
  - [ ] 评审会议程
  - [ ] PR 入仓
- [ ] **基线对比**（AC: 8）
  - [ ] D+30 自动报表
- [ ] **回滚联动**（AC: 7）
  - [ ] 与 20-5 runbook 一致

## Dev Notes

### 关键约束
- **No-Deploy Window**：D-day 前 24h ~ D+72h 禁止任何非紧急部署；紧急修复需 2 人 review + on-call 主管批准。
- **沟通节奏** > 工程动作：每小时 check-in 即使无事，也要发「all green」。
- 客服反馈必须实时进作战室（CS 主管直接报）。
- D-day 当晚不饮酒 / 不远行；全员就绪。
- PIR 不追责；目标是学习；行动项有 owner 才算闭环。

### 关联后续 stories
- 20-1~20-9：所有上线准备的最终验收
- 19-5 仪表板：D-day 作战
- 19-6 告警：临时收紧阈值
- 19-7 状态页：发布事件
- 19-10 PIR：模板 + CLI

### Project Structure Notes
- `docs/runbooks/launch-day.md`
- `docs/postmortems/launch-<date>.md`
- `scripts/launch-checkin.ts`

### References
- [planning/epics/20-launch.md ZY-20-10](../../epics/20-launch.md)
- [planning/epics/19-observability.md](../../epics/19-observability.md)

### 测试标准
- D-1 dry run 100% 通过
- D+0~D+7 P1 故障 = 0
- D+7 PIR 完成 + 行动项分配
- D+30 KPI 报表入仓

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
