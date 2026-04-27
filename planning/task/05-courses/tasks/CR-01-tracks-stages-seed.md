# CR-01 · 轨道与阶段数据模型 + 4 轨 12 阶段 seed

## PRD 原文引用

- `planning/prds/03-courses/04-data-model-api.md` §1.1：`CREATE TABLE content_tracks (... code TEXT NOT NULL UNIQUE, name_zh, name_translations JSONB NOT NULL, description JSONB, icon_url, display_order, status ...)`。
- 同文件 §1.2：`CREATE TABLE content_stages (track_id, stage_no 1..12, name_zh, name_translations, description, hsk_level_range INT[], prerequisite_stage, is_free, status, published_at, UNIQUE(track_id, stage_no))`。
- `content/course/00-index.md`：“4 条独立轨道（电商 / 工厂 / HSK / 日常）× 12 阶段。”
- `planning/prds/03-courses/01-structure-content.md` §1.1-1.4：四张表分别列出 ec / factory / hsk / daily 12 阶段主题。

## 需求落实

- 数据表：`content_tracks`、`content_stages`。
- Schema 位置：`system/packages/db/src/schema/courses.ts`。
- Seed 位置：`system/packages/db/seed/courses/tracks.json`、`system/packages/db/seed/courses/stages.json`。
- API：`GET /api/learn/tracks`（公开元信息，CDN 1h）。
- 后台：`/admin/content/courses`（树形根节点）。
- 状态逻辑：track 固定 4 条；stage 每轨 12 条；`is_free` 仅整阶段促销使用，不替代每章 `is_free`。

## 字段映射

- `content_tracks.code`：`ec | factory | hsk | daily`。
- `content_tracks.name_translations`：覆盖已启用 4 语 + 中文（zh-CN）。
- `content_stages.hsk_level_range`：仅 HSK 轨道写入；ec/factory 写参考映射；daily 留空（表达不挂钩 HSK）。
- `content_stages.prerequisite_stage`：建议值，不参与权限校验（允许跨级购买）。

## 不明确 / 风险

- 风险：PRD 4 轨道阶段表的 “HSK 等级” 列在 ec / factory 中存在，可能被误用作筛选条件。
- 处理：仅作为 stage 元数据展示，不参与 ec/factory/daily 的 HSK 筛选 UI；HSK 筛选只出现在 HSK 轨道。
- 风险：内容目录使用“电商 / 工厂 / HSK / 日常”而非 PRD 早期“ec/factory/hsk/daily”。
- 处理：code/slug 固定为英文小写 `ec/factory/hsk/daily`，名称多语言通过 `name_translations` 提供。

## 技术假设

- Stage seed 含 4 × 12 = 48 行；首发只发布每轨 stage 1-3，其余 `status='draft'`。
- 12 阶段名称按 `01-structure-content.md` 表格逐字落入 `name_zh`，多语字段先以英文等价占位。
- `display_order` 默认 = `stage_no`。

## 最终验收清单

- [ ] `pnpm seed:courses:tracks` 写入 4 条 track，code 唯一。
- [ ] `pnpm seed:courses:stages` 写入 48 条 stage，每条满足 `UNIQUE(track_id, stage_no)`。
- [ ] `/api/learn/tracks` 返回 4 轨道含 12 阶段元数据，缓存头 `Cache-Control: public, max-age=3600`。
- [ ] HSK 轨道 stage 含 `hsk_level_range`，ec/factory/daily 轨道前端 UI 不展示 HSK 字段。
- [ ] 后台树形根节点能按 track/stage 编辑名称、描述（4 语+中）、display_order、status。
