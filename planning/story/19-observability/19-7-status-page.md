# Story 19.7: 状态页 status.zhiyu.io

Status: ready-for-dev

## Story

作为 **用户 / 客服 / 合作伙伴**，
我希望 **访问 status.zhiyu.io 查看实时服务健康度、订阅事件通知，并查看历史故障**，
以便 **故障期间自助查询、降低客服压力，并对外展示透明度**。

## Acceptance Criteria

1. 使用 Better Stack StatusPage（自有域名 CNAME `status.zhiyu.io`），TLS 证书自动签发。
2. **服务列表**：API / Web App / Admin / Marketing / Payments / AI Factory / Auth / CDN / Database 9 项；分组「核心 / 学习 / 商业 / 后台」。
3. **拨测**：每 60s 多区域（VN / TH / ID / SG / US）；判定阈值（连续 2 次失败 = degraded，连续 3 次 = outage）。
4. **历史事件**：保留 90 天；含开始时间 / 结束时间 / 影响范围 / 状态时间线（identified → investigating → monitoring → resolved）。
5. **订阅**：邮件 / RSS / Slack / Webhook；订阅页 4+1 语（VN / TH / ID / EN / 中）。
6. **维护窗口**：可提前发布；窗口期间自动展示 banner，并抑制 19-6 相关告警。
7. **品牌**：logo / 配色 / 法律页脚 4 语；与营销站一致（20-1）。
8. **集成**：故障打开 / 关闭事件 → Slack `#status-updates` + PostHog 事件 `statuspage.incident_*`。
9. SLO 公开：上月 uptime 数字嵌入到状态页 footer（每月自动）。

## Tasks / Subtasks

- [ ] **域名 + TLS**（AC: 1）
  - [ ] DNS CNAME
  - [ ] BetterStack 验证
- [ ] **服务 + 拨测**（AC: 2, 3）
  - [ ] 9 服务定义
  - [ ] 拨测目标 url（含 `/ready`）
  - [ ] 多区域配置
- [ ] **i18n**（AC: 5, 7）
  - [ ] 4+1 语 UI bundle
  - [ ] 翻译文案对接 E04
- [ ] **订阅 + 维护**（AC: 5, 6）
  - [ ] 订阅 form 嵌入
  - [ ] 维护窗口 admin SOP
- [ ] **集成事件**（AC: 8）
  - [ ] BetterStack webhook → API → Slack / PostHog
- [ ] **SLO footer**（AC: 9）
  - [ ] cron 月初拉数据 → BS api 更新

## Dev Notes

### 关键约束
- 状态页**必须独立于主基础设施**（BetterStack 托管，不部署在 Render）；否则故障时一同挂。
- 拨测目标 `/ready` 而非 `/health`，覆盖依赖健康。
- 隐私：状态页禁止暴露内部细节（错误堆栈、IP）。
- 维护窗口需与 19-6 静默规则联动（同一个 schedule）。

### 关联后续 stories
- 19-4：拨测目标
- 19-6：维护窗口共享
- 19-10：部署事件可选展示
- 20-9：法律合规链接（隐私 / TOS）页脚

### Project Structure Notes
- `infra/statuspage/config.yaml`
- `apps/api/src/routes/integrations/statuspage-webhook.ts`
- `docs/runbooks/incident-communication.md`

### References
- [planning/epics/19-observability.md ZY-19-07](../../epics/19-observability.md)
- [planning/spec/10-observability.md § 9.2](../../spec/10-observability.md)

### 测试标准
- 单元：webhook payload schema
- 集成：模拟 outage → status 更新 → 订阅推送
- 多区域：5 region 拨测各自报点

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
