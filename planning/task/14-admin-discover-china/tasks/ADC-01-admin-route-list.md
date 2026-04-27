# ADC-01 · 建立 DC 后台路由与列表

## PRD 原文引用

- `AD-FR-006`：“DC：类目 + 文章 + 句子 CRUD。”
- `planning/ux/11-screens-admin.md`：“内容管理 - 文章 `/admin/content/articles`。”

## 需求落实

- 页面：`/admin/content/articles`。
- 组件：AdminDiscoverArticleTable、ArticleStatusBadge、ContentFilterBar。
- API：`GET /admin/api/content/discover/articles`。
- 数据表：`content_articles`、`content_categories`、`admin_audit_logs`。
- 状态逻辑：支持 draft/review/published/archived；editor/admin 可写，viewer 只读。

## 不明确 / 风险

- 风险：路径叫 articles，可能误以为只服务 DC。
- 处理：后台面包屑显示“内容管理 > 发现中国 > 文章”。

## 技术假设

- DC 文章列表筛选包含类目、状态、难度、作者、日期。

## 最终验收清单

- [ ] 列表分页、搜索、筛选可用。
- [ ] editor/admin 可进入编辑，viewer 只读。
- [ ] 列表展示类目、状态、HSK、作者、更新时间。
- [ ] API P95 < 500ms。