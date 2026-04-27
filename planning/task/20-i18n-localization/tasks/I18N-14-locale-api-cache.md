# I18N-14 · locale API 与本地缓存

## PRD 原文引用

- `02-data-model-api.md`：“API：`GET /api/i18n/locales/:lang/:ns`，本地 nginx/cache header/SW 缓存，客户端缺失时回退打包默认。”

## 需求落实

- API：`GET /api/i18n/locales/:lang/:ns` 返回 JSON，header `Cache-Control: public, max-age=300, stale-while-revalidate=86400`。
- 客户端 i18next-http-backend 配置 loadPath 指向上述 API。
- ServiceWorker（CR-24）使用 StaleWhileRevalidate 缓存 locale 响应。
- 客户端打包内置首屏所需 ns 的 5 语 fallback（避免空白闪烁）。
- ETag：locale JSON 内容 hash 生成 ETag；客户端 304 命中。

## 状态逻辑

- 后台编辑器更新翻译 → invalidate locale cache（清 nginx cache + 推 SW skipWaiting 标记）。
- 客户端 polling `/api/i18n/version` 检测变化；变更时 reload locale。

## 最终验收清单

- [ ] API 返回正确 JSON + ETag。
- [ ] 二次访问 304。
- [ ] SW 缓存命中离线可用。
- [ ] 翻译更新 5min 内前台生效。
- [ ] fallback 内置 ns 在 API 不可用时正常工作。
