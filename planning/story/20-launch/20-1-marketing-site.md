# Story 20.1: 营销站 zhiyu.io

Status: ready-for-dev

## Story

作为 **市场 / 增长**，
我希望 **拥有独立的营销站 zhiyu.io，覆盖落地 / 定价 / 课程介绍 / 博客 / 关于，4+1 语，并在 Lighthouse ≥ 95**，
以便 **承载 SEO、付费投放、品牌曝光，并将访客高效转化到 app 注册**。

## Acceptance Criteria

1. 独立部署：`apps/marketing`（Next.js 15 App Router + RSC + ISR），域名 `zhiyu.io`（app 在 `app.zhiyu.io`），独立于主 app 部署管线（与 19-7 状态页类似考虑）。
2. **页面**：
   - `/`（落地：hero / 价值主张 / 课程预览 / 4 国本地化 social proof / CTA）
   - `/pricing`（4 档：试用 / 月 / 年 / 终身 + 4 国本地货币）
   - `/courses/[slug]`（HSK / 日常 / 商务 / 工厂 4 类介绍页）
   - `/blog` + `/blog/[slug]`（CMS 内容；MVP 阶段静态 mdx，v1.5 接 admin CMS）
   - `/about` / `/contact` / `/legal/{privacy,tos,refund,cookie}`（联动 20-9）
3. **i18n**：VN / TH / ID / EN / 中（5 语）；URL `/{locale}/...`，hreflang 完整（联动 20-2）；中文为内部默认参考语言。
4. **性能**：Lighthouse Mobile ≥ 95（Performance / Accessibility / Best Practices / SEO）；首屏 LCP < 1.8s；JS bundle ≤ 80KB gzip。
5. **图片**：`next/image` + AVIF/WebP；hero 视频 ≤ 2MB + poster；CDN Cloudflare。
6. **CTA 跟踪**：所有「免费试用 / 注册 / 下载 PWA」按钮埋 PostHog `marketing.cta_clicked { variant, page }`（联动 19-3）。
7. **A/B**：hero 标题 / CTA 文案 / 价格展示通过 PostHog Feature Flag 控制变体（≥ 2 组）。
8. **可访问性**：WCAG 2.1 AA；键盘导航；alt / aria-label 完整。
9. **SEO 基础**：meta / OG / Twitter cards / sitemap / robots（详细在 20-2，本 story 接好 hooks）。
10. **Cookie Banner**：4+1 语；GDPR + 4 国合规；选择前不加载非必要脚本（联动 20-6 / 20-9）。

## Tasks / Subtasks

- [ ] **脚手架**（AC: 1）
  - [ ] `apps/marketing` Next.js 15 + RSC + ISR
  - [ ] 独立 Render service + 域名
- [ ] **页面**（AC: 2）
  - [ ] 路由 / 组件 / mdx 博客
- [ ] **i18n**（AC: 3）
  - [ ] next-intl + 5 语 messages
  - [ ] middleware locale negotiation
- [ ] **性能**（AC: 4, 5）
  - [ ] image optimization
  - [ ] route segment config（ISR 1h）
  - [ ] size-limit + lighthouse CI
- [ ] **埋点 / A/B**（AC: 6, 7）
  - [ ] PostHog provider
  - [ ] Feature Flag wrapper
- [ ] **A11y / Cookie**（AC: 8, 10）
  - [ ] axe CI
  - [ ] 自研 CookieConsent 组件
- [ ] **SEO hooks**（AC: 9）
  - [ ] generateMetadata + sitemap stub（20-2 完整化）

## Dev Notes

### 关键约束
- 营销站 **独立 repo / app**，避免与主 app 互相阻塞部署。
- 价格展示按 IP 地理推断默认货币，但允许用户切换；汇率每日定时刷新。
- Cookie banner 前**禁止**加载 PostHog autocapture / GTM / Pixel（20-6）；点同意才注入。
- 文案必须经市场审校；中文为基准，其他 4 语翻译并人审（联动 E04）。

### 关联后续 stories
- 20-2 SEO：sitemap / hreflang / schema.org 完整化
- 20-6 Pixels：CTA 与转化事件接入
- 20-9 法律：legal 页面内容
- 19-8 RUM：Web Vitals 监控
- 19-3 PostHog：埋点事件

### Project Structure Notes
- `apps/marketing/` 独立
- `apps/marketing/messages/{vi,th,id,en,zh}.json`
- `apps/marketing/content/blog/`
- `infra/render-marketing.yaml`

### References
- [planning/epics/20-launch.md ZY-20-01](../../epics/20-launch.md)
- [planning/spec/03-frontend.md](../../spec/03-frontend.md)
- [planning/spec/08-deployment.md](../../spec/08-deployment.md)

### 测试标准
- 单元：组件渲染 + i18n 切换
- E2E：5 语 × 主流程跳转
- 性能：lighthouse CI ≥ 95；size-limit 守门
- A11y：axe 0 violations

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
