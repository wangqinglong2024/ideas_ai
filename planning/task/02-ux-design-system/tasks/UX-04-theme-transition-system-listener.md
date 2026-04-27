# UX-04 · 实现主题切换过渡与系统监听

## 原文引用

- `planning/ux/04-theme-system.md`：“切换时短暂添加 `.theme-transition` 类（300ms 后移除）。”
- `planning/ux/04-theme-system.md`：“跟随系统：监听 `prefers-color-scheme`。”

## 需求落实

- 页面：所有页面。
- 组件：ThemeProvider、theme-transition utility。
- API：无。
- 数据表：无。
- 状态逻辑：mode=system 时监听系统变化；手动 light/dark 覆盖系统。

## 技术假设

- 过渡仅影响 background/color/border，不强制 animate layout。
- SSR 或首屏防闪烁通过内联初始化脚本解决。

## 不明确 / 风险

- 风险：首屏主题闪烁。
- 处理：HTML 加载前读取 localStorage 设置 data-theme。

## 最终验收清单

- [ ] 系统主题变化时页面自动同步。
- [ ] 切换过渡约 300ms。
- [ ] 无明显白屏或闪烁。
# UX-04 · 实现主题切换过渡与系统监听

## 原文引用

- `planning/ux/04-theme-system.md`：“切换时短暂添加 `.theme-transition` 类（300ms 后移除）。”
- `planning/ux/04-theme-system.md`：“跟随系统：监听 `prefers-color-scheme`。”

## 需求落实

- 页面：所有页面。
- 组件：ThemeProvider、theme-transition utility。
- API：无。
- 数据表：无。
- 状态逻辑：mode=system 时监听系统变化；手动 light/dark 覆盖系统。

## 技术假设

- 过渡仅影响 background/color/border，不强制 animate layout。
- SSR 或首屏防闪烁通过内联初始化脚本解决。

## 不明确 / 风险

- 风险：首屏主题闪烁。
- 处理：HTML 加载前读取 localStorage 设置 data-theme。

## 最终验收清单

- [ ] 系统主题变化时页面自动同步。
- [ ] 切换过渡约 300ms。
- [ ] 无明显白屏或闪烁。
