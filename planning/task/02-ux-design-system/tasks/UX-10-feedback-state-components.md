# UX-10 · 实现反馈与状态组件

## 原文引用

- `planning/ux/08-components-feedback.md`：“Toast 类型：success、info、warning、error、loading。”
- `planning/ux/08-components-feedback.md`：“Empty State：插画 + 标题 + 描述 + 主 CTA + 次 CTA。”
- `planning/ux/08-components-feedback.md`：“ErrorBoundary 捕获 → 显示 ErrorFallback。”

## 需求落实

- 页面：所有列表、详情、表单、错误页、离线页。
- 组件：Toast、Banner、Confirm、EmptyState、Skeleton、Loading、ErrorFallback、OfflineBanner。
- API：无。
- 数据表：无。
- 状态逻辑：loading/empty/error/success/offline 各态独立；Toast 最多 3 个堆叠。

## 技术假设

- 减弱动效时 Skeleton shimmer 静态化。
- API 错误由 SDK 映射为 UI 错误状态。

## 不明确 / 风险

- 风险：业务页遗漏空态。
- 处理：页面验收必须包含 loading/empty/error 三态截图。

## 最终验收清单

- [ ] Toast 堆叠、超时、手动关闭正确。
- [ ] EmptyState 覆盖无搜索、无收藏、无笔记、无错题、网络错误、404、加载失败。
- [ ] ErrorBoundary 能捕获组件错误。
# UX-10 · 实现反馈与状态组件

## 原文引用

- `planning/ux/08-components-feedback.md`：“Toast 类型：success、info、warning、error、loading。”
- `planning/ux/08-components-feedback.md`：“Empty State：插画 + 标题 + 描述 + 主 CTA + 次 CTA。”
- `planning/ux/08-components-feedback.md`：“ErrorBoundary 捕获 → 显示 ErrorFallback。”

## 需求落实

- 页面：所有列表、详情、表单、错误页、离线页。
- 组件：Toast、Banner、Confirm、EmptyState、Skeleton、Loading、ErrorFallback、OfflineBanner。
- API：无。
- 数据表：无。
- 状态逻辑：loading/empty/error/success/offline 各态独立；Toast 最多 3 个堆叠。

## 技术假设

- 减弱动效时 Skeleton shimmer 静态化。
- API 错误由 SDK 映射为 UI 错误状态。

## 不明确 / 风险

- 风险：业务页遗漏空态。
- 处理：页面验收必须包含 loading/empty/error 三态截图。

## 最终验收清单

- [ ] Toast 堆叠、超时、手动关闭正确。
- [ ] EmptyState 覆盖无搜索、无收藏、无笔记、无错题、网络错误、404、加载失败。
- [ ] ErrorBoundary 能捕获组件错误。
