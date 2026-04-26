# ZY-06-06 · 全文搜索（Postgres FTS + jieba）

> Epic：E06 · 估算：L · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] supabase-db 容器安装 `zhparser` 或 `pg_jieba`（Dockerfile 扩展或 init script）
- [ ] `articles.fts_vector` 生成列（`to_tsvector('jiebacfg', title || ' ' || body)`）
- [ ] BE `/api/v1/discover/search?q=&lang=&category=`：`@@` 查询 + ts_rank 排序 + ts_headline 高亮
- [ ] FE：双栏（桌面）/ 单栏（移动）
- [ ] 命中高亮 `<mark>` 标签

## 测试方法
- 集成：搜索"长城"命中、"changcheng"（拼音）命中（pg_trgm）
- P95 < 500ms（10000 篇 fixture）

## DoD
- [ ] 搜索命中准确
- [ ] 容器内扩展安装成功（一次性 init）
