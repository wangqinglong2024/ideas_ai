# UX-08 · 实现核心组件库

## 原文引用

- `planning/ux/07-components-core.md`：“共用组件库 `packages/ui`，应用端 + 后台共享。”
- `planning/ux/07-components-core.md` 列出 Button、Input、Card、Modal/Dialog、Tabs、List、Avatar、Badge、Tag/Chip、Tooltip、Popover、Switch/Checkbox/Radio、Slider、Progress 等组件。

## 需求落实

- 页面：所有应用端和后台页面复用。
- 组件：不可删减上述核心组件；AudioPlayer、PinyinText、SentenceCard 也需纳入学习组件。
- API：无。
- 数据表：无。
- 状态逻辑：每个组件必须支持 default/hover/active/focus/disabled/loading 或自身对应状态。

## 技术假设

- 组件基于 React + Tailwind + CSS variables。
- 图标优先 lucide-react。

## 不明确 / 风险

- 风险：一次性实现全部组件范围大。
- 处理：可以分 PR 实施，但任务清单不删减任何组件。

## 最终验收清单

- [ ] 核心组件均在 `packages/ui` 导出。
- [ ] Button 最小命中区 44×44dp。
- [ ] 表单组件接入 React Hook Form + Zod。
# UX-08 · 实现核心组件库

## 原文引用

- `planning/ux/07-components-core.md`：“共用组件库 `packages/ui`，应用端 + 后台共享。”
- `planning/ux/07-components-core.md` 列出 Button、Input、Card、Modal/Dialog、Tabs、List、Avatar、Badge、Tag/Chip、Tooltip、Popover、Switch/Checkbox/Radio、Slider、Progress 等组件。

## 需求落实

- 页面：所有应用端和后台页面复用。
- 组件：不可删减上述核心组件；AudioPlayer、PinyinText、SentenceCard 也需纳入学习组件。
- API：无。
- 数据表：无。
- 状态逻辑：每个组件必须支持 default/hover/active/focus/disabled/loading 或自身对应状态。

## 技术假设

- 组件基于 React + Tailwind + CSS variables。
- 图标优先 lucide-react。

## 不明确 / 风险

- 风险：一次性实现全部组件范围大。
- 处理：可以分 PR 实施，但任务清单不删减任何组件。

## 最终验收清单

- [ ] 核心组件均在 `packages/ui` 导出。
- [ ] Button 最小命中区 44×44dp。
- [ ] 表单组件接入 React Hook Form + Zod。
