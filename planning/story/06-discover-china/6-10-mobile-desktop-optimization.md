# Story 6.10: 移动 / 桌面优化

Status: ready-for-dev

## Story

作为 **跨设备用户**，
我希望 **在桌面有目录侧栏，在移动单栏阅读**，
以便 **大屏沉浸阅读、移动便捷使用**。

## Acceptance Criteria

1. 详情页桌面（≥ 1024px）双栏布局：左侧 240-280px 目录（句子段落锚点）+ 右主内容；移动单栏。
2. 桌面目录支持点击跳转到对应句子并高亮 1.5s。
3. 字号档位（XS-XL）随容器宽度调整默认值（移动 M / 平板 M / 桌面 L）。
4. 列表页桌面 2-3 列网格（容器宽度），移动 1 列。
5. 切换窗口大小不闪烁、不丢状态。
6. 顶栏（5-6）与底栏（5-5）在桌面隐藏底栏，依赖 5-10 的全局策略。
7. 图片响应式：srcset + sizes 适配 1x / 2x。
8. 4 语 i18n。

## Tasks / Subtasks

- [ ] **详情双栏**（AC: 1,2）
  - [ ] `<ArticleOutline>` 桌面组件
  - [ ] 平滑滚动 + 临时高亮 1.5s

- [ ] **响应式字号**（AC: 3）
  - [ ] 默认值按容器宽度

- [ ] **列表网格**（AC: 4）
  - [ ] 容器查询断点

- [ ] **图片响应式**（AC: 7）
  - [ ] srcset 工具（R2 不同宽度）

- [ ] **联调**（AC: 5,6）
  - [ ] 与 5-10 容器策略对接

## Dev Notes

### 关键约束
- 平滑滚动 + 滚动恢复可能冲突，跳转时临时禁用恢复。
- 目录数据来源：sentences 中带 `is_paragraph_start` 标记或简单按 N 句一段。

### 关联后续 stories
- 5-10 容器策略已就位
- 6-3 详情页本期增强双栏

### Project Structure Notes
- `apps/app/src/features/reader/ArticleOutline.tsx`
- `apps/app/src/lib/img/srcset.ts`

### References
- `planning/epics/06-discover-china.md` ZY-06-10

### 测试标准
- 视觉回归：三档断点
- E2E：桌面点目录跳转 + 高亮
- 性能：图片正确选择尺寸

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
