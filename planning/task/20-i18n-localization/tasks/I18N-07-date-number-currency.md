# I18N-07 · 日期/数字/货币本地化

## PRD 原文引用

- `I18N-FR-006`：“日期/数字使用 date-fns locale 与 Intl.NumberFormat；货币 v1 仅 USD。”

## 需求落实

- 工具：`packages/i18n/src/format.ts` 暴露 `formatDate(date, lang)`、`formatNumber(n, lang)`、`formatCurrency(n, lang, 'USD')`。
- 实现：date-fns + locale 子模块（按 lang 动态 import）；Intl.NumberFormat 内置。
- React hook：`useFormatter()` 返回上述函数（已注入当前 lang）。
- ui_lang=zh-CN 货币显示 `US$10.00`（中文习惯）；其他 lang 按本地 USD 表达。

## 不明确 / 风险

- 风险：日期短格式各语习惯差异（dd/MM vs MM/dd）。
- 处理：统一走 date-fns `format(date, 'P', { locale })`，由 locale 决定。

## 技术假设

- 仅 v1 USD；后续多币种走 PaymentAdapter 扩展。

## 最终验收清单

- [ ] th 日期 `28/01/2025`、en `01/28/2025`、vi `28/01/2025`、zh-CN `2025/01/28`。
- [ ] 数字千分位按 lang 切换。
- [ ] 货币 v1 仅 USD。
- [ ] formatter hook 可在任何组件调用。
