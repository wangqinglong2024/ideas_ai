# I18N-04 · 用户偏好覆盖与持久化

## PRD 原文引用

- `I18N-FR-003`：“登录用户 `preferences.ui_lang` 覆盖浏览器；切换 POST `/api/me/preferences`。”

## 需求落实

- 数据：`users.preferences` JSONB 字段含 `ui_lang`。
- API：
  - `PUT /api/me/preferences` Body `{ui_lang}` 更新。
  - `GET /api/me/preferences` 返回。
- 客户端：登录后立即 GET 偏好，覆盖当前 lang；切换语言时 PUT。
- 优先级：URL > 用户偏好 > cookie > navigator > en。

## 状态逻辑

- 登录瞬间：若用户偏好 lang 与 URL 不同，提示 “跳到您的偏好语言？” modal（一次性，后续按 URL 走）。
- 内容偏好（CR-25 拼音/翻译开关）也写入同 preferences JSONB 字段。

## 不明确 / 风险

- 风险：JSONB 写入双重编码（用户记忆 `drizzle-jsonb.md`）。
- 处理：preferences 写入用 raw postgres-js + `rawClient.json(obj as never)`。

## 技术假设

- preferences 包含字段：`{ui_lang, bilingual_show_pinyin, bilingual_show_translation, theme}`。
- 默认 `bilingual_show_translation` 在 ui_lang=zh-CN 时强制 false。

## 最终验收清单

- [ ] 登录后 ui_lang 自动同步。
- [ ] 切语言写后端 + cookie。
- [ ] 偏好 JSONB 写入无双重编码。
- [ ] 登出后回退到 cookie/navigator。
- [ ] zh-CN 用户登录 bilingual_show_translation=false。
