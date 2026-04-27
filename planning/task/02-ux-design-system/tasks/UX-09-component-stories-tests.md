# UX-09 · 为核心组件建立 Story 与测试

## 原文引用

- `planning/ux/07-components-core.md`：“每个组件含 .stories.tsx + .test.tsx。”
- `planning/ux/00-index.md`：“Storybook（v1.0 W0 上线）：与 ui 包同步。”

## 需求落实

- 页面：Storybook 文档页。
- 组件：所有核心组件 stories 与 tests。
- API：无。
- 数据表：无。
- 状态逻辑：组件状态矩阵在 Storybook 中可视化，测试覆盖交互状态。

## 技术假设

- Storybook 在 Docker 内运行。
- 测试使用 Vitest + React Testing Library。

## 不明确 / 风险

- 风险：Storybook 配置拖慢 app 构建。
- 处理：storybook 独立脚本，不进入生产 bundle。

## 最终验收清单

- [ ] 每个核心组件有 stories。
- [ ] 每个核心组件有单测。
- [ ] Storybook 可在 Docker 内访问。
# UX-09 · 为核心组件建立 Story 与测试

## 原文引用

- `planning/ux/07-components-core.md`：“每个组件含 .stories.tsx + .test.tsx。”
- `planning/ux/00-index.md`：“Storybook（v1.0 W0 上线）：与 ui 包同步。”

## 需求落实

- 页面：Storybook 文档页。
- 组件：所有核心组件 stories 与 tests。
- API：无。
- 数据表：无。
- 状态逻辑：组件状态矩阵在 Storybook 中可视化，测试覆盖交互状态。

## 技术假设

- Storybook 在 Docker 内运行。
- 测试使用 Vitest + React Testing Library。

## 不明确 / 风险

- 风险：Storybook 配置拖慢 app 构建。
- 处理：storybook 独立脚本，不进入生产 bundle。

## 最终验收清单

- [ ] 每个核心组件有 stories。
- [ ] 每个核心组件有单测。
- [ ] Storybook 可在 Docker 内访问。
