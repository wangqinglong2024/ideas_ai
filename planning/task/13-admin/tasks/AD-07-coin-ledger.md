# AD-07 · 实现知语币账本后台

## PRD 原文引用

- `AD-FR-005`：“全局发行 / 消耗 / 余额统计。”
- `AD-FR-005`：“可疑账户列表（高发行 / 异常消耗）。”
- `AD-FR-005`：“手动调整（必填理由 + 审计）。”

## 需求落实

- 页面：`/admin/coins`。
- 组件：CoinSummaryCards、CoinLedgerTable、CoinAdjustDialog。
- API：`GET /admin/api/coins/summary`、`POST /admin/api/users/:id/coins/grant`。
- 数据表：coin_ledger、users、admin_audit_logs。
- 状态逻辑：加币/扣币必须 reason；异常账户按规则列表展示。

## 不明确 / 风险

- 风险：奖励模块部分任务尚未实现。
- 处理：账本后台先按 ledger 表契约实现，缺来源显示 unknown/source_pending。

## 技术假设

- 知语币不可提现，分销返佣也是 ZC 单位。

## 最终验收清单

- [ ] 发行/消耗/余额统计准确。
- [ ] 手动调整必填理由。
- [ ] 可疑账户列表可筛选。
- [ ] 所有调整写审计。