# Story 14.4: 邀请落地页 /r/:code

Status: ready-for-dev

## Story

作为 **被邀请的访客**，
我希望 **打开 `/r/:code` 看到邀请人的脱敏信息并被引导注册**，
以便 **完成绑定，邀请人能拿到佣金；同时被邀请人不会被泄漏邀请人完整身份**。

## Acceptance Criteria

1. 路由 `/r/:code`（SSR）解析 `code`：
   - 校验 `referral_codes` 存在 → 渲染落地页。
   - 不存在 / 已禁用（owner 被冻结）→ 404 页面。
2. 页面内容：
   - 邀请人头像（或默认）+ 脱敏名（如 `Mei****`）。
   - 「{name} 邀请你来知语学中文」标语 4 语。
   - 「立即注册」CTA → 跳 `/auth/signup?ref=:code`。
   - 不显示完整邀请码字符串（URL 中是工程必要，但页面正文不复读）。
3. **30 天 cookie**：
   - 写 `ref_code`（HttpOnly=false 因前端注册需读 / Secure / SameSite=Lax / Max-Age=30d / Path=/）。
   - 同时写 `ref_landed_at`（用于反作弊时间维度）。
4. 已登录用户访问：
   - 已绑定 → 显示「您已是 {inviter} 的下线」+ 跳 `/`。
   - 未绑定（边缘场景：先注册后被邀请）→ 不写 cookie 不绑定（避免反向作弊）。
5. 注册成功后（E03 注册流程读取 `ref_code` cookie）：
   - 调 `referralService.bindParent(newUserId, code)`（14-5 实现）。
   - 立即标 `is_effective=true`（v1 简化，不等付费）。
   - 清 cookie。
6. SEO：`<meta name="robots" content="noindex,nofollow" />`；不进 sitemap。
7. 反爬：UA 含已知 bot 关键词（`Googlebot`, `Bingbot` 等）→ 服务端返回简化版（不写 cookie）。
8. 监控：landing PV / 注册转化率埋点；P95 SSR < 400ms。
9. 多语：根据 `Accept-Language` 自动渲染，URL 不带 lang 参数。
10. A11y：键盘可操作；CTA 显眼。

## Tasks / Subtasks

- [ ] **后端 SSR 路由**（AC: 1,7,9）
  - [ ] `apps/app/src/routes/r.$code.tsx`（TanStack Router SSR）
  - [ ] loader 调 `GET /api/referral/landing?code=` → inviter 脱敏信息
  - [ ] bot 检测中间件

- [ ] **后端 landing API**（AC: 1）
  - [ ] `apps/api/src/routes/referral/landing.ts`
  - [ ] 返回 `{inviter_display_masked, inviter_avatar_url, exists}`
  - [ ] 拒返回 user_id / email / 完整 name

- [ ] **cookie 写入**（AC: 3,4）
  - [ ] SSR response Set-Cookie
  - [ ] 已登录跳过

- [ ] **bind 钩子触发点**（AC: 5）
  - [ ] 在 E03 注册 success handler 读 cookie 调 14-5

- [ ] **埋点 + 监控**（AC: 8）

- [ ] **多语 + a11y**（AC: 9,10）

## Dev Notes

### 关键约束
- cookie SameSite=Lax 才能跨站写入（朋友点击 WhatsApp 分享链直达）。
- 脱敏规则：保留首 2 + `****`；中文取首 1 字 + `**`。
- 如 referrer 头存在 social.com / 站外 → 接受 cookie；如 referrer 来自本站非 /r/* → 不重写 cookie（防覆盖）。

### 关联后续 stories
- 14-5 接续 bindParent 反作弊
- 14-2 提供 code
- E03 注册流程触发

### Project Structure Notes
- `apps/app/src/routes/r.$code.tsx`
- `apps/api/src/routes/referral/landing.ts`
- `apps/app/src/features/referral/LandingPage.tsx`

### References
- `planning/epics/14-referral.md` ZY-14-04

### 测试标准
- 集成：cookie 正确写入；过期不写
- E2E：访客 → 注册 → 自动绑定上级
- SEO：响应头 `X-Robots-Tag: noindex`

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
