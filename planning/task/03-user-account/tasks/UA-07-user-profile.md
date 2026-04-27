# UA-07 · 个人资料

## PRD 原文引用

- `UA-FR-006`：“昵称（≤ 30 字）。”
- `UA-FR-006`：“头像（上传 / 默认头像生成 / Gravatar）。”
- `UA-FR-006`：“母语（en / vi / th / id）、时区、学习目标、当前 HSK 等级（自评 + 系统推算）。”

## 需求落实

- 页面：`/profile/settings`、onboarding profile step。
- 组件：ProfileForm、AvatarUploader、LanguageSelect、TimezoneSelect、HskLevelSelector。
- API：`GET /api/me`、`PATCH /api/me`、`POST /api/me/avatar`。
- 数据表：`users`。
- 状态逻辑：昵称长度校验；头像上传走 Supabase Storage；HSK 自评与估算分开字段。

## 技术假设

- Gravatar 可作为未来/可选，不因外部不可用阻塞；默认头像生成必须本地可用。
- 时区默认浏览器 timezone，未取到则 UTC。

## 不明确 / 风险

- 风险：Gravatar 属外部服务。
- 处理：本期不依赖 Gravatar，优先上传或本地默认头像。

## 最终验收清单

- [ ] 昵称超过 30 字被拒。
- [ ] 头像上传或默认头像可用。
- [ ] native_lang 只允许 en/vi/th/id。
