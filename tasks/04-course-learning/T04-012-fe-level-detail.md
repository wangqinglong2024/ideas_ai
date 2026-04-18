# T04-012: 前端页面 — Level 详情页

> 分类: 04-系统课程-学习 (Course Learning)
> 状态: 📋 待开发
> 复杂度: L(复杂)
> 预估文件数: 10

## 需求摘要

实现 Level 详情页，包含：①顶部 Level 信息区（名称 + HSK/CEFR 标签 + 线性进度条 + 课时统计 + 有效期倒计时）；②单元卡片列表（4 种状态 — 已完成/进行中/已解锁/锁定，含进度条 + 测评入口）；③底部综合考核入口卡片；④点击单元进入的课时列表子页面（课时 4 种状态 — 已完成/进行中/待学习/锁定）。

## 相关上下文

- 产品需求: `product/apps/03-course-learning/04-level-detail.md`（Level 详情完整 PRD）
- 设计规范: `grules/06-ui-design.md`（Cosmic Refraction 设计系统）
- 关联 API: T04-005（Level 详情 → 单元列表 + 课时列表 API）
- 关联 API: T04-006（解锁状态查询 API）
- 关联页面: T04-010（课程首页 → Level 详情导航）、T04-013（课时学习页）

## 技术方案

### 页面路由

```
/courses/levels/:levelId        → Level 详情页（单元列表）
/courses/units/:unitId/lessons  → 课时列表子页面
```

### 组件拆分

```
pages/courses/level-detail/
├── LevelDetailPage.tsx          — 页面容器
├── components/
│   ├── LevelInfoHeader.tsx      — 顶部 Level 信息区（固定）
│   ├── UnitCardList.tsx         — 单元卡片列表（可滚动）
│   ├── UnitCard.tsx             — 单个单元卡片（4 种状态）
│   ├── FinalExamCard.tsx        — 综合考核入口卡片
│   └── LevelDetailSkeleton.tsx  — 骨架屏
├── lesson-list/
│   ├── LessonListPage.tsx       — 课时列表子页面
│   ├── LessonListItem.tsx       — 课时列表项（4 种状态）
│   └── LessonListSkeleton.tsx   — 骨架屏
└── hooks/
    └── useLevelDetail.ts        — Level 详情数据 Hook
```

### 顶部 Level 信息区（固定）

```
┌───────────────────────────────┐
│ ← 返回          Level 5      │  ← 导航栏
├───────────────────────────────┤
│ Level 5 · 成语故事            │  ← H2 名称
│ HSK 3 · B1                   │  ← Amber 标签
│                               │
│ ████████░░░░░░░░░░░░ 45%     │  ← 进度条 8px Rose
│ 19/42 课时已完成              │  ← Caption 灰色
│                               │
│ 有效期: 剩余 820 天           │  ← 正常灰色
│  或: 剩余 25 天 ⚠️            │  ← <30天红色警告
└───────────────────────────────┘
```

### 单元卡片 4 种状态

```
✅ 已完成:
  - 正常毛玻璃 (.glass-card)
  - 绿色 CheckCircle 图标
  - 进度条满格绿色
  - 测评分数: "✅ 85 分"
  - 点击 → 课时列表（复习模式）

🟢 进行中:
  - .glass-elevated 毛玻璃（提升层级）
  - Rose 📖 图标
  - 进度条 6px Rose（部分填充）
  - 测评区 3 小状态:
    a) 课时未完成: "📖 还有 3 节课时未完成"
    b) 课时完成但未测评: "📝 开始单元测评" (Rose CTA)
    c) 测评未通过: "🔄 重新测评 (上次 55 分)"
  - 点击 → 课时列表

⚪ 已解锁:
  - 正常毛玻璃
  - 灰色 📖 图标
  - 空进度条
  - 测评: "🔒 未开放"
  - 点击 → 课时列表

🔒 锁定:
  - opacity 0.5 + 灰度滤镜
  - Lock 图标
  - 提示: "完成上一单元测评后解锁"
  - 点击 → Toast "请先完成上一单元的测评"
```

### 综合考核入口卡片

```
列表末尾特殊卡片:
  🏆 图标 + "综合考核"

3 种状态:
  🔒 锁定: "完成全部单元测评后开放" + opacity 0.5
  ⚪ 已解锁: Rose CTA "开始考核"
  ✅ 已通过: "🏆 XX 分 — 恭喜通过！"
```

### 课时列表子页面

```
导航: /courses/units/:unitId/lessons
顶部: ← 返回 + "单元 3 · 日常对话"

课时列表项:
  序号圆圈 + 课时名称 + 状态图标 + 学习时长

课时 4 种状态:
  ✅ 已完成: 绿色序号圆圈 + CheckCircle → 进入复习模式
  🟢 进行中: Rose 序号圆圈 + 进度百分比 → 恢复上次位置
  ⚪ 待学习: 灰色序号圆圈 → 从头开始
  🔒 锁定: opacity 0.4 + Lock → Toast
```

### 解锁规则（前端展示逻辑）

```
单元解锁判断（基于 API 返回的 unlock_status）:
  Unit 1: 始终解锁
  Unit N (N>1): units[N-1].assessment_passed === true

课时解锁判断:
  Lesson 1: Unit 已解锁即可学习
  Lesson N (N>1): lessons[N-1].status === 'completed'
```

## 范围（做什么）

- LevelDetailPage 页面（顶部信息区 + 单元卡片列表 + 综合考核入口）
- UnitCard 组件（4 种状态渲染 + 测评入口 3 小状态）
- FinalExamCard 组件（3 种状态）
- LessonListPage 子页面（课时列表 + 4 种状态）
- 骨架屏 Loading 态
- 有效期剩余天数计算 + <30天红色警告
- 页面转场动画（Push 右入 / Pop 右出）
- Dark / Light 模式
- 响应式布局

## 边界（不做什么）

- 不实现单元测评页面（T05 模块）
- 不实现综合考核页面（T05 模块）
- 不实现课时学习页面（T04-013）

## 涉及文件

- 新建: `frontend/src/pages/courses/level-detail/LevelDetailPage.tsx`
- 新建: `frontend/src/pages/courses/level-detail/components/LevelInfoHeader.tsx`
- 新建: `frontend/src/pages/courses/level-detail/components/UnitCardList.tsx`
- 新建: `frontend/src/pages/courses/level-detail/components/UnitCard.tsx`
- 新建: `frontend/src/pages/courses/level-detail/components/FinalExamCard.tsx`
- 新建: `frontend/src/pages/courses/level-detail/components/LevelDetailSkeleton.tsx`
- 新建: `frontend/src/pages/courses/level-detail/lesson-list/LessonListPage.tsx`
- 新建: `frontend/src/pages/courses/level-detail/lesson-list/LessonListItem.tsx`
- 新建: `frontend/src/pages/courses/level-detail/hooks/useLevelDetail.ts`
- 修改: `frontend/src/router/index.tsx` — 注册路由

## 依赖

- 前置: T04-005（单元列表 + 课时列表 API）、T04-006（解锁状态 API）
- 前置: T04-010（课程首页 → 导航到本页面）
- 后续: T04-013（课时学习页 — 课时列表点击进入）

## 验收标准（GIVEN-WHEN-THEN）

1. **GIVEN** 用户点击 Level 5 **WHEN** 进入详情页 **THEN** 顶部显示 "Level 5 · 成语故事" + HSK 3 + 45% 进度条
2. **GIVEN** Level 5 有效期剩余 820 天 **WHEN** 查看有效期 **THEN** 显示灰色 "剩余 820 天"
3. **GIVEN** 有效期剩余 25 天 **WHEN** 查看有效期 **THEN** 红色 "剩余 25 天 ⚠️"
4. **GIVEN** 单元 3 进行中 **WHEN** 查看单元卡片 **THEN** .glass-elevated + Rose 图标 + 部分进度条
5. **GIVEN** 单元 3 课时全部完成但未测评 **WHEN** 查看测评区 **THEN** 显示 "📝 开始单元测评" Rose CTA
6. **GIVEN** 单元 4 锁定 **WHEN** 点击单元 4 **THEN** Toast "请先完成上一单元的测评"
7. **GIVEN** 全部单元测评通过 **WHEN** 查看综合考核卡片 **THEN** Rose CTA "开始考核"
8. **GIVEN** 进入单元 3 课时列表 **WHEN** 渲染 5 个课时 **THEN** 2 个已完成 + 1 个进行中 + 2 个锁定
9. **GIVEN** 课时 3 进行中 **WHEN** 点击 **THEN** 导航到课时学习页，恢复上次位置
10. **GIVEN** 课时 4 锁定 **WHEN** 点击 **THEN** Toast "请先完成上一课时"
11. **GIVEN** 暗色模式 **WHEN** 查看页面 **THEN** Cosmic Refraction Dark 主题正确
12. **GIVEN** API 加载中 **WHEN** 渲染页面 **THEN** 显示骨架屏

## Docker 自动化测试（强制）

> ⚠️ 绝对禁止在宿主机环境测试，必须通过 Docker 容器验证 ⚠️

### 测试步骤

1. `docker compose up -d --build`
2. 通过 Browser MCP 从课程首页点击 Level → 验证详情页
3. 验证顶部信息区（名称 + 标签 + 进度 + 有效期）
4. 验证单元卡片 4 种状态
5. 验证单元测评入口 3 种小状态
6. 验证综合考核入口 3 种状态
7. 验证课时列表子页面 4 种课时状态
8. 验证锁定点击 Toast
9. 验证 Dark / Light 模式
10. 截图留存

### 测试通过标准

- [ ] TypeScript 零编译错误
- [ ] Docker 构建成功
- [ ] Level 信息区正确
- [ ] 单元 4 种状态视觉区分
- [ ] 测评入口 3 种小状态正确
- [ ] 综合考核入口正确
- [ ] 课时列表 4 种状态正确
- [ ] 解锁/锁定逻辑正确
- [ ] Dark/Light 模式正确
- [ ] 所有 GIVEN-WHEN-THEN 验收标准通过

### 测试不通过处理

- 发现问题 → 修复 → 重新 Docker 构建 → 重新验证
- 同一问题 3 次修复失败 → 标记阻塞

## 执行结果报告

结果文件路径: `/tasks/result/04-course-learning/T04-012-fe-level-detail.md`

## 自检重点

- [ ] 设计: 进度条 8px 高（顶部）/ 6px 高（单元卡片）
- [ ] 设计: 标签 Amber 色
- [ ] 设计: .glass-elevated 仅用于进行中状态
- [ ] 交互: 页面转场 Push/Pop 300ms
- [ ] 交互: 锁定项点击 Toast 反馈
- [ ] 无障碍: 列表项可键盘聚焦
- [ ] 不使用 tailwind.config.js
