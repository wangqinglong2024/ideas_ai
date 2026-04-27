# UX-11 · 建立应用端关键屏幕壳

## 原文引用

- `planning/ux/09-screens-app.md`：“Splash / 启动屏。”
- `planning/ux/09-screens-app.md`：“Onboarding（首次进入）。”
- `planning/ux/09-screens-app.md`：“登录 / 注册。”

## 需求落实

- 页面：Splash、Onboarding、Login、Register、ForgotPassword、VerifyEmail、Profile shell、Paywall/Error shells。
- 组件：SplashScreen、OnboardingStep、AuthCard、ProgressDots。
- API：登录注册 API 由 UA 模块接入。
- 数据表：无。
- 状态逻辑：首次进入走 onboarding；可跳过；登录注册可 modal 或页面。

## 技术假设

- Splash <1.5s 后跳转。
- 第三方 Apple/TikTok 标为 v1.5，不进入 W0 必须实现。

## 不明确 / 风险

- 风险：UX 写 zh/en/vi/th/id 五选一，但产品 v1 UI 是 en/vi/th/id。
- 处理：中文 UI 作为后台/后续评估，应用端 v1 按 I18N PRD 四语。

## 最终验收清单

- [ ] Splash、Onboarding、Auth 页面可访问。
- [ ] Onboarding 支持跳过。
- [ ] Auth 页面使用 `.glass-elevated`。
# UX-11 · 建立应用端关键屏幕壳

## 原文引用

- `planning/ux/09-screens-app.md`：“Splash / 启动屏。”
- `planning/ux/09-screens-app.md`：“Onboarding（首次进入）。”
- `planning/ux/09-screens-app.md`：“登录 / 注册。”

## 需求落实

- 页面：Splash、Onboarding、Login、Register、ForgotPassword、VerifyEmail、Profile shell、Paywall/Error shells。
- 组件：SplashScreen、OnboardingStep、AuthCard、ProgressDots。
- API：登录注册 API 由 UA 模块接入。
- 数据表：无。
- 状态逻辑：首次进入走 onboarding；可跳过；登录注册可 modal 或页面。

## 技术假设

- Splash <1.5s 后跳转。
- 第三方 Apple/TikTok 标为 v1.5，不进入 W0 必须实现。

## 不明确 / 风险

- 风险：UX 写 zh/en/vi/th/id 五选一，但产品 v1 UI 是 en/vi/th/id。
- 处理：中文 UI 作为后台/后续评估，应用端 v1 按 I18N PRD 四语。

## 最终验收清单

- [ ] Splash、Onboarding、Auth 页面可访问。
- [ ] Onboarding 支持跳过。
- [ ] Auth 页面使用 `.glass-elevated`。
