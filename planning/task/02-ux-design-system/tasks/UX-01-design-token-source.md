# UX-01 · 建立设计 Token 事实源

## 原文引用

- `planning/ux/02-design-tokens.md`：“所有颜色 / 字号 / 间距 / 圆角 / 阴影 / 动效在此集中声明，前后端 / Figma 共用一份事实源。”
- `planning/ux/02-design-tokens.md`：“实现：Tailwind preset + CSS 变量双输出（packages/ui/tokens/）。”

## 需求落实

- 页面：所有页面使用同一 token，不单页硬编码。
- 组件：colors、typography、spacing、radius、shadow、motion、zIndex、screens、safe-area token。
- API：无。
- 数据表：无。
- 状态逻辑：亮/暗主题通过 CSS 变量切换，品牌色不随主题变化。

## 技术假设

- 输出位置为 `system/packages/ui/tokens` 与 `system/packages/ui/styles`。
- Tailwind preset 由 app-fe/admin-fe 复用。

## 不明确 / 风险

- 风险：UX 文档部分字体和 i18n PRD 字体名称存在差异。
- 处理：以 token 层支持多字体变量，具体语言映射由 i18n 任务裁决。

## 最终验收清单

- [ ] Token 覆盖 rose/sky/amber、中性色、语义色、声调色、coin 色。
- [ ] CSS variables 与 Tailwind preset 双输出。
- [ ] 组件不得写死非 token 颜色。
# UX-01 · 建立设计 Token 事实源

## 原文引用

- `planning/ux/02-design-tokens.md`：“所有颜色 / 字号 / 间距 / 圆角 / 阴影 / 动效在此集中声明，前后端 / Figma 共用一份事实源。”
- `planning/ux/02-design-tokens.md`：“实现：Tailwind preset + CSS 变量双输出（packages/ui/tokens/）。”

## 需求落实

- 页面：所有页面使用同一 token，不单页硬编码。
- 组件：colors、typography、spacing、radius、shadow、motion、zIndex、screens、safe-area token。
- API：无。
- 数据表：无。
- 状态逻辑：亮/暗主题通过 CSS 变量切换，品牌色不随主题变化。

## 技术假设

- 输出位置为 `system/packages/ui/tokens` 与 `system/packages/ui/styles`。
- Tailwind preset 由 app-fe/admin-fe 复用。

## 不明确 / 风险

- 风险：UX 文档部分字体和 i18n PRD 字体名称存在差异。
- 处理：以 token 层支持多字体变量，具体语言映射由 i18n 任务裁决。

## 最终验收清单

- [ ] Token 覆盖 rose/sky/amber、中性色、语义色、声调色、coin 色。
- [ ] CSS variables 与 Tailwind preset 双输出。
- [ ] 组件不得写死非 token 颜色。
