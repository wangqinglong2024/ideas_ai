# Story 19.8: Web Vitals RUM

Status: ready-for-dev

## Story

作为 **前端 / 性能工程师**，
我希望 **生产环境前端真实采集 Web Vitals（LCP / INP / CLS / TTFB / FCP）并按页面 / 国家 / 设备拆分仪表板**，
以便 **持续监控 Core Web Vitals，定位慢页面，达成 Lighthouse ≥ 95 与营销站 SEO 排名（20-2）**。

## Acceptance Criteria

1. 引入 `web-vitals` v4，`onLCP / onINP / onCLS / onTTFB / onFCP` 在 idle 时上报。
2. 上报通道：PostHog 自定义事件 `webvitals.metric` + Sentry Performance metric；payload 含 `metric / value / rating / page / route / country / device / connection / device_memory / app_version`。
3. **路由 attribution**：Next.js App Router 路由切换时 `path` 取规范模板 `/courses/[id]`，**不上报真实参数**。
4. 国家来自 Vercel/Cloudflare header 或 IP 解析；device 来自 UA-CH（`Sec-CH-UA-Mobile`）。
5. PostHog 仪表板（19-5 母仪表板的子页）：
   - LCP / INP / CLS p75 by route
   - by country（VN / TH / ID / SG）
   - by device（mobile / desktop / tablet）
   - 7d trend + 28d
6. **告警**：路由 LCP p75 > 2.5s 或 INP p75 > 200ms 持续 30min → Slack（19-6）。
7. 同时上报到 Better Stack `web_vitals` log（结构化），方便长期归档与 BI 关联。
8. 不影响首屏：上报代码异步加载、无阻塞、bundle ≤ 6KB gzip。
9. 单元 + E2E：模拟 metric 事件触发上报；bundle size CI 守门。

## Tasks / Subtasks

- [ ] **采集**（AC: 1, 2, 3, 4, 8）
  - [ ] `apps/web/app/providers/WebVitals.tsx`
  - [ ] `packages/analytics/src/web-vitals.ts`
  - [ ] route template util
- [ ] **后端**（AC: 5, 7）
  - [ ] PostHog dashboard JSON（保存到 `infra/posthog/dashboards/web-vitals.json`）
  - [ ] Better Stack drain（标签 `vitals=true`）
- [ ] **告警**（AC: 6）
  - [ ] PostHog Insights → Slack webhook（19-6）
- [ ] **预算**（AC: 8）
  - [ ] `pnpm size-limit`；budget 6KB
- [ ] **测试**（AC: 9）
  - [ ] vitest mock metric callbacks
  - [ ] Playwright 真实页面捕获 LCP

## Dev Notes

### 关键约束
- **不要**上报 query string；`route` 必须为模板（避免高基数）。
- PostHog 事件量大：可在客户端 `sample 0.5` for marketing site 静态页。
- INP（v4 替代 FID）需用户交互后才有；首屏页可能为空，仪表板需空值过滤。
- 关注移动端弱网（VN/TH 4G 较弱）：connection.effectiveType 必带。

### 关联后续 stories
- 19-3：复用 PostHog client
- 19-5：母仪表板嵌入
- 19-6：阈值告警
- 20-1：营销站性能基线
- 20-2：SEO Core Web Vitals

### Project Structure Notes
- `apps/web/app/providers/WebVitals.tsx`
- `packages/analytics/src/web-vitals.ts`
- `infra/posthog/dashboards/web-vitals.json`

### References
- [planning/epics/19-observability.md ZY-19-08](../../epics/19-observability.md)
- [planning/spec/10-observability.md § 4](../../spec/10-observability.md)

### 测试标准
- 单元：mock onLCP/INP/CLS 触发 → posthog.capture 被调用
- 集成：Playwright LCP/INP 真实测量 ≤ 阈值
- 预算：bundle ≤ 6KB gzip

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
