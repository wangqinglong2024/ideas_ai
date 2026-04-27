# UX-03 · 实现亮/暗/跟随系统主题状态

## 原文引用

- `planning/ux/04-theme-system.md`：“模式：light、dark、system。”
- `planning/ux/04-theme-system.md`：“默认值：system（首次访问）。”
- `planning/ux/04-theme-system.md`：“存储位置：localStorage.theme。”

## 需求落实

- 页面：应用端设置页、后台用户菜单。
- 组件：ThemeProvider、useTheme、ThemeModeControl。
- API：登录后可由 UA 偏好同步，基础 UX 不直接建 API。
- 数据表：`user_preferences` 中主题字段如后续需要由 UA 扩展。
- 状态逻辑：mode = light/dark/system，resolved = light/dark。

## 技术假设

- HTML 同时写 `data-theme` 与 `.dark` class。
- 未登录时只存 localStorage。

## 不明确 / 风险

- 风险：UA PRD 当前偏好未明确主题字段。
- 处理：标注技术假设；若不入库，则主题仅本地持久化。

## 最终验收清单

- [ ] 首次访问默认 system。
- [ ] light/dark/system 三档可切。
- [ ] 刷新后主题不丢失。
# UX-03 · 实现亮/暗/跟随系统主题状态

## 原文引用

- `planning/ux/04-theme-system.md`：“模式：light、dark、system。”
- `planning/ux/04-theme-system.md`：“默认值：system（首次访问）。”
- `planning/ux/04-theme-system.md`：“存储位置：localStorage.theme。”

## 需求落实

- 页面：应用端设置页、后台用户菜单。
- 组件：ThemeProvider、useTheme、ThemeModeControl。
- API：登录后可由 UA 偏好同步，基础 UX 不直接建 API。
- 数据表：`user_preferences` 中主题字段如后续需要由 UA 扩展。
- 状态逻辑：mode = light/dark/system，resolved = light/dark。

## 技术假设

- HTML 同时写 `data-theme` 与 `.dark` class。
- 未登录时只存 localStorage。

## 不明确 / 风险

- 风险：UA PRD 当前偏好未明确主题字段。
- 处理：标注技术假设；若不入库，则主题仅本地持久化。

## 最终验收清单

- [ ] 首次访问默认 system。
- [ ] light/dark/system 三档可切。
- [ ] 刷新后主题不丢失。
