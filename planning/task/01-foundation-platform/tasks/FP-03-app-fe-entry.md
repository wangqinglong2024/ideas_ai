# FP-03 · 建立 App PWA 前端入口

## 原文引用

- `planning/spec/01-overview.md`：“App PWA | 学习者 Web/PWA 应用 | React + Vite。”
- `planning/rules.md` 端口表：“app-fe | 3100 | 学习端前端。”

## 需求落实

- 页面：应用端路由壳，后续承载 Discover、Courses、Games、Profile。
- 组件：AppShell、RouterProvider、QueryClientProvider、I18nProvider、ThemeProvider。
- API：通过 SDK 调用 app-be `/api/v1/*`。
- 数据表：无直接写库。
- 状态逻辑：PWA 静态壳可启动，未登录和已登录状态由 UA 模块接入。

## 技术假设

- 路径建议 `system/apps/app-fe`。
- 使用 React 19、Vite 6、TanStack Router、TanStack Query、Zustand。

## 不明确 / 风险

- 风险：业务页面尚未实现时空白。
- 处理：先放最小健康页和路由占位，不生成未在文档中的业务功能。

## 最终验收清单

- [ ] Docker 启动后 `http://localhost:3100` 可访问。
- [ ] 前端能显示 dev 健康页与路由壳。
- [ ] 运行时 API base 指向 app-be 8100。
