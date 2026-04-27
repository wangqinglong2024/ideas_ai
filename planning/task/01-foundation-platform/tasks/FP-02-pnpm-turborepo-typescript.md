# FP-02 · 建立 pnpm + Turborepo + TypeScript Strict 工程

## 原文引用

- `planning/spec/02-tech-stack.md`：“TypeScript first：全栈 strict。”
- `planning/spec/02-tech-stack.md`：“Monorepo | pnpm workspace + Turborepo。”

## 需求落实

- 页面：无。
- 组件：无。
- API：无。
- 数据表：无。
- 状态逻辑：所有 app/package 通过 workspace 引用，构建任务由 Turborepo 编排。

## 技术假设

- 根包管理文件位于 `system/package.json`、`system/pnpm-workspace.yaml`、`system/turbo.json`、`system/tsconfig.base.json`。
- TypeScript 配置默认 `strict: true`，各 app/package 只扩展基础配置。

## 不明确 / 风险

- 风险：现有锁文件不存在时首次 install 生成大 diff。
- 处理：生成后纳入版本管理，不在规划目录放锁文件。

## 最终验收清单

- [ ] `pnpm -C system install` 可解析 workspace。
- [ ] `pnpm -C system typecheck` 能运行到所有 app/package。
- [ ] `tsconfig.base.json` 启用 strict。
