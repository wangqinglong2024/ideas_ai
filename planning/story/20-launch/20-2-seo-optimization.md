# Story 20.2: SEO 优化

Status: ready-for-dev

## Story

作为 **SEO / 增长**，
我希望 **营销站完整实现 sitemap、robots、schema.org、hreflang、OG / Twitter cards**，
以便 **4 国 5 语自然搜索流量起量，社媒分享卡片美观**。

## Acceptance Criteria

1. **sitemap.xml**：动态生成（Next `app/sitemap.ts`），含所有静态页 + 博客 + locale 变体；分片 ≤ 50K url。
2. **robots.txt**：允许全站；禁 `/api/`、`/admin/`、preview env；指向 sitemap。
3. **hreflang**：每页 `<link rel=alternate hreflang>` 含 5 语 + `x-default`；URL 一致性（小写 / 末斜杠规则统一）。
4. **schema.org**：
   - `Organization`（站点全局）
   - `Course` / `Product`（课程页）
   - `Article` / `BlogPosting`（博客）
   - `FAQPage`（FAQ）
   - `WebSite + SearchAction`
5. **OG / Twitter Cards**：每页 `og:title / og:description / og:image / og:locale / twitter:card=summary_large_image`；OG 图 1200×630，自动按页面动态生成（`opengraph-image.tsx`）。
6. **Canonical**：自动 `rel=canonical`，参数页统一基础 URL。
7. **性能 + Core Web Vitals**：CWV 通过 19-8 监控，目标全部 Good 等级（LCP < 2.5s / INP < 200ms / CLS < 0.1）。
8. **结构化数据校验**：CI 集成 schema.org validator + Google Rich Results test（fixture 页面）。
9. **Search Console**：4 国分别提交（zhiyu.io / hreflang）；Bing Webmaster 同步。
10. **404 / 500**：自定义 + 链接到主推页面 + noindex。

## Tasks / Subtasks

- [ ] **sitemap / robots**（AC: 1, 2）
  - [ ] `apps/marketing/app/sitemap.ts` / `robots.ts`
- [ ] **hreflang / canonical**（AC: 3, 6）
  - [ ] `lib/seo.ts` util；`generateMetadata` 统一
- [ ] **schema.org**（AC: 4, 8）
  - [ ] JSON-LD 组件 per type
  - [ ] CI validator script
- [ ] **OG image**（AC: 5）
  - [ ] `app/**/opengraph-image.tsx`（@vercel/og）
- [ ] **404/500**（AC: 10）
  - [ ] `not-found.tsx` / `error.tsx`
- [ ] **Search Console**（AC: 9）
  - [ ] 4 国 property + 验证 token
  - [ ] runbook：提交 sitemap 步骤

## Dev Notes

### 关键约束
- hreflang **必须互相引用**，缺失会被 Google 忽略；CI 校验。
- OG 图字符串地区差异：4+1 语版本各一张（动态渲染）。
- robots 禁 preview env：通过 `process.env.RENDER_GIT_BRANCH !== 'main'` 全站 noindex。
- 不允许同 URL 多 canonical 自指 + 跨域 conflict。
- 静态页 ISR 60s 即可；博客 ISR 1h。

### 关联后续 stories
- 20-1：营销站基础已就位，本 story 强化
- 19-8：CWV 监控
- 20-9：legal 页面 schema 类型 `WebPage`

### Project Structure Notes
- `apps/marketing/app/sitemap.ts` / `robots.ts`
- `apps/marketing/lib/seo.ts`
- `apps/marketing/app/**/opengraph-image.tsx`
- `scripts/seo-validate.ts`

### References
- [planning/epics/20-launch.md ZY-20-02](../../epics/20-launch.md)
- [planning/spec/03-frontend.md](../../spec/03-frontend.md)

### 测试标准
- 单元：generateMetadata 输出 snapshot
- 集成：sitemap 含全部期望 URL
- 第三方：Google Rich Results test 通过；hreflang 工具 0 错

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
