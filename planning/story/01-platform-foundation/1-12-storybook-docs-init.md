# Story 1.12: Storybook + 文档站初始化

Status: ready-for-dev

## Story

As a 开发者,
I want Storybook 与 docs 站初始化上线，并提供 PR / Issue 模板与 CONTRIBUTING.md,
so that 团队对 UI 组件、贡献规范、文档阅读有统一入口。

## Acceptance Criteria

1. `packages/ui` 集成 Storybook 8.x（Vite builder），运行 `pnpm storybook` 在本地 6006 端口启动。
2. 至少 1 个示例 story（`Button.stories.tsx`），含 args / argTypes / interaction test 占位。
3. Storybook build 输出到 `packages/ui/storybook-static`，被 1.5 中 zhiyu-storybook 项目部署。
4. `apps/web` 的 docs 子路径或独立 `docs` 站：v1 仅占位首页（"知语开发者文档 · 即将上线"），托管在 `docs.zhiyu.io`。
5. `CONTRIBUTING.md`：分支策略、PR 流程、commit 规范、本地命令、release 流程（v1.5 完善）。
6. `.github/PULL_REQUEST_TEMPLATE.md`：含 Why / What / How / 截图 / 测试清单 / 关联 issue。
7. `.github/ISSUE_TEMPLATE/`：bug.yml + feature.yml + question.yml 三个表单模板。
8. `.github/CODEOWNERS`：根目录 owner = @zhiyu/core，`packages/ui` owner = @zhiyu/design 等（团队/角色用 placeholder）。
9. Storybook addon：`@storybook/addon-essentials` + `@storybook/addon-a11y` + `@storybook/addon-interactions`。
10. README 加导航段：链接 Storybook、docs 站、CONTRIBUTING、PR 模板。

## Tasks / Subtasks

- [ ] Task 1: Storybook 集成（AC: #1, #2, #3, #9）
  - [ ] `pnpm dlx storybook init --type vite`
  - [ ] addons 安装
  - [ ] Button 示例
- [ ] Task 2: docs 占位（AC: #4）
  - [ ] `apps/web/index.html` 占位
  - [ ] CF Pages 域名 `docs.zhiyu.io` 路由配置
- [ ] Task 3: 模板（AC: #5, #6, #7, #8, #10）

## Dev Notes

- Storybook 8.x 与 Vite 5 兼容；React 19 需 `@storybook/react` 8.5+
- docs 站详细完善延后到 v1.5（接入 Mintlify 或 Docusaurus）

### References

- [Source: planning/epics/01-platform-foundation.md#ZY-01-12](../../epics/01-platform-foundation.md)
- [Source: planning/sprint/01-platform-foundation.md#W4](../../sprint/01-platform-foundation.md)

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
