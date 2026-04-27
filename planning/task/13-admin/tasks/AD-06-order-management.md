# AD-06 · 实现订单管理

## PRD 原文引用

- `AD-FR-004`：“列表 + 筛选（状态 / 金额 / 时间 / 计划）。”
- `AD-FR-004`：“退款（≥ 7 天人工审批）；发票导出；订单详情含 webhook 历史。”

## 需求落实

- 页面：`/admin/orders`、`/admin/orders/:id`。
- 组件：OrderTable、OrderDetailDrawer、RefundApprovalDialog。
- API：`GET /admin/api/orders`、`POST /admin/api/orders/:id/refund`。
- 数据表：orders、payment_webhook_events、admin_audit_logs。
- 状态逻辑：本期支付走 PaymentAdapter dummy/fake；退款仍落订单状态与审计。

## 不明确 / 风险

- 风险：真实支付渠道未接入。
- 处理：仅实现订单/退款状态机和 fake webhook。

## 技术假设

- 发票导出为 CSV/Excel 占位，不对接税务系统。

## 最终验收清单

- [ ] 订单列表筛选可用。
- [ ] 订单详情显示 webhook 历史。
- [ ] ≥7 天退款必须 admin 审批。
- [ ] 退款操作写审计。