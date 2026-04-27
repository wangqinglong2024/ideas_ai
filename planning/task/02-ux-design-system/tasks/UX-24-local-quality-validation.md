# UX-24 · 本地质量验证替代外部云服务

## 原文引用

- `planning/rules.md`：“禁用 Sentry SaaS；前端用全局错误上报到自建接口。”
- `planning/rules.md`：“禁止新增基于 Playwright Cloud / BrowserStack 的远程测试。”
- `planning/rules.md`：“Docker 是唯一开发与部署形态。”

## 需求落实

- 页面：无。
- 组件：local visual smoke scripts、a11y checks、telemetry checks。
- API：错误上报与事件上报走自建接口。
- 数据表：error_events、events。
- 状态逻辑：所有 UX 质量验证在 Docker/dev 本地完成，不接远程云测试或 SaaS 监控。

## 技术假设

- 可用 Lighthouse/axe/vitest/storybook 本地命令。
- 视觉回归可先用本地截图基线，不用云平台。

## 不明确 / 风险

- 风险：团队需要跨浏览器云测试。
- 处理：本期不接；如未来需要，必须先改铁律。

## 最终验收清单

- [ ] 无 Sentry/PostHog/BrowserStack/Playwright Cloud 依赖。
- [ ] 本地 Docker 命令能跑 a11y 与 smoke。
- [ ] 错误与事件写自建表。
# UX-24 · 本地质量验证替代外部云服务

## 原文引用

- `planning/rules.md`：“禁用 Sentry SaaS；前端用全局错误上报到自建接口。”
- `planning/rules.md`：“禁止新增基于 Playwright Cloud / BrowserStack 的远程测试。”
- `planning/rules.md`：“Docker 是唯一开发与部署形态。”

## 需求落实

- 页面：无。
- 组件：local visual smoke scripts、a11y checks、telemetry checks。
- API：错误上报与事件上报走自建接口。
- 数据表：error_events、events。
- 状态逻辑：所有 UX 质量验证在 Docker/dev 本地完成，不接远程云测试或 SaaS 监控。

## 技术假设

- 可用 Lighthouse/axe/vitest/storybook 本地命令。
- 视觉回归可先用本地截图基线，不用云平台。

## 不明确 / 风险

- 风险：团队需要跨浏览器云测试。
- 处理：本期不接；如未来需要，必须先改铁律。

## 最终验收清单

- [ ] 无 Sentry/PostHog/BrowserStack/Playwright Cloud 依赖。
- [ ] 本地 Docker 命令能跑 a11y 与 smoke。
- [ ] 错误与事件写自建表。
