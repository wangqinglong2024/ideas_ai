# DC-15 · 实现发现中国搜索

## PRD 原文引用

- `DC-FR-011`：“顶部搜索框 → 关键词匹配标题 / 正文中文 / 关键点。”
- `DC-FR-011`：“后端：PostgreSQL FTS（pg_trgm）。”
- `DC-FR-011`：“结果：分页 20/页 + 高亮。”

## 需求落实

- 页面：`/discover/search`。
- 组件：DiscoverSearchBox、SearchResultList、HighlightText。
- API：`GET /api/discover/search?q=&page=&limit=`。
- 数据表：`content_articles`、`content_sentences`。
- 状态逻辑：未登录搜索结果中第 4-12 类目的点击仍走门禁；登录后全部可打开。

## 不明确 / 风险

- 风险：母语关键词搜索范围未完全定义。
- 处理：v1 支持中文标题/正文/key_point 与翻译 JSONB 简单匹配；排序后续优化。

## 技术假设

- 使用 Postgres FTS + trigram，不引入独立搜索服务。

## 最终验收清单

- [ ] 搜索“饺子”等中文词返回相关文章。
- [ ] 结果高亮匹配文本。
- [ ] 分页 20/页。
- [ ] 权限门禁不因搜索绕过。