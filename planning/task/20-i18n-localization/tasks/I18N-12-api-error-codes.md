# I18N-12 · API 错误 code-only 设计

## PRD 原文引用

- `I18N-FR-011`：“API 错误只返回 code；客户端按语言翻译 message。”

## 需求落实

- 后端：所有错误响应统一 `{error: {code, details?, requestId}}`。code 形如 `auth.invalid_password`、`payment.sku_not_found`。
- 客户端：i18n key `errors.${code}` 翻译；未翻译 fallback 显示 code（dev）或通用 “出错了请重试”（prod）。
- 错误码登记：`packages/types/src/error-codes.ts` 全枚举。

## 状态逻辑

- 错误码新增需同步 5 lang `errors` ns。
- details 字段可含变量插值（`amount={amount}`）。

## 最终验收清单

- [ ] API 错误响应统一格式。
- [ ] 5 lang errors.json 全覆盖现有 code。
- [ ] 缺译时 prod 显示通用提示，dev 显示 code。
- [ ] 客户端不依赖后端 message 字符串。
