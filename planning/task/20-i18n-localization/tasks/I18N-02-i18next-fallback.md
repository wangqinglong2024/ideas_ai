# I18N-02 · i18next 集成与缺 key 兜底

## PRD 原文引用

- `I18N-FR-001`：“所有 UI 文案经 i18next key；缺失 key dev 回退 en 并 console warn。”

## 需求落实

- `system/apps/web/src/i18n.ts` / `system/apps/admin/src/i18n.ts` 初始化 i18next + react-i18next + i18next-browser-languagedetector + i18next-http-backend。
- `fallbackLng: 'en'`、`saveMissing: true`、`missingKeyHandler` 在 dev 环境 console.warn 并发 POST 至 `/dev/i18n/missing` 收集。
- 生产环境关闭 saveMissing，纯 fallback。

## 状态逻辑

- 加载策略：默认 `common` ns 同步随首屏；其它 ns 按页面 lazy load via `useTranslation('learn')`。
- Suspense 包裹根组件，等待初始 ns 加载完成。

## 不明确 / 风险

- 风险：missingKey POST 可能在生产被滥用。
- 处理：`/dev/i18n/missing` 仅 dev 环境注册路由；prod build 时 tree-shake。

## 技术假设

- LanguageDetector 顺序：`['querystring','cookie','navigator','htmlTag']`。
- cookie 名 `zhiyu_lang`，1 年有效。

## 最终验收清单

- [ ] 缺 key 时 dev 控制台显示 `[i18n missing] ns:key`。
- [ ] 缺 key 在 UI 上显示英文兜底。
- [ ] 生产 build 不含 saveMissing 代码。
- [ ] 切换语言无需刷新页面。
