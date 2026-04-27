# UX-05 · 建立响应式布局与安全区

## 原文引用

- `planning/ux/05-layout-and-responsive.md`：“所有样式 mobile-first 写法。”
- `planning/ux/05-layout-and-responsive.md`：“TabBar：padding-bottom: env(safe-area-inset-bottom)。”
- `planning/ux/05-layout-and-responsive.md`：“游戏强制横屏。”

## 需求落实

- 页面：应用端、后台、游戏页。
- 组件：PageContainer、AppLayout、AdminLayout、SafeArea utilities。
- API：无。
- 数据表：无。
- 状态逻辑：PWA 内容区避开 header/tabbar/safe area；后台 lg+ sidebar，移动抽屉。

## 技术假设

- 断点采用 xs/sm/md/lg/xl/2xl。
- PWA 桌面仍保持 768px 居中沉浸布局。

## 不明确 / 风险

- 风险：后台移动端复杂表格体验受限。
- 处理：后台移动仅保证可用，桌面优先。

## 最终验收清单

- [ ] 小屏、平板、桌面布局不溢出。
- [ ] iOS safe area 不遮挡底部 TabBar。
- [ ] 后台 Sidebar 响应式行为正确。
# UX-05 · 建立响应式布局与安全区

## 原文引用

- `planning/ux/05-layout-and-responsive.md`：“所有样式 mobile-first 写法。”
- `planning/ux/05-layout-and-responsive.md`：“TabBar：padding-bottom: env(safe-area-inset-bottom)。”
- `planning/ux/05-layout-and-responsive.md`：“游戏强制横屏。”

## 需求落实

- 页面：应用端、后台、游戏页。
- 组件：PageContainer、AppLayout、AdminLayout、SafeArea utilities。
- API：无。
- 数据表：无。
- 状态逻辑：PWA 内容区避开 header/tabbar/safe area；后台 lg+ sidebar，移动抽屉。

## 技术假设

- 断点采用 xs/sm/md/lg/xl/2xl。
- PWA 桌面仍保持 768px 居中沉浸布局。

## 不明确 / 风险

- 风险：后台移动端复杂表格体验受限。
- 处理：后台移动仅保证可用，桌面优先。

## 最终验收清单

- [ ] 小屏、平板、桌面布局不溢出。
- [ ] iOS safe area 不遮挡底部 TabBar。
- [ ] 后台 Sidebar 响应式行为正确。
