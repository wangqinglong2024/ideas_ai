# UA-08 · 用户偏好设置

## PRD 原文引用

- `UA-FR-007`：“UI 语言。”
- `UA-FR-007`：“拼音模式：字母 / 数字声调 / 隐藏。”
- `UA-FR-007`：“翻译显示：实时 / 折叠 / 隐藏。”
- `UA-FR-007`：“字号：S / M / L / XL。”
- `UA-FR-007`：“TTS 语速：0.5x / 0.75x / 1x / 1.25x / 1.5x。”
- `UA-FR-007`：“邮件订阅：营销邮件 / 学习提醒（默认开 / 关）。”

## 需求落实

- 页面：`/profile/settings`。
- 组件：PreferencesForm、PinyinModeControl、TranslationModeControl、FontSizeControl、TtsSpeedSlider、EmailSubscriptionToggles。
- API：`PATCH /api/me/preferences`。
- 数据表：`user_preferences`。
- 状态逻辑：保存后同页实时生效；未登录时可 localStorage 临时保存部分阅读偏好。

## 技术假设

- PRD 字号列为 4 档，UX 无障碍写 5 档；本 UA 任务严格落 UA 的 S/M/L/XL，额外 5 档由 UX 可访问性标注为待产品确认。

## 不明确 / 风险

- 风险：TTS 儿童音色写 v1.5，不应在 W0 强制。
- 处理：男/女先实现，童声标记 v1.5 占位。

## 最终验收清单

- [ ] 偏好保存到 user_preferences。
- [ ] UI 语言切换后立即生效。
- [ ] 拼音/翻译/TTS 语速影响阅读组件。
