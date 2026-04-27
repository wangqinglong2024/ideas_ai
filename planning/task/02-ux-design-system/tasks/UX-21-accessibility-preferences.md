# UX-21 · 实现可访问性偏好

## 原文引用

- `planning/ux/13-accessibility.md`：“字号可调 5 档。”
- `planning/ux/13-accessibility.md`：“游戏可访问性：字幕 / 慢速模式 / 关闭闪烁 / 色弱模式。”
- `planning/ux/12-motion.md`：“尊重 `prefers-reduced-motion`。”

## 需求落实

- 页面：Profile 设置、游戏设置、阅读偏好。
- 组件：FontSizeControl、ColorBlindToggle、ReducedMotionToggle、GameAccessibilitySettings。
- API：偏好保存由 UA 模块接入。
- 数据表：`user_preferences` 可扩展字段。
- 状态逻辑：设置实时生效；未登录可 localStorage 保存。

## 技术假设

- 字号档位映射到 CSS class，不直接内联任意 px。
- reduced motion 关闭视差、自动播放、复杂庆祝动效。

## 不明确 / 风险

- 风险：色弱模式影响品牌视觉。
- 处理：功能优先，品牌色仍通过 token 变体表达。

## 最终验收清单

- [ ] 字号 5 档可切换。
- [ ] reduced motion 生效。
- [ ] 游戏慢速/关闭闪烁/色弱模式设置存在。
# UX-21 · 实现可访问性偏好

## 原文引用

- `planning/ux/13-accessibility.md`：“字号可调 5 档。”
- `planning/ux/13-accessibility.md`：“游戏可访问性：字幕 / 慢速模式 / 关闭闪烁 / 色弱模式。”
- `planning/ux/12-motion.md`：“尊重 `prefers-reduced-motion`。”

## 需求落实

- 页面：Profile 设置、游戏设置、阅读偏好。
- 组件：FontSizeControl、ColorBlindToggle、ReducedMotionToggle、GameAccessibilitySettings。
- API：偏好保存由 UA 模块接入。
- 数据表：`user_preferences` 可扩展字段。
- 状态逻辑：设置实时生效；未登录可 localStorage 保存。

## 技术假设

- 字号档位映射到 CSS class，不直接内联任意 px。
- reduced motion 关闭视差、自动播放、复杂庆祝动效。

## 不明确 / 风险

- 风险：色弱模式影响品牌视觉。
- 处理：功能优先，品牌色仍通过 token 变体表达。

## 最终验收清单

- [ ] 字号 5 档可切换。
- [ ] reduced motion 生效。
- [ ] 游戏慢速/关闭闪烁/色弱模式设置存在。
