# UX-23 · 实现 PWA 离线壳与缓存策略

## 原文引用

- `planning/prds/01-overall/06-non-functional.md`：“离线可用（PWA）：静态壳 + 已缓存内容。”
- `planning/ux/16-performance-quality.md`：“App Shell：cache-first。”
- `planning/ux/08-components-feedback.md`：“离线模式 banner 显示。”

## 需求落实

- 页面：全站应用壳、离线页、列表/详情缓存态。
- 组件：ServiceWorker、OfflineBanner、CachedContentIndicator。
- API：内容 API 需支持缓存 header；离线时读 IndexedDB/CacheStorage。
- 数据表：前端 IndexedDB，本地缓存元数据。
- 状态逻辑：静态壳 cache-first，内容用户主动下载或最近访问缓存。

## 技术假设

- 使用 Vite PWA 或自定义 service worker。
- 后台 Admin 不要求完整离线可用。

## 不明确 / 风险

- 风险：离线内容与权限/付费墙冲突。
- 处理：缓存前校验权限，过期后需在线刷新授权。

## 最终验收清单

- [ ] 断网后 App Shell 可打开。
- [ ] 已缓存文章/课程可读。
- [ ] 离线 banner 与禁用 tooltip 正常。
# UX-23 · 实现 PWA 离线壳与缓存策略

## 原文引用

- `planning/prds/01-overall/06-non-functional.md`：“离线可用（PWA）：静态壳 + 已缓存内容。”
- `planning/ux/16-performance-quality.md`：“App Shell：cache-first。”
- `planning/ux/08-components-feedback.md`：“离线模式 banner 显示。”

## 需求落实

- 页面：全站应用壳、离线页、列表/详情缓存态。
- 组件：ServiceWorker、OfflineBanner、CachedContentIndicator。
- API：内容 API 需支持缓存 header；离线时读 IndexedDB/CacheStorage。
- 数据表：前端 IndexedDB，本地缓存元数据。
- 状态逻辑：静态壳 cache-first，内容用户主动下载或最近访问缓存。

## 技术假设

- 使用 Vite PWA 或自定义 service worker。
- 后台 Admin 不要求完整离线可用。

## 不明确 / 风险

- 风险：离线内容与权限/付费墙冲突。
- 处理：缓存前校验权限，过期后需在线刷新授权。

## 最终验收清单

- [ ] 断网后 App Shell 可打开。
- [ ] 已缓存文章/课程可读。
- [ ] 离线 banner 与禁用 tooltip 正常。
