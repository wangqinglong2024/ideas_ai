# Story 8.8: 10 种步骤组件（前端 UI 实现）

Status: ready-for-dev

## Story

作为 **前端开发者**，
我希望 **实现 10 种步骤类型的可复用 React Native 组件**，
以便 **节学习页 / 错题重答 / 内容工厂预览统一调用**。

## Acceptance Criteria

1. 在 `apps/mobile/components/steps/` 下创建 10 个组件，每个对应一种 step_type：
   - `SentenceStep` / `WordCardStep` / `ChoiceStep` / `OrderStep` / `MatchStep` / `ListenStep` / `ReadStep` / `TranslateStep` / `TypePinyinStep` / `DialogStep`。
2. 统一 props 接口：`{ payload, onSubmit(response), disabled, attempt_no }`。
3. 每组件内部完成本地交互（拖拽 / 排序 / 输入），调用 `onSubmit` 上报响应。
4. 视觉与设计系统 token 一致；4 语种 i18n。
5. 提供 Storybook（react-native-storybook 或 web 版）展示 10 组件 × 多语言变体。
6. 性能：每组件首次渲染 < 100ms（中端 Android）。
7. 无障碍：所有交互元素 accessibility role / label。
8. 单元测试：每组件 ≥ 5 用例（核心交互 + 边界）。

## Tasks / Subtasks

- [ ] **10 组件实现**（AC: 1,2,3,4,7）
- [ ] **拖拽 / 排序 / match 动画**（AC: 3）
  - [ ] `react-native-gesture-handler` + reanimated
- [ ] **音频播放**（ListenStep / DialogStep）
  - [ ] `expo-av` wrapper
- [ ] **拼音输入**（TypePinyinStep）
  - [ ] 自定义键盘或文本输入 + 转换
- [ ] **Storybook**（AC: 5）
- [ ] **测试**（AC: 8）

## Dev Notes

### 关键约束
- 组件不调 API，只通过 props.onSubmit 上报。
- 音频文件来自 step.payload.audio_url（CDN）；缓存策略由 expo-av 默认。
- TypePinyinStep 在 MVP 用普通输入框 + 提示，不实现自研拼音键盘。
- Match 步骤连线动画使用 SVG path。

### 关联后续 stories
- 8-7 容器调度
- 8-2 类型契约

### Project Structure Notes
- `apps/mobile/components/steps/<Type>Step.tsx` × 10
- `apps/mobile/components/steps/index.ts` 统一导出
- `apps/mobile/components/steps/__tests__/`

### References
- `planning/epics/08-courses.md` ZY-08-08
- `planning/ux/lesson-step-*.md`

### 测试标准
- 单元：每组件 ≥ 5 用例
- 视觉：Storybook 全展示
- 性能：首次渲染 100ms

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
