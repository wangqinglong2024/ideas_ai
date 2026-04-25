# Story 18.10: 事件响应流程（Runbook + 演练 + 状态页）

Status: ready-for-dev

## Story

作为 **安全 / SRE / 法务**，
我希望 **建立事件响应 Runbook、专用邮箱与状态页集成，并完成 1 次实战演练**，
以便 **任何安全 / 故障事件可在第一时间被识别、分级、响应、复盘**。

## Acceptance Criteria

1. **Runbook**：`docs/security/incident-runbook.md`，分级（P0/P1/P2/P3）+ 流程（识别 / 集结 / 控制 / 修复 / 复盘 / 通报）。
2. **`security@zhiyu.io`** 邮箱：路由到飞书群 + on-call；自动确认收件。
3. **on-call 排班**：PagerDuty / 飞书 oncall 集成（与 19-x 告警链路打通）；周轮换。
4. **分级标准**：
   - P0：数据泄露 / 全站不可用（≥ 30min）/ 资金风险
   - P1：核心模块不可用 / 部分用户数据泄露
   - P2：单模块降级 / 非核心数据问题
   - P3：可计划修复
5. **状态页**：`status.zhiyu.io`（BetterStack 或自建）；自动从 19-x 健康检查推送；事件公告 + 历史。
6. **演练**：M6 末完成 1 次桌面演练 + 1 次实战注入（如人为关停某 Worker）；产出复盘报告。
7. **取证 / 法律**：P0 事件 24h 内启动法律 / 公关响应，4+1 语公告模板待用。
8. **GDPR 通知**：涉及个人数据泄露 72h 内通报相关监管机构（EU/IDPC、PDPC、PDPL、UU PDP）；模板邮件 + 流程文档。
9. **复盘要求**：每 P0/P1 事件 7d 内 postmortem + 行动项 + owner + 截止日；存 `docs/security/postmortems/YYYY-MM-DD-*.md`。
10. **演练记录**：演练成果归档；改进项进入 sprint。
11. e2e：模拟告警 → on-call 收到 → 状态页发布 → 复盘文档创建。

## Tasks / Subtasks

- [ ] **Runbook 撰写**（AC: 1, 4, 7-8）
- [ ] **邮箱 / 路由**（AC: 2）
- [ ] **on-call 配置**（AC: 3）
- [ ] **状态页**（AC: 5）
  - [ ] BetterStack / Statuspage 集成
- [ ] **演练**（AC: 6, 10）
  - [ ] 桌面 + 实战
- [ ] **GDPR 通知模板**（AC: 8）
- [ ] **postmortem 模板**（AC: 9）
- [ ] **测试**（AC: 11）

## Dev Notes

### 关键约束
- security@ 收件后 SLA：P0 < 15min 集结；P1 < 1h；P2 < 4h；P3 < 1 工作日。
- 状态页公告必须 4+1 语；自动翻译初稿 + 人审。
- 演练注入必须有明确"演练中"标识，避免真实恐慌。
- postmortem 文档不指责个人（blameless）；行动项必须落 issue 关联 milestone。
- GDPR 72h 通报可能涉及法律风险，所有通报先经法务 + COO 签字。

### 关联后续 stories
- 19-x（告警链路 / 状态页基础设施）
- 18-5 audit（取证）
- 17-x admin（公关公告发布）

### Project Structure Notes
- `docs/security/incident-runbook.md`
- `docs/security/postmortems/`
- `docs/security/gdpr-breach-notification-template.md`
- `infra/pagerduty/` 或 `infra/oncall/`

### References
- `planning/epics/18-security.md` ZY-18-10

### 测试标准
- 演练：1 次桌面 + 1 次实战注入
- 自动化：mock alert → 全链路通知
- 文档：runbook 可执行（同事按章节复演）

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
