# UX-20 · 实现 WCAG 2.1 AA 基线

## 原文引用

- `planning/ux/13-accessibility.md`：“WCAG 2.1 Level AA。”
- `planning/ux/13-accessibility.md`：“键盘可达：100% 应用可操作。”
- `planning/prds/01-overall/06-non-functional.md`：“颜色对比度 ≥ 4.5:1。”

## 需求落实

- 页面：所有应用端、后台、游戏菜单/遮罩。
- 组件：FocusRing、SkipLink、AccessibleModal、FormField、AriaLiveRegion。
- API：无。
- 数据表：无。
- 状态逻辑：键盘焦点顺序清晰，Modal focus trap，错误信息 aria-describedby。

## 技术假设

- axe-core/Lighthouse 用于本地检查。
- 画布游戏至少提供菜单/结果/遮罩可访问标签。

## 不明确 / 风险

- 风险：PixiJS 画布内部难以完整屏幕阅读器支持。
- 处理：提供外层可访问说明和非画布关键状态文本。

## 最终验收清单

- [ ] Lighthouse Accessibility ≥95。
- [ ] 键盘可完成主要流程。
- [ ] Modal 焦点陷阱与 ESC 行为正确。
# UX-20 · 实现 WCAG 2.1 AA 基线

## 原文引用

- `planning/ux/13-accessibility.md`：“WCAG 2.1 Level AA。”
- `planning/ux/13-accessibility.md`：“键盘可达：100% 应用可操作。”
- `planning/prds/01-overall/06-non-functional.md`：“颜色对比度 ≥ 4.5:1。”

## 需求落实

- 页面：所有应用端、后台、游戏菜单/遮罩。
- 组件：FocusRing、SkipLink、AccessibleModal、FormField、AriaLiveRegion。
- API：无。
- 数据表：无。
- 状态逻辑：键盘焦点顺序清晰，Modal focus trap，错误信息 aria-describedby。

## 技术假设

- axe-core/Lighthouse 用于本地检查。
- 画布游戏至少提供菜单/结果/遮罩可访问标签。

## 不明确 / 风险

- 风险：PixiJS 画布内部难以完整屏幕阅读器支持。
- 处理：提供外层可访问说明和非画布关键状态文本。

## 最终验收清单

- [ ] Lighthouse Accessibility ≥95。
- [ ] 键盘可完成主要流程。
- [ ] Modal 焦点陷阱与 ESC 行为正确。
