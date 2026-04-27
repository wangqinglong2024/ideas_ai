# FP-12 · 接入 Supabase 自托管基础能力

## 原文引用

- `planning/rules.md`：“本期所有数据/认证/存储/向量/实时/边缘函数需求默认走 Supabase 自托管。”
- `planning/spec/02-tech-stack.md`：“Database/Auth/Storage/Realtime | Supabase Self-hosted。”

## 需求落实

- 页面：无。
- 组件：Supabase client/server config、DB connection、storage config、realtime config。
- API：后端通过 Supabase/Postgres 访问数据；认证由 Supabase Auth 对接。
- 数据表：业务 schema 使用 `zhiyu`，模块迁移后创建。
- 状态逻辑：应用 ready 需验证 Postgres 连接；Storage/Realtime 可按模块启用。

## 技术假设

- Supabase 服务由本地/服务器 Docker 已提供或纳入 compose 的依赖网络。
- Postgres 16、Auth、Storage、Realtime、pgvector、FTS 均按规范可用。

## 不明确 / 风险

- 风险：Supabase 自托管初始化脚本与 Drizzle 迁移边界不清。
- 处理：Supabase 基础服务初始化和业务 schema 迁移分离。

## 最终验收清单

- [ ] app-be/admin-be 能连接 Supabase Postgres。
- [ ] `zhiyu` schema 可迁移。
- [ ] Storage/Realtime 配置项可被模块读取。
