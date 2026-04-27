# I18N-15 · 翻译流水线人工 + mock

## PRD 原文引用

- `02-data-model-api.md` “翻译流水线（CF 集成）”。
- `planning/rules.md`：AI 用 mock；不接真实 SaaS。

## 需求落实

- 流水线步骤：
  1. 内容创建 → 后台“一键发起翻译” 按钮。
  2. 调用 `LLMFakeAdapter.translate({zh, target_langs:['en','vi','th','id']})` 返回 mock 译文（前缀 `[MOCK-en]` 等）。
  3. 写入 `translations.{lang}` + `translations._meta.{lang}.status = 'mock'`。
  4. 母语审校在后台编辑器 mark `status='reviewed'`。
- 流水线 API：`POST /admin/api/i18n/translate` Body `{resource_type, resource_id, target_langs}`。
- 状态字段：`pending / mock / reviewed / outdated`（zh 改动后所有 lang 标 outdated）。

## 状态逻辑

- mock 译文包含可识别前缀，便于审校筛选。
- 真实 LLM 接入由 v1.5 切换 LLMAdapter 实现。

## 最终验收清单

- [ ] 后台一键翻译生成 4 语 mock 译文。
- [ ] 译文 _meta.status 写入。
- [ ] zh 修改后 status 自动转 outdated。
- [ ] 审校通过后 status=reviewed。
- [ ] 流水线无外部 SaaS 依赖。
