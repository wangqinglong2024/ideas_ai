# I18N-18 · 系统 UI 与内容渲染分离

## 用户裁决

- 系统 UI（按钮/菜单/导航/提示）：跟随 **ui_lang**（5 语任选）。
- 学习内容（中文 + 翻译）：固定中文为主；当 ui_lang ≠ zh-CN 时附 ui_lang 翻译；ui_lang = zh-CN 时不重复显示中文翻译。
- 拼音 / 翻译开关：独立可配置，互不影响。

## 需求落实

- 偏好字段：
  - `users.preferences.ui_lang`（系统语，5 选 1）
  - `users.preferences.bilingual_show_pinyin`（默认 true）
  - `users.preferences.bilingual_show_translation`（ui_lang!=zh-CN 默认 true，=zh-CN 强制 false）
- 组件区分：
  - `<T i18nKey='...'/>` → 系统 UI 文案（跟 ui_lang）。
  - `<BilingualText record={...}/>` → 内容（应用 CR-25 规则）。
- 设置页 UI：
  - 系统语下拉（5 项）。
  - “显示拼音” 开关。
  - “显示双语翻译” 开关（ui_lang=zh-CN 时灰禁）。

## 状态逻辑

- 切 ui_lang 仅影响系统文案；内容渲染规则按上述偏好独立判断。
- 内容编辑（admin）显示 5 语完整度（I18N-16）。

## 不明确 / 风险

- 风险：开发者混淆使用 `<T>` 与 `<BilingualText>`。
- 处理：lint 规则检测：JSX text containing CJK chars 必须包在 `<BilingualText>` 或 `<T>`，禁止裸字符串。

## 最终验收清单

- [ ] 系统 UI 全部走 i18next key。
- [ ] 内容文本走 BilingualText。
- [ ] zh-CN 用户：UI 中文 + 内容中文（无双语）。
- [ ] vi 用户：UI 越南文 + 内容中文 + 越南文翻译 + 可选拼音。
- [ ] 开关变更跨设备同步。
- [ ] lint 检测裸 CJK 字符串报错。
