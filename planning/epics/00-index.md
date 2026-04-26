# Epics 总览（v1 · 单一 dev 环境）

> 顶层约束（强制）：[planning/00-rules.md](../00-rules.md)
> Docker only · 单一 dev 环境（115.159.109.23）· 端口 3100/8100/4100/9100 · schema `zhiyu` · supabase 自托管优先 · 缺 key 自动 fake adapter
> 生产 / staging / 域名 / CDN / WAF / 应用商店 / 真实第三方 SaaS 接入 = **用户后续自行处理**，不在本 planning 范围。

## Epic 清单

| ID  | 名称              | 阶段 | 故事数 | 优先级 | 状态        |
| --- | ----------------- | ---- | ------ | ------ | ----------- |
| E01 | 平台基建          | M0   | 8      | P0     | ✅ 已重写   |
| E02 | 设计系统          | M0   | 7      | P0     | ✅ 已重写   |
| E03 | 用户账户          | M1   | 6      | P0     | ✅ 已重写   |
| E04 | 国际化与本地化    | M1   | 5      | P0     | ✅ 已重写   |
| E05 | 应用骨架与导航    | M1   | 6      | P0     | ✅ 已重写   |
| E06 | 中国发现          | M2   | 6      | P0     | ✅ 已重写   |
| E07 | 学习引擎          | M2   | 7      | P0     | ✅ 已重写   |
| E08 | 课程模块          | M3   | 6      | P0     | ✅ 已重写   |
| E09 | 游戏引擎          | M3   | 10     | P0     | ✅ 已重写   |
| E10 | 12 款游戏专区     | M3   | 15     | P0     | ✅ 沿用     |
| E11 | 小说模块          | M4   | 6      | P0     | ✅ 已重写   |
| E12 | 经济与商城（ZC）  | M5   | 8      | P0     | ✅ 已重写   |
| E13 | 支付（Adapter+fake） | M5 | 6      | P0     | ✅ 已重写   |
| E14 | 分销系统          | M5-6 | 9      | P0     | ✅ 已重写   |
| E15 | 客服 IM 与工单    | M6   | 7      | P0     | ✅ 已重写   |
| E16 | AI 内容工厂占位   | -    | 3      | P2     | ✅ 已 defer |
| E17 | 管理后台          | M3-5 | 10     | P0     | ✅ 已重写   |
| E18 | 安全与合规        | 贯穿 | 8      | P0     | ✅ 已重写   |
| E19 | 可观测与运维      | 贯穿 | 8      | P0     | ✅ 已重写   |
| E20 | 上线与发布（dev 验收）| M6 | 6     | P0     | ✅ 已重写   |
| E99 | Post-MVP Backlog  | -    | -      | -      | ✅ 标注     |

**总计**：20 个 epic，约 137 个 story（按需切分，未来 wave 中拆分到 `planning/story/` 目录）。

## 重写原则（本轮已应用）

1. **单一 dev 环境**：所有文件不再出现 dev/staging/prod 切分；只有一个 `docker-compose.yml`、schema = `zhiyu`、单组端口 3100/8100/4100/9100。
2. **Supabase 自托管优先**：Auth / Storage / Realtime / Edge Functions / pgvector 优先复用；不重复造轮子。
3. **Adapter + fake 模式**：所有第三方依赖（Email / SMS / Push / Payment / Captcha / LLM / TTS / ASR / WebSearch / Workflow）以 Adapter 接口 + Fake 实现交付；缺 key 自动启用 fake，不阻塞 dev 验收。
4. **禁用清单**（明确移除）：Cloudflare、Render、Doppler、Sentry、PostHog、Better Stack、Logtail、Upstash Redis、PagerDuty、Slack 直接集成、Resend、Paddle/LemonSqueezy 直接 SDK、Dify、Vercel/Netlify/Fly.io、Chromatic、GitHub Actions 自动化、Turnstile/Recaptcha 真实接入。
5. **Story 数量按需**：不再统一 10 条；E13 / E15 / E16 已大幅收敛，E14 保持 9 条，E10 沿用既有 15 条 MVP 切分。
6. **测试方法**：每 epic 在 DoD / Stories AC 中要求 `docker compose run/exec` 或 MCP Puppeteer 直连容器对外端口验证。
7. **未来重写预告**：E16 占位指向「LangGraph(TS) + Vercel AI SDK + Anthropic Claude / DeepSeek」未来阶段；当前 dev 周期不消耗 LLM key。

## 下一波（待执行）

- Wave 2：按新 epics 重写 `planning/story/02-20/*` 故事文件
- Wave 3：按新 epics 重写 `planning/sprint/02-20.md` 与 `sprint/sprint-status.yaml`
- Wave 4：清理 `planning/prds/` 与 `planning/ux/` 中残留的 Cloudflare/Sentry/PostHog 引用
