# CR-25 · 内容多语对照渲染（系统语 ≠ 中文时双语 / 拼音可配置）

## PRD 原文引用

- `01-structure-content.md` §2.1：知识点字段 `translations` 为 4 语种翻译；`pinyin` 与 `pinyin_tones` 字段固定。
- `planning/ux/14-i18n-fonts.md`：中文 Noto Sans SC / Source Han Sans SC；其他语种按 lang 切字体。
- 用户裁决（本会话）：内容是中文与系统语对照（可配置）；如系统语=中文则不重复显示中文；拼音/系统语对照可独立开关。

## 需求落实

- 偏好字段（`users.preferences`）：
  - `bilingual_show_pinyin: boolean`（默认 true）。
  - `bilingual_show_translation: boolean`（默认 true）。
  - 系统语 = `zh-CN` 时 `bilingual_show_translation` 自动隐藏（强制 false）。
- 组件：BilingualText、KnowledgePointCard、SentenceLine、ArticleSentenceLine。
- API：
  - `GET /api/me/preferences/reading` 返回上述开关。
  - `PUT /api/me/preferences/reading`。
- UI：节学习页 / 文章阅读页 / 小说阅读页右上角偏好齿轮，提供两个开关。

## 渲染规则

- 当 ui_lang = `zh-CN`：仅显示中文（+ 可选拼音），不显示翻译。
- 当 ui_lang ∈ `en/vi/th/id`：
  - 中文（必显） + 可选拼音（小字灰色） + 可选翻译（同字号 / 不同色）。
  - 翻译缺失 → 显示英文回退 + “需要翻译”小标。
- 字体：中文用 `font-family: 'Noto Sans SC'`；其他语按 lang 切。

## 不明确 / 风险

- 风险：拼音文字宽度可能压缩中文字。
- 处理：拼音单独 `<rt>` 或独立行；移动端默认独立行。

## 技术假设

- 偏好同步走 `users.preferences` JSONB；本地缓存到 cookie + IndexedDB。
- 翻译缺失回退顺序：用户 ui_lang → 英文 → 跳过。

## 最终验收清单

- [ ] 系统语切到 zh-CN，节学习页隐藏翻译开关。
- [ ] 系统语 en，关闭拼音 → 不显示拼音。
- [ ] 系统语 vi，缺失翻译时显示 en 回退 + 标记。
- [ ] 偏好同步跨设备保留。
- [ ] 字体按 lang 切换。
