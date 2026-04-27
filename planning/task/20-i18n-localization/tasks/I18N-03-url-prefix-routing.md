# I18N-03 · URL 前缀路由与重定向

## PRD 原文引用

- `I18N-FR-002`：“URL 前缀 `/en /vi /th /id`；根路径按浏览器首选语重定向；切换保留 path。”

## 需求落实

- React Router 配置：`<Route path=":lang/*" element={<LangShell/>}/>`；`lang` ∈ `LANGUAGES`。
- 根路径 `/` 中间件（client + server SSR 双层）：检测 cookie/Accept-Language → 302 到 `/{lang}{path}`。
- 切换语言：`navigate(replaceLangInPath(currentPath, newLang))`，cookie 同步更新。
- 用户裁决：URL 前缀新增 `/zh-CN`。

## 状态逻辑

- 路径片段 lang 与 cookie / 用户偏好不一致时，**URL 优先**（便于分享链接）；同时静默更新 cookie。
- 不识别的 lang 前缀 → 302 到默认 `/en`。

## 不明确 / 风险

- 风险：原有未带前缀的旧链接 SEO 损失。
- 处理：旧链接 301 到对应 lang 前缀；保留 sitemap 跳转。

## 技术假设

- SSR 中间件位于 `apps/web/src/middleware/lang-redirect.ts`。
- admin 后台不带前缀（admin 仅 1 内部语，按 user.preferences.ui_lang 切）。

## 最终验收清单

- [ ] `/` 按浏览器语跳到 `/{lang}/`。
- [ ] `/vi/discover` 切到 th 后变 `/th/discover`。
- [ ] `/zz/foo` 兜底跳 `/en/foo`。
- [ ] cookie `zhiyu_lang` 同步。
- [ ] 旧链接 301 重定向。
