# UA-13 · 欢迎流程 Onboarding

## PRD 原文引用

- `UA-FR-012`：“Step 1：母语选择。”
- `UA-FR-012`：“Step 2：UI 语言确认。”
- `UA-FR-012`：“Step 3：学习目标 / Persona 标签。”
- `UA-FR-012`：“Step 4：当前水平。”
- `UA-FR-012`：“Step 5：推荐轨道（详见 CR）。”
- `UA-FR-012`：“Step 6：拼音入门提示。”
- `UA-FR-012`：“可跳过任意步骤。”

## 需求落实

- 页面：`/onboarding`。
- 组件：OnboardingWizard、LanguageStep、GoalStep、LevelStep、TrackRecommendationStep、PinyinIntroPrompt。
- API：`PATCH /api/me`、`PATCH /api/me/preferences`，推荐轨道可由 CR 模块接口后续提供。
- 数据表：`users.persona_tags`、`users.hsk_level_self`、`user_preferences`。
- 状态逻辑：任意步骤可 skip；完成后进入推荐首页或课程轨道。

## 技术假设

- 推荐轨道 v1 可本地规则计算，不需要 AI。
- 未登录试用 onboarding 可先 localStorage，注册后合并。

## 不明确 / 风险

- 风险：跳过所有步骤导致资料缺失。
- 处理：使用默认语言和空 persona，后续可在设置补全。

## 最终验收清单

- [ ] 6 个步骤均存在。
- [ ] 任意步骤可跳过。
- [ ] 完成后 profile/preferences 被更新。
