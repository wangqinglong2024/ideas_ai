# FP-16 · 建立 Drizzle 迁移基线

## 原文引用

- `planning/rules.md`：“数据库迁移：drizzle-kit migrate，在 zhiyu-app-be 容器启动时自检。”
- `planning/spec/02-tech-stack.md`：“ORM / Migration | Drizzle ORM + drizzle-kit。”

## 需求落实

- 页面：无。
- 组件：schema package、migration scripts、startup migration check。
- API：无。
- 数据表：迁移元数据表及后续业务表。
- 状态逻辑：app-be 启动时检查迁移状态；失败时 ready 失败。

## 技术假设

- 迁移文件位于 `system/packages/db/migrations`。
- schema 定义位于 `system/packages/db/src/schema`。

## 不明确 / 风险

- 风险：Drizzle 对 jsonb 插入存在历史坑。
- 处理：jsonb seed 插入优先使用 raw postgres-js JSON helper。

## 最终验收清单

- [ ] `pnpm db:migrate` 可在容器内执行。
- [ ] app-be ready 能反映迁移状态。
- [ ] schema 与 migration 文件在 `system/packages/db` 下。
