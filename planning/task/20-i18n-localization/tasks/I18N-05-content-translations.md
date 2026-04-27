# I18N-05 · 内容 translations JSONB 渲染

## PRD 原文引用

- `I18N-FR-004`：“所有内容表 translations JSONB（en, vi, th, id），缺失语 → 回退 en。”
- 用户裁决：内容固定显示中文 + ui_lang 双语；ui_lang=zh-CN 时不重复显示中文。

## 需求落实

- 工具函数：`pickTranslation(record, lang, fallback='en')` 在 packages/i18n。
- React Hook：`useContentTranslation(record)` 返回 `{primary, secondary, missingLangs}`。
- 渲染规则：
  - ui_lang ≠ zh-CN：primary=中文(`record.zh` 或 `record.name_zh`)、secondary=`record.translations[ui_lang] ?? record.translations.en`。
  - ui_lang = zh-CN：primary=中文、secondary=null。
- 缺失语提示：`secondary == record.translations.en && ui_lang!='en'` 时角标“需要翻译”。

## 状态逻辑

- 实时切换：i18n 切语后所有 `useContentTranslation` 重渲染（context 触发）。
- 服务端 SSR：根据 cookie/header 选 lang 一次性 hydrate。

## 不明确 / 风险

- 风险：translations JSONB 中可能有 zh 字段冗余。
- 处理：约定 `translations` 仅含 `{en,vi,th,id}` 4 语；zh 单独主字段（`name_zh`/`body_zh`/`zh`）。

## 技术假设

- 拼音字段 `pinyin` 不属于 translations，是中文独立属性。
- 内容审校工作台显示缺失语种。

## 最终验收清单

- [ ] DC 文章页切语种实时变译文。
- [ ] ui_lang=zh-CN 时仅显示中文，无重复。
- [ ] 缺失语回退英文 + “需要翻译”角标。
- [ ] SSR 一次出正确语。
- [ ] zh 独立字段不混入 translations。
