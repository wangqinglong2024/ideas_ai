# I18N-08 · SEO hreflang/sitemap

## PRD 原文引用

- `I18N-FR-007`：“html lang、alternate hreflang、x-default、每语 sitemap、og:locale。”

## 需求落实

- SSR Head：`<html lang={ui_lang}>`、`<link rel='alternate' hreflang='en' href='https://.../en/...'/>` × 5 lang + `x-default`。
- og:locale：`zh_CN / en_US / vi_VN / th_TH / id_ID`。
- Sitemap：`/sitemap.xml` 索引指向 `/sitemap-{lang}.xml`，每个 lang 列出该语版 URL（5 文件）。
- robots.txt 允许全部 lang 前缀。

## 状态逻辑

- hreflang 自动从路由表生成；SSG/SSR 时静态写入 `<head>`。
- 内容详情页（DC 文章 / NV 小说 / CR 课程）按 published 状态出现在 sitemap。

## 不明确 / 风险

- 风险：仅 zh 内容（如 zh 独有 article）在 vi/th 是否出 alternate？
- 处理：仅当 translations 该语完整度 > 0 时才出 hreflang；否则只在 zh-CN sitemap 中。

## 技术假设

- canonical = current lang URL；hreflang 互链全部 5 语。

## 最终验收清单

- [ ] view-source 看见 5 + 1 alternate 链接。
- [ ] 5 个 sitemap 文件可访问。
- [ ] og:locale 按 ui_lang 切换。
- [ ] robots.txt 不阻止 lang 前缀。
- [ ] hreflang 跳过未翻译语。
