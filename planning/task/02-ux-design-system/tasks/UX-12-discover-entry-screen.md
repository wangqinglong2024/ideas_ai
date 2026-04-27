# UX-12 · 实现 Discover 入口屏幕规格

## 原文引用

- `planning/ux/09-screens-app.md`：“中国文化 12 类目。”
- `planning/ux/09-screens-app.md`：“网文小说 12 类目。”
- `content/china/00-index.md` 表格列出发现中国 12 类目。

## 需求落实

- 页面：`/discover`、`/discover/:category`、`/discover/:category/:slug` 视觉壳。
- 组件：DiscoverHome、CategoryGrid、ArticleCard、SentenceReader、AudioPlayer、BottomActions。
- API：后续 DC/NV 模块接入内容 API。
- 数据表：DC/NV 内容表由业务模块实现。
- 状态逻辑：未登录前 3 篇限制由 UA/DC 处理；UX 提供引导状态。

## 技术假设

- 小说可作为 `/novels` 独立路由，但 Discover 首页保留小说聚合入口。

## 不明确 / 风险

- 风险：Discover 同时承载文化和小说，信息密度高。
- 处理：页面分区明确，不把小说规则混入文化类目。

## 最终验收清单

- [ ] Discover 首页显示 12 文化类目和 12 小说类目入口。
- [ ] 类目页包含封面、简介、难度、文章列表。
- [ ] 文章详情包含句子级阅读壳。
# UX-12 · 实现 Discover 入口屏幕规格

## 原文引用

- `planning/ux/09-screens-app.md`：“中国文化 12 类目。”
- `planning/ux/09-screens-app.md`：“网文小说 12 类目。”
- `content/china/00-index.md` 表格列出发现中国 12 类目。

## 需求落实

- 页面：`/discover`、`/discover/:category`、`/discover/:category/:slug` 视觉壳。
- 组件：DiscoverHome、CategoryGrid、ArticleCard、SentenceReader、AudioPlayer、BottomActions。
- API：后续 DC/NV 模块接入内容 API。
- 数据表：DC/NV 内容表由业务模块实现。
- 状态逻辑：未登录前 3 篇限制由 UA/DC 处理；UX 提供引导状态。

## 技术假设

- 小说可作为 `/novels` 独立路由，但 Discover 首页保留小说聚合入口。

## 不明确 / 风险

- 风险：Discover 同时承载文化和小说，信息密度高。
- 处理：页面分区明确，不把小说规则混入文化类目。

## 最终验收清单

- [ ] Discover 首页显示 12 文化类目和 12 小说类目入口。
- [ ] 类目页包含封面、简介、难度、文章列表。
- [ ] 文章详情包含句子级阅读壳。
