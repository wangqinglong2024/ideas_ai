# SaaS / 厂商替换映射（authoritative override）

> 作用：所有 prds / ux / spec / epics / stories 中如出现下列旧厂商名，**以本表为准**。  
> 顶层规则：[planning/00-rules.md](./00-rules.md) §1.1.x 禁用清单。  
> 落地形态：均为 monorepo `apps/` + `packages/` 内代码 + 自托管，缺 key → Fake adapter，写入 `system/.env`。

## 替换对照表

| 旧（PRD/UX 旧文）| 新（00-rules 落地）| 适配位置 |
|---|---|---|
| Paddle / LemonSqueezy / Stripe / Stripe Dashboard | `PaymentAdapter` 接口 + `PaymentFakeAdapter`（生产期间替换为自有支付通道实现）| `system/packages/payments/` (E13) |
| Cloudflare WAF / Turnstile / Bot Fight | nginx (`/opt/gateway`) + `@zhiyu/ratelimit` (Redis-Lua) + `CaptchaAdapter` Fake | E18 ZY-18-02/03/08 |
| Cloudflare CDN / R2 / Image Resizing | nginx 反代 + Supabase Storage + 自实现 image transform 端点 | E01/E18 |
| Sentry / @sentry/* | `error_events` 表 + admin 错误中心 + pino 日志 | E19 ZY-19-02 |
| PostHog / posthog-js / GA4 / Mixpanel / GTM | `events` 表（月分区）+ events SDK + `PixelAdapter` Fake | E19 ZY-19-03, E20 ZY-20-03 |
| Better Stack | prom-client metrics + admin 大盘 + alerts 表 | E19 ZY-19-04..06 |
| Doppler | `system/.env` + zod env 校验 | E01 ZY-01-04 |
| GitHub Actions | 本地 Docker compose + `pnpm turbo run` 任务 | E01 ZY-01-03 |
| Vercel / Render / Fly / Netlify | nginx + docker compose + zhiyu-* 容器组 | spec/08-deployment |
| Auth0 / Clerk | Supabase GoTrue + 自有 `argon2id` 密码 + TOTP | E03/E18 |
| Socket.io / Pusher / OneSignal | supabase-realtime broadcast + 通知中心表 + `PushAdapter` Fake | E05 ZY-05-06 / E15 ZY-15-02 |
| LangChain / LangGraph (v1) / Vercel AI SDK | `LLMAdapter` 接口 + `LLMFakeAdapter` + 自实现编排 | E16 ZY-16-01 |
| Pinecone / Weaviate / Meilisearch v1 | Postgres pgvector + pg_jieba FTS | E06 ZY-06-06 |
| Chromatic / Percy / BrowserStack | 本地 Storybook + Playwright + MCP Puppeteer | S20 ZY-20-02 |
| Google Fonts CDN | 自托管 woff2 子集 (`apps/*/public/fonts/`) | E02 ZY-02-04 |
| MUI / Ant Design / daisyUI / Chakra | shadcn/ui + Radix + Tailwind v4 + `packages/ui` | E02 |
| Cloudflare Workers / Edge Functions（业务逻辑）| Express API（apps/api 8100）| 全局 |

## 阅读规则

1. 任意 PRD/UX 文档若与本表冲突，**以本表 + 00-rules.md 为准**。
2. 遗留旧名暂未逐字段替换者，开发时须按本表取等价实现。
3. 新增章节禁止再使用上表「旧」列任一名称。
