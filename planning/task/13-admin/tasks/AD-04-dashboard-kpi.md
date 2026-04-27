# AD-04 · 实现 Dashboard KPI

## PRD 原文引用

- `AD-FR-002`：“KPI 卡片：DAU / WAU / MAU / 订单数 / GMV / Churn / NPS / 客服未接。”
- `AD-FR-002`：“7/30/90 天趋势图；异常告警。”

## 需求落实

- 页面：`/admin` 或 `/admin/dashboard`。
- 组件：KpiCardGrid、TrendChart、AdminAlertList。
- API：`GET /admin/api/dashboard/summary`、`GET /admin/api/dashboard/trends`。
- 数据表：`events`、orders、customer service tables、error_events。
- 状态逻辑：viewer 可读；数据按 7/30/90 天聚合。

## 不明确 / 风险

- 风险：NPS 数据来源未在 PRD 定义。
- 处理：若 NPS 表尚未实现，显示为空状态并标记缺数据源。

## 技术假设

- v1 聚合由 SQL view 或服务层计算，不引入外部 BI。

## 最终验收清单

- [ ] KPI 卡片可加载。
- [ ] 趋势图支持 7/30/90 天。
- [ ] 异常告警包含红线、高错误率、支付失败率。
- [ ] viewer 可访问但不能操作。