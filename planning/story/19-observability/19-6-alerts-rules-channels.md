# Story 19.6: 告警规则 + 通道（Slack / PagerDuty）

Status: ready-for-dev

## Story

作为 **SRE / 值班工程师**，
我希望 **在 Better Stack / Sentry / PostHog 中配置统一的告警规则，按严重度路由 Slack 或 PagerDuty，并支持静默与 on-call 排班**，
以便 **第一时间响应故障，不被噪音淹没，符合 SLO 错误预算管理**。

## Acceptance Criteria

1. 告警源：Better Stack（uptime/log-based）/ Sentry（error / performance）/ PostHog（business metric）。
2. 通道路由表：
   | Severity | 通道 | SLA |
   |---|---|---|
   | Sev1（核心服务下线 / 支付故障） | PagerDuty + Slack `#sev1` | 5min |
   | Sev2（高错误率 / 高延迟） | Slack `#alerts-error` + PD low | 15min |
   | Sev3（业务异常） | Slack `#alerts-warn` | 1h |
   | Sev4（容量预警） | Slack `#ops-info` | 24h |
3. **核心规则集**（最小集，IaC 化在 `infra/alerts/*.yaml`）：
   - API uptime < 99.5% / 5min（Sev1）
   - API 5xx 率 > 5% / 5min（Sev2）；> 10%（Sev1）
   - API P95 > 1s / 10min（Sev2）
   - DB CPU > 90% / 10min（Sev2）
   - Redis 内存 > 85%（Sev2）
   - Queue depth > 1000 / 5min（Sev2）
   - 支付失败率 > 5% / 10min（Sev1）
   - Sentry new issue（高频 ≥10/5min）（Sev2）
   - Sentry release regression（Sev2）
   - AI 月成本 > 80% 预算（Sev3）
   - PostHog 注册量同比下跌 > 50%（Sev3）
   - 备份失败 / 已 24h 未成功（Sev2）
4. **静默规则**：维护窗口（admin UI 一键开 30/60/120min）；周末降级（Sev3 → 工作日处理）；已知问题 fingerprint 抑制。
5. **On-call 排班**：PagerDuty schedule（主备），首期 2 人轮换；交接邮件 / Slack。
6. **告警 Runbook**：每条规则关联 wiki 链接（`docs/runbooks/<rule-id>.md`），含触发原因 / 排查步骤 / 修复 / 升级。
7. **告警卫生**：周报：count by rule / MTTR / 噪音率（auto-resolved < 2min 占比）；噪音率 > 30% 必须调阈值或下线。
8. 演练：上线前一次 chaos drill（kill api / fill db / pause queue），验证全部 Sev1/Sev2 规则触发与路由。

## Tasks / Subtasks

- [ ] **IaC 规则**（AC: 1, 3）
  - [ ] `infra/alerts/{betterstack,sentry,posthog}.yaml`
  - [ ] terraform / api-cli 应用脚本
- [ ] **路由集成**（AC: 2）
  - [ ] Slack channel 创建 + bot
  - [ ] PagerDuty service + integration key
- [ ] **静默 / Runbook**（AC: 4, 6）
  - [ ] admin `/admin/alerts/silence` 调用 BetterStack API
  - [ ] `docs/runbooks/index.md` 自动生成
- [ ] **On-call**（AC: 5）
  - [ ] PD schedule 模板
  - [ ] 交接清单
- [ ] **卫生周报**（AC: 7）
  - [ ] cron 拉 PD/BS API → 19-5 仪表板
- [ ] **演练**（AC: 8）
  - [ ] chaos drill 脚本 `scripts/chaos.sh`
  - [ ] PIR 模板填写

## Dev Notes

### 关键约束
- **规则版本化**：所有规则 IaC，禁止 UI 手动改；MR 评审。
- 单一 PD service 多 integration（避免上下文丢失）；FYI 等级走 Slack only。
- 周末 Sev3 静默，但 Sev1/Sev2 24/7 不静默。
- on-call 工程师 ≤ 8h/周；超过需补人。
- 与 19-1 / 19-2 / 19-3 联动：所有规则的 sample 与配额监控也是规则之一（防自爆）。

### 关联后续 stories
- 19-7 状态页：Sev1/Sev2 自动同步
- 19-10 部署事件：deploy 后 30min 内严格规则
- 20-10 上线日：D-day 临时收紧阈值

### Project Structure Notes
- `infra/alerts/`
- `docs/runbooks/`
- `apps/cron/jobs/alert-hygiene.ts`
- `scripts/chaos.sh`

### References
- [planning/epics/19-observability.md ZY-19-06](../../epics/19-observability.md)
- [planning/spec/10-observability.md § 7, § 8](../../spec/10-observability.md)

### 测试标准
- 单元：规则 yaml schema 校验
- 集成：chaos drill 触发率 100%
- 安全：integration key 不入仓

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
