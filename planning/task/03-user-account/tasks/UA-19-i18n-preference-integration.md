# UA-19 · 语言偏好与 i18n 集成

## PRD 原文引用

- `UA-FR-006`：“母语（en / vi / th / id）。”
- `UA-FR-007`：“UI 语言。”
- `planning/prds/15-i18n/01-functional-requirements.md`：“已登录用户：preferences.ui_lang 覆盖浏览器。”

## 需求落实

- 页面：Onboarding、Profile Settings。
- 组件：NativeLanguageSelect、UiLanguageSelect。
- API：`PATCH /api/me`、`PATCH /api/me/preferences`。
- 数据表：`users.native_lang`、`users.ui_lang`、`user_preferences`。
- 状态逻辑：已登录优先用户偏好；未登录优先 URL/browser/localStorage。

## 技术假设

- `native_lang` 与 `ui_lang` 可以不同。
- 语言切换立即更新 URL 前缀由 I18N 模块负责。

## 不明确 / 风险

- 风险：UX onboarding 提到 zh 选项，但 I18N v1 只四语。
- 处理：应用端 v1 只允许 en/vi/th/id，中文后台优先或 v1.5 评估。

## 最终验收清单

- [ ] native_lang 只允许 en/vi/th/id。
- [ ] ui_lang 保存后覆盖浏览器语言。
- [ ] 切换语言不丢当前 path。
