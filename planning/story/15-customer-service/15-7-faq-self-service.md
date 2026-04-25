# Story 15.7: FAQ 自助

Status: ready-for-dev

## Story

作为 **遇到问题的用户**，
我希望 **在「帮助中心」按分类浏览 / 搜索 FAQ，并对文章打分**，
以便 **大部分问题自助解决，减少客服等待**。

## Acceptance Criteria

1. **路由 `/help`**（公开 + 登录均可）：
   - 顶部搜索框（debounce 300ms）。
   - 分类 grid（8 类，icon + 名 + 文章数）。
   - 推荐文章（按 view_count desc 取 6）。
2. **分类页 `/help/c/:slug`**：
   - 分类下文章列表（按 published_at desc + view_count）。
   - 子搜索框（限分类内）。
3. **文章页 `/help/a/:slug`**：
   - markdown 渲染（remark + rehype）+ 代码高亮 + 图片懒加载。
   - 「这篇文章是否有用？」 thumbs up/down → 写 helpful_count / not_helpful_count。
   - 「联系客服」CTA → 打开 IM drawer 并预填话题。
   - 相关文章（同分类 + 关键词）。
4. **搜索接口** `GET /api/faq/search?q=&lang=`：
   - 后端走 Postgres FTS（按 lang 选 search_vector 列）。
   - 同时做 trigram fuzzy（pg_trgm）兜底拼写。
   - 返回 articles + 高亮 snippets。
   - P95 < 80ms。
5. **多语**：
   - 文章 title / content i18n_jsonb；前端按 user.preferred_lang 渲染，缺失回退 en。
   - 5 个 search_vector 列分别支持 zh/en/vi/th/id。
6. **IM 推荐 FAQ**：
   - 15-4 首次问候时拉 `/api/faq/suggestions?topic=` 显示 3 条。
   - 用户点击 → 打开文章。
7. **后台 CRUD**（admin）：
   - `/admin/faq/articles` 列表 + 编辑（markdown editor + i18n tabs）。
   - 状态机 draft / published / archived。
   - 翻译进度可视化（哪些语言缺失）。
8. **SEO**：所有 published 文章 SSR + sitemap + JSON-LD `FAQPage`。
9. **观测**：搜索词 top 100 报表（用于内容补全）；零结果率。
10. **A11y**：搜索结果列表 aria-live；文章 toc 键盘可达。

## Tasks / Subtasks

- [ ] **搜索后端**（AC: 4)
  - [ ] `apps/api/src/routes/faq/search.ts`
  - [ ] 词典 zhparser；pg_trgm 索引

- [ ] **页面**（AC: 1,2,3,5,8,10）
  - [ ] `/help`, `/help/c/[slug]`, `/help/a/[slug]`
  - [ ] markdown 渲染 + JSON-LD

- [ ] **打分接口**（AC: 3）
  - [ ] `POST /api/faq/articles/:id/feedback`

- [ ] **IM 推荐**（AC: 6）
  - [ ] `/api/faq/suggestions` 调 15-8 语义匹配

- [ ] **admin CRUD**（AC: 7）
  - [ ] `/admin/faq/`
  - [ ] 多语 editor

- [ ] **观测**（AC: 9）
  - [ ] search log 表 + Grafana

## Dev Notes

### 关键约束
- 文章 url 用语言无关 slug；hreflang 4+1。
- helpful 比率 < 30% 自动告警内容质量。
- 搜索 q 长度 ≤ 100，rate-limit 30/min/ip。

### 关联后续 stories
- 15-4 IM 推荐
- 15-8 AI 语义增强（v1 fts，v2 embedding）
- 15-1 schema

### Project Structure Notes
- `apps/app/src/routes/help/`
- `apps/api/src/routes/faq/`
- `apps/admin/src/routes/faq/`
- `packages/db/migrations/*_faq_search_vectors.sql`

### References
- `planning/epics/15-customer-service.md` ZY-15-07

### 测试标准
- 集成：4 语搜索均命中
- 性能：P95 < 80ms
- A11y：axe
- SEO：JSON-LD validator

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
