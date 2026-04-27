# ACR-02 · 4 轨道与 12 阶段元信息管理

## PRD 原文引用

- `AD-FR-006`：“CR：tracks/stages 树形。”
- `planning/prds/03-courses/04-data-model-api.md` §1.1-1.2：tracks/stages 字段定义。

## 需求落实

- 页面：`/admin/content/courses/tracks/:track_code`、`/stages/:stage_id`。
- 组件：TrackEditForm、StageEditForm、TranslationsEditor（多语 tabs）、IconUploader、HskRangePicker（仅 HSK 轨道显示）、PrerequisiteAdvicePicker。
- API：
  - `GET/PATCH /admin/api/content/courses/tracks/:code`
  - `GET/PATCH /admin/api/content/courses/stages/:id`
  - `POST /admin/api/content/courses/stages/:id/publish`
  - `POST /admin/api/content/courses/stages/:id/archive`

## 状态逻辑

- 4 条 track 不可删（system seed），仅可改 name_translations / description / icon / display_order。
- Stage status 切换：draft → published（发布）；published → archived（撤回）。
- HSK 字段仅 HSK 轨道显示；切换其他轨道时该字段隐藏。
- 多语翻译：tab 切换；缺失语标红 + ”待翻译“。

## 不明确 / 风险

- 风险：误改 track code 会破坏所有引用。
- 处理：track code 只读；显示在表单顶部不可编辑。

## 技术假设

- TranslationsEditor 复用 ADC（发现中国后台）已实现的组件。
- 写操作均经 audit_logs（before/after diff）。

## 最终验收清单

- [ ] 4 轨道编辑（name/icon/order）保存成功。
- [ ] HSK Stage 1 编辑 hsk_level_range，电商 Stage 1 不显示该字段。
- [ ] 多语翻译完整度图标显示正确（5 语：zh + 4 ui_lang）。
- [ ] 发布 / 撤回写 published_at + audit_log。
- [ ] track code 不可编辑。
