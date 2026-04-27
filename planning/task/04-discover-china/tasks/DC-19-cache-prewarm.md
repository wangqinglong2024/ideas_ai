# DC-19 · 实现内容预热与本地缓存策略

## PRD 原文引用

- `DC-FR-016`：“热门文章自动进入本地 nginx/cache header/SW 预取策略。”
- `planning/rules.md`：“本期不集成任何外部托管 SaaS。”
- `planning/spec/01-overview.md`：“v1 不走外部 CDN；静态资源由 nginx 直接 gzip + 长 cache header。”

## 需求落实

- 页面：无直接页面。
- 组件：ServiceWorkerPrecacheManifest。
- API：发布文章后触发缓存版本更新；前端读取预取清单。
- 数据表：可选 `content_cache_manifest`。
- 状态逻辑：已发布热门文章进入预取，撤回文章必须从清单移除。

## 不明确 / 风险

- 风险：缓存陈旧导致已撤回文章仍可见。
- 处理：发布/撤回时更新版本号，并让 API 权限/状态作为最终裁决。

## 技术假设

- 只使用本地 nginx、浏览器缓存、PWA Service Worker。

## 最终验收清单

- [ ] 热门文章加载命中本地缓存。
- [ ] 撤回文章无法被缓存绕过访问。
- [ ] 缓存清单可观测。
- [ ] 不引入外部 CDN 依赖。