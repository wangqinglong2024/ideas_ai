# FP-17 · 建立共享 packages 基线

## 原文引用

- `planning/spec/03-frontend.md` monorepo 包结构列出 `packages/ui`、`sdk`、`i18n`、`games`、`game-engine` 等。
- `planning/spec/02-tech-stack.md`：“TypeScript first：全栈 strict。”

## 需求落实

- 页面：无。
- 组件：`packages/ui`、`packages/sdk`、`packages/i18n`、`packages/config`、`packages/types`、`packages/db`、`packages/game-engine`。
- API：SDK 封装 app/admin API 调用。
- 数据表：db package 维护 schema。
- 状态逻辑：共享包不得反向依赖 app。

## 技术假设

- games/game-engine 可在游戏模块任务中扩展，此处只建包边界。
- UI 与 i18n 包供 app-fe/admin-fe 复用。

## 不明确 / 风险

- 风险：过早抽象业务逻辑进共享包。
- 处理：共享包只放跨 app 复用基础能力。

## 最终验收清单

- [ ] workspace 能识别所有共享包。
- [ ] app-fe/admin-fe 可 import ui/i18n/sdk。
- [ ] 共享包无循环依赖。
