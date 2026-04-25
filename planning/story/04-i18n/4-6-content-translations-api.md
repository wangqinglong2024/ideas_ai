# Story 4.6: 内容多语言表 + API

Status: ready-for-dev

## Story

As a 内容 / 后端开发者,
I want `content_translations` 表 + `GET /v1/content/:type/:id?lang=` 接口,
so that 文章 / 课程 / 小说 / 商品等业务对象可以挂多语言翻译，前端按 lang 拉取，缺失时 fallback。

## Acceptance Criteria

1. 新增表 `content_translations(id, content_type, content_id, lang, fields jsonb, status, updated_at, translator_id)`，索引 `(content_type, content_id, lang)` 唯一。
2. `content_type` 枚举：`article / course / lesson / novel / chapter / shop_item`，可扩展。
3. RLS：公开内容 `status='published'` 可读；其他状态仅 `role IN (admin, translator)` 可读写。
4. API `GET /v1/content/:type/:id?lang=xx`：返回该 lang 字段；缺失则 fallback `vi→en / th→en / id→en / 任意→zh`。
5. API `PUT /v1/admin/content/:type/:id/translations/:lang`：更新 fields，触发审计日志，写 ETag。
6. API 在 30 ms（P95，缓存命中）/ 150 ms（P95，DB）内返回；上 Redis 缓存 60 s。
7. OpenAPI 规范在 `apps/api/openapi/content.yaml` 更新；SDK 生成。
8. 集成测试覆盖：fallback 链 / 状态过滤 / 权限 / 缓存失效。

## Tasks / Subtasks

- [ ] Task 1: 数据库（AC: #1, #2, #3）
  - [ ] Drizzle migration：建表 + 索引 + RLS policy
  - [ ] seed 一条 article + 4 语翻译
- [ ] Task 2: API 实现（AC: #4, #5, #6）
  - [ ] `GET /v1/content/:type/:id` controller
  - [ ] `PUT /v1/admin/...` controller + 审计
  - [ ] Redis 缓存层 `content:tr:{type}:{id}:{lang}` ttl=60
  - [ ] ETag 计算与 304 处理
- [ ] Task 3: 文档与 SDK（AC: #7）
  - [ ] openapi.yaml 更新
  - [ ] `pnpm sdk:gen`
- [ ] Task 4: 测试（AC: #8）
  - [ ] vitest + supertest：fallback / status / 权限 / 缓存失效

## Dev Notes

### 关键架构约束
- **fields 字段为 jsonb**：每 content_type 字段名各异（article: title/summary/body；shop_item: name/desc）；schema 校验放在 service 层。
- **fallback 顺序**：同 i18next 配置；后端实现一份，前端实现一份，必须**保持一致**（共享常量 `packages/i18n/src/fallback.ts`）。
- **缓存失效**：PUT 完毕 Redis `del content:tr:{type}:{id}:*`。
- **不返回未发布翻译**给匿名用户。

### 关联后续 stories
- 6-1 文章列表会包含此处的 title / summary
- 4-7 翻译后台调用本 API
- 4-8 导入导出基于本表 schema

### 测试标准
- vitest + supertest
- 关键 case：vi 缺失走 en；en 缺失走 zh；status=draft 匿名 403

### Project Structure Notes

```
apps/api/src/modules/content-translations/
  schema.ts         # drizzle table
  service.ts        # fallback + cache
  controller.ts     # GET / PUT
  cache.ts
  openapi.yaml
packages/i18n/src/fallback.ts   # 共享 fallback 常量
```

### References

- [Source: planning/epics/04-i18n.md#ZY-04-06](../../epics/04-i18n.md)
- [Source: planning/spec/05-data-model.md](../../spec/05-data-model.md)
- [Source: planning/spec/04-backend.md](../../spec/04-backend.md)

## Dev Agent Record

### Agent Model Used

(Filled by dev agent at execution time)

### Debug Log References

### Completion Notes List

### File List
