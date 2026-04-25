# Story 20.8: 客服 + 知识库 培训

Status: ready-for-dev

## Story

作为 **客服主管 / 上线日值班负责人**，
我希望 **FAQ 4 语完整、客服话术、知识库与上线值班排班全部就绪**，
以便 **D-day 前 7 天客服全员可独立处理 4 国常见工单，SLA 达标**。

## Acceptance Criteria

1. **FAQ**（4+1 语，由 admin CMS / E15 维护）：
   - 注册 / 登录 / 找回密码（OAuth 含 Apple/Google）
   - 课程使用 / HSK 流派 / 流利度评估
   - 经济：金币赚取 / 充值 / 退款
   - 支付：4 国本地支付方式 / 失败原因
   - PWA 安装 / 离线
   - 隐私 / 数据导出 / 注销
2. **客服话术** `docs/cs/scripts/{vn,th,id,en,zh}.md`：常见 30+ 场景含开场 / 同理 / 解决 / 升级 / 收尾。
3. **知识库**：内部 wiki（Notion / docs/cs/kb/），含产品功能 / 经济规则 / 退款政策 / 风控边界 / 升级路径；4+1 语客服至少 1 人覆盖每语。
4. **工单分类与 SLA**（沿用 E15）：P1 紧急 4h / P2 高 12h / P3 中 24h / P4 低 72h。
5. **上线值班**：D-day 24h 双人值班；D+1~D+3 主备；D+4~D+7 主班；表 `docs/cs/oncall.md`。
6. **培训**：
   - 上线前 7 天完成 2 场 90min 培训 + 录屏
   - 模拟工单考试 ≥ 80 分通过
   - 4 语客服各 ≥ 2 名考试合格
7. **工具**：客服 admin `/admin/cs/`（E15）熟练度 ≥ 95% 操作通过率。
8. **危机沟通模板**（联动 20-9 / 20-10）：4+1 语；故障 / 数据 / 支付 / 媒体 4 类。
9. **观测**：客服 SLA / CSAT / 解决率 → 19-5 仪表板。

## Tasks / Subtasks

- [ ] **FAQ 内容**（AC: 1）
  - [ ] 4+1 语 markdown
  - [ ] CMS 录入（E17）
- [ ] **话术 + KB**（AC: 2, 3）
  - [ ] `docs/cs/scripts/`
  - [ ] `docs/cs/kb/`
- [ ] **SLA + 排班**（AC: 4, 5）
  - [ ] PD schedule
  - [ ] `docs/cs/oncall.md`
- [ ] **培训**（AC: 6）
  - [ ] 培训 deck
  - [ ] 模拟考试 / 评分
- [ ] **危机模板**（AC: 8）
  - [ ] `docs/cs/crisis/{outage,data,payment,media}.md` 4+1 语
- [ ] **观测**（AC: 9）
  - [ ] 仪表板嵌入

## Dev Notes

### 关键约束
- 4 国 4 语客服必须**本地母语者**或经认证翻译；机翻不可用于工单回复。
- 退款以「先退后核」原则在 < $20 范围内客服可直接处理；超额需经理审批。
- 危机沟通必须经创始人 / 法务 / PR 三签后发布。
- 工单 PII 不可发到外部 IM；统一在 admin 内处理。

### 关联后续 stories
- E15 客服：admin / SLA / FAQ CMS
- 20-9 法律合规链接
- 20-10 D-day 危机沟通
- 19-5 仪表板

### Project Structure Notes
- `docs/cs/{scripts,kb,crisis,training}/`
- `docs/cs/oncall.md`

### References
- [planning/epics/20-launch.md ZY-20-08](../../epics/20-launch.md)
- [planning/epics/15-customer-service.md](../../epics/15-customer-service.md)

### 测试标准
- 模拟考试 ≥ 80 分通过
- D-day 前 dry run 一次
- SLA 命中率上线首周 ≥ 90%

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
