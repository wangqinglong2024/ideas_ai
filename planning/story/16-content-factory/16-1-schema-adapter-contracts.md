# ZY-16-01 · 内容工厂 schema 与 Adapter 契约

> Epic：E16 · 估算：M · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 后端工程师
**I want** "内容工厂"（批量生成课程 / 文章 / 词包）的最小 schema + LLMAdapter 契约
**So that** 后续可接 OpenAI/Claude/本地模型，不锁定供应商。

## 上下文
- 表 `zhiyu.gen_jobs(id, type, payload jsonb, status, result jsonb, error, created_at, finished_at)`
- type：article / lesson / wordpack
- LLMAdapter `generate(prompt, schema?) → json | text`，fake 返回模板示例
- 批量入口：admin 上传 CSV / JSON 触发 worker 队列

## Acceptance Criteria
- [ ] migration
- [ ] FakeLLMAdapter 实现
- [ ] BullMQ 队列 `gen-jobs`
- [ ] 接口 `POST /api/v1/admin/gen-jobs` 创建

## 测试方法
```bash
cd /opt/projects/zhiyu/system/docker
docker compose exec zhiyu-worker pnpm vitest run gen-jobs
```

## DoD
- [ ] fake 走通

## 依赖
- 上游：ZY-17 / ZY-19
