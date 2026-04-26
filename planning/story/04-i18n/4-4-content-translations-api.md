# ZY-04-04 · 内容多语言表 + API

> Epic：E04 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] `zhiyu.content_translations(content_type, content_id, lang, fields jsonb, status, updated_at)` + 复合唯一
- [ ] GET `/api/v1/content/:type/:id?lang=`：缺失 fallback `zh`
- [ ] BE 中间件：解析 `Accept-Language` + ?lang= 参数（参数优先）
- [ ] RLS：published 可读；admin 可写
- [ ] 更新时间戳触发器

## 测试方法
- 单元：fallback 逻辑
- 集成：请求 `?lang=th` 命中翻译；请求 `?lang=km`（未支持）→ fallback zh

## DoD
- [ ] 表 + API 通
- [ ] 与 E17 翻译管理后台预留接口
