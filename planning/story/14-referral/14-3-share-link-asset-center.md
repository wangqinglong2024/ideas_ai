# Story 14.3: 分享链接 + 素材中心

Status: ready-for-dev

## Story

作为 **想邀请朋友的付费 / 普通用户**，
我希望 **一键复制专属分享链接、下载海报、调起 WhatsApp / Line / Zalo / Facebook 分享**，
以便 **快速触达东南亚潜在用户，且任何场景都不暴露纯邀请码字符串**。

## Acceptance Criteria

1. `GET /api/me/referral/share-link`：
   - 入参：无（基于会话用户）。
   - 出参：`{ url: "https://zhiyu.app/r/AB3K7Z", short_url?: string, generated_at }`。
   - 不返回单独 `code` 字段（仅 URL 整体）。
2. 4 语种邀请文案模板（zh / en / vi / th / id），位于 `packages/i18n/locales/{lang}/referral-share.json`：
   - 包含 `{{url}}` 占位符。
   - 文案不含纯 code 文本（不要让用户复制 6 位字符）。
3. QR 海报生成：
   - `GET /api/me/referral/poster?lang=zh&theme=festive` 返回 PNG（1080×1920）。
   - 含：用户头像 + display_name + 二维码（二维码内容 = share URL）+ 标语 + 知语 logo。
   - 服务端用 `@napi-rs/canvas` 或 satori 生成，缓存 24h（Redis key by user_id+lang+theme）。
   - 4 语 + 3 主题（默认 / 节庆 / 学习）= 12 种组合。
4. 分享意图（前端 helper）：
   - WhatsApp: `https://wa.me/?text={encoded(template)}`
   - Line: `https://line.me/R/share?text=...`
   - Zalo: 通过 Zalo SDK
   - Facebook: `https://www.facebook.com/sharer/sharer.php?u={url}`
   - 系统级：`navigator.share({ url, text })` fallback。
5. UI `/me/referral` 顶部「邀请朋友」卡片：
   - 显示链接（不显示纯 code，URL 整体可复制）。
   - 复制按钮 + toast。
   - 海报按钮 → 下载图。
   - 分享按钮组（按 country_code 排序：VN→Zalo 优先，TH→Line 优先 等）。
6. **任何 UI / API 不显示纯 code 字符串**（即使在 URL 中是工程必要，但不单独突出展示 code 部分；前端不要把 URL 拆分高亮 code）。
7. 短链可选：调内部短链服务 `https://zy.gg/r/abc` 生成；失败回退完整 URL。
8. 监控：海报生成 P95 < 800ms；缓存命中率 > 70%。
9. 速率限制：`/poster` 每用户每 10min 最多 6 张（防止滥用）。
10. SEO：`/r/:code` 页（14-4）不索引（noindex meta）。

## Tasks / Subtasks

- [ ] **share-link API**（AC: 1）
  - [ ] `apps/api/src/routes/me/referral/share-link.ts`

- [ ] **海报生成**（AC: 3,8,9）
  - [ ] `packages/referral/poster/generate.ts`（satori + sharp）
  - [ ] 模板 12 套
  - [ ] Redis 缓存 + rate-limit

- [ ] **i18n 文案**（AC: 2）
  - [ ] `packages/i18n/locales/{zh,en,vi,th,id}/referral-share.json`

- [ ] **前端 UI**（AC: 4,5,6）
  - [ ] `apps/app/src/features/referral/ShareCard.tsx`
  - [ ] `useReferralShare` hook
  - [ ] 国家化分享按钮排序

- [ ] **短链服务**（AC: 7）
  - [ ] 内部 `packages/short-url/`（v1 简版：DB + redirect）

- [ ] **观测**（AC: 8）
  - [ ] metrics：poster generate latency / cache hit ratio

## Dev Notes

### 关键约束
- 海报二维码使用 `qrcode` 库；纠错等级 M。
- 海报字体使用 Noto Sans（多语支持），bundle 下来到 `packages/assets/fonts/`。
- 不要在前端把 URL 中的 code 部分用 `<span class="code">` 突出 → 视觉上还是「不展示 code」。

### 关联后续 stories
- 14-4 落地页消费 URL
- 14-9 仪表板嵌入本组件
- 14-2 提供 code（仅 URL 用）

### Project Structure Notes
- `apps/api/src/routes/me/referral/share-link.ts`
- `apps/api/src/routes/me/referral/poster.ts`
- `packages/referral/poster/`
- `apps/app/src/features/referral/ShareCard.tsx`
- `packages/i18n/locales/*/referral-share.json`

### References
- `planning/epics/14-referral.md` ZY-14-03
- `planning/prds/09-referral/01` RF-FR-002

### 测试标准
- 单元：模板渲染 4 语
- 集成：海报缓存命中
- E2E：4 个分享渠道意图能正确打开
- 安全：响应 schema 不含 code 字段（contract test）

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
