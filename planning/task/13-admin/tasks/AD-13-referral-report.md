# AD-13 · 实现分销报告

## PRD 原文引用

- `AD-FR-010`：“总佣金（ZC） / 待确认 / 已发放。”
- `AD-FR-010`：“不含提现审核（v1 不提供现金提现）。”
- `AD-FR-010`：“反作弊告警列表 + 冻结操作。”

## 需求落实

- 页面：`/admin/referral`。
- 组件：ReferralSummary、CommissionTable、ReferralRiskList。
- API：`GET /admin/api/referral/summary`、冻结推广员等。
- 数据表：referral relations、commission ledger、security_events、admin_audit_logs。
- 状态逻辑：所有金额单位为 ZC；无提现审批页面。

## 不明确 / 风险

- 风险：用户可能期待现金提现。
- 处理：页面文案明确 v1 不支持现金提现。

## 技术假设

- 反作弊冻结写入用户/推广状态并审计。

## 最终验收清单

- [ ] 展示 ZC 佣金状态。
- [ ] 无提现审核入口。
- [ ] 反作弊告警可筛选。
- [ ] 冻结操作写审计。