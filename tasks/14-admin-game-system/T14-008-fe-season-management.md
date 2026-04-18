# T14-008: 前端页面 — 赛季管理

> 分类: 14-管理后台-游戏管理与系统设置 (Admin Game & System)
> 状态: 📋 待开发
> 复杂度: L(大)
> 预估文件数: 14

## 需求摘要

实现管理后台赛季管理的完整前端页面，包括：赛季列表页（当前赛季高亮卡片含进度条 + 列表表格含操作列）、新建/编辑赛季页（基本信息表单 + 段位重置规则可编辑表格 + 赛季奖励可编辑表格，编辑限制提示）、开始赛季确认弹窗、结束赛季双重确认弹窗（输入赛季名确认 + 5 步进度 UI）、赛季报告页（核心指标卡片 + 段位分布柱状图 + 数据表格）。高风险操作有特殊 UI 保护。所有 UI 遵循 Cosmic Refraction 设计系统。

## 相关上下文

- 产品需求: `product/admin/04-admin-game-system/02-season-management.md` — 赛季列表 §一（当前赛季卡片/列表表格/操作列）、新建编辑 §二（表单/段位重置/奖励配置）、赛季操作 §三（开始确认/结束双重确认/5 步进度 UI/失败回滚）、赛季报告 §四（指标卡片/柱状图/表格）
- UI 规范: `grules/06-ui-design.md` — Cosmic Refraction 设计系统
- 编码规范: `grules/05-coding-standards.md` §二 — 前端目录结构
- 关联任务: 前置 T14-002（赛季管理 API）→ 后续 T14-012（集成验证）

## 技术方案

### 路由配置

```typescript
'/admin/seasons'                     → SeasonListPage       // 赛季列表
'/admin/seasons/create'              → SeasonCreatePage      // 新建赛季
'/admin/seasons/:seasonId/edit'      → SeasonEditPage        // 编辑赛季
'/admin/seasons/:seasonId/report'    → SeasonReportPage      // 赛季报告
```

### 页面组件结构

```
pages/admin/seasons/
├── SeasonListPage.tsx               // 赛季列表页
├── SeasonCreatePage.tsx             // 新建赛季页
├── SeasonEditPage.tsx               // 编辑赛季页
├── SeasonReportPage.tsx             // 赛季报告页
├── components/
│   ├── CurrentSeasonCard.tsx        // 当前赛季高亮卡片
│   ├── SeasonTable.tsx              // 赛季列表表格
│   ├── SeasonForm.tsx               // 新建/编辑共用表单
│   ├── TierResetRulesTable.tsx      // 段位重置规则可编辑表格
│   ├── SeasonRewardsTable.tsx       // 赛季奖励可编辑表格
│   ├── StartSeasonModal.tsx         // 开始赛季确认弹窗
│   ├── EndSeasonModal.tsx           // 结束赛季双重确认弹窗 + 5 步进度
│   ├── SeasonProgressSteps.tsx      // 5 步操作进度展示组件
│   ├── ReportMetricCards.tsx        // 报告核心指标卡片
│   └── TierDistributionChart.tsx    // 段位分布柱状图
├── hooks/
│   ├── useSeasons.ts               // 赛季列表 CRUD Hook
│   └── useSeasonForm.ts            // 表单状态管理 Hook
└── types.ts
```

### 赛季列表页

```typescript
// SeasonListPage.tsx
// - 页面标题 "赛季管理" (H1, 32px, fw700)
// - "新建赛季" Rose 实心按钮 (rounded-full, h-10, Lucide Plus)
// 
// CurrentSeasonCard（条件渲染：有进行中赛季时显示）
// - .glass-card, rounded-2xl, 左侧 4px Rose 边框
// - 赛季名称(H2) + "进行中"绿色标签 + 起止日期
// - 已进行天数/总天数 + Rose 色进度条
// - "查看详情"(Sky描边) + "手动结束赛季"(#ef4444描边)
//
// SeasonTable — .glass-card, 行高 56px, 分页 20 条
// 列: 编号(S001) / 名称 / 起始日期(默认降序) / 结束日期 / 时长 / 状态(圆点) / 参与人数 / 操作
// 进行中赛季行背景加亮: rgba(225,29,72,0.04)
```

### 操作列逻辑

```typescript
// - 查看/编辑: Sky 色, 始终显示, → /admin/seasons/{id}/edit
// - 手动开始: 成功色 #22c55e, 仅"待开始", → StartSeasonModal
// - 手动结束: 错误色 #ef4444, 仅"进行中", → EndSeasonModal
// - 查看报告: Amber 色 #d97706, 仅"已结束", → /admin/seasons/{id}/report
```

### 新建/编辑赛季表单

```typescript
// SeasonForm.tsx — .glass-card, max-w-[900px], mx-auto
//
// 编辑限制提示 Banner:
// - 进行中: Amber 色 Banner "赛季已开始，起止日期不可修改，仅可修改赛季名称。"
// - 已结束: 灰色 Banner "赛季已结束，所有字段不可修改。" + 全字段只读
//
// §2.2 基本信息区
//   - 赛季名称: .glass-input rounded-full, 2-30字, 必填
//   - 起始日期: 日期选择器, 必填, 新建≥今天, 进行中/已结束 Disabled
//   - 结束日期: 日期选择器, 必填, >起始日期
//   - 赛季时长: 只读灰色 "共 X 天"
//
// §2.3 段位重置规则 (TierResetRulesTable)
//   - 7 行可编辑表格: 王者→...→青铜
//   - 当前段位列: 只读, 段位图标+名称
//   - 重置后段位列: 下拉选择所有小段(如"黄金III","白银I")
//   - 默认建议值: 王者→铂金II, 星耀→铂金IV, 钻石→黄金III...
//   - 校验: 7 段全填 + 重置后≤当前段
//
// §2.4 赛季奖励 (SeasonRewardsTable)
//   - 7 行可编辑表格: 王者→...→青铜
//   - 知语币奖励: 数字输入, 非负整数
//   - 专属皮肤: 下拉选择(赛季限定皮肤+缩略图), 可选"无"
//   - 校验: 高段位奖励≥低段位 → Amber 警告(不阻止)
//
// 底部按钮: 取消(灰描边) + 保存(Rose实心)
```

### 结束赛季双重确认弹窗

```typescript
// EndSeasonModal.tsx — 3 阶段 UI
//
// 阶段 1: 第一次确认
//   - 标题: "⚠️ 结束赛季 — 第 1 步确认"
//   - 顶部红色警告条
//   - 5 步操作清单编号列表
//   - 按钮: 取消(灰描边) + "我已了解，继续"(Amber实心)
//
// 阶段 2: 第二次确认
//   - 标题: "⚠️ 结束赛季 — 最终确认"
//   - 输入框: "请输入赛季名称「{name}」以确认"
//   - 校验: 精确匹配才启用确认按钮
//   - 按钮: 取消(灰描边) + "确认结束赛季"(#ef4444, 默认 Disabled)
//
// 阶段 3: 执行进度 (SeasonProgressSteps)
//   - 5 步纵向列表, 每步有状态图标:
//     待执行=灰圆圈, 执行中=蓝Loading旋转, 已完成=绿✓, 失败=红✗
//   - 步骤: ①记录段位 ②发放奖励 ③重置段位 ④下架皮肤 ⑤生成报告
//   - 全部完成: "赛季结束操作已全部完成" + "查看报告"+"关闭"
//   - 任一失败: 红✗+错误信息 → "操作失败，请联系技术团队" + "关闭"
```

### 赛季报告页

```typescript
// SeasonReportPage.tsx — 仅已结束赛季可查看
// 页面标题: "赛季报告 — {赛季名称}" (H1)
// ArrowLeft 返回赛季列表
//
// §4.2.1 基本信息区: 名称/编号/起止日期/持续天数
//
// §4.2.2 核心指标卡片 (ReportMetricCards) — 4 个横排
//   - 参与用户数 / 总对战场次 / 知语币发放总量 / 最活跃游戏
//   - .glass-card, rounded-2xl, p-6
//
// §4.2.3 段位分布 (TierDistributionChart)
//   - 水平柱状图（推荐 Recharts / ECharts）
//   - 7 段位 x 柱形, Rose 色
//
// §4.2.4 数据表格: 各段位人数/占比/知语币发放/皮肤发放
```

### API 对接 Hook

```typescript
// useSeasons.ts
export function useSeasons() {
  // GET /api/v1/admin/seasons — 列表
  // GET /api/v1/admin/seasons/current — 当前赛季
  // POST /api/v1/admin/seasons — 创建
  // PUT /api/v1/admin/seasons/:id — 编辑
  // POST /api/v1/admin/seasons/:id/start — 开始赛季
  // POST /api/v1/admin/seasons/:id/end — 结束赛季 (SSE/轮询获取进度)
  // GET /api/v1/admin/seasons/:id/report — 赛季报告
  // GET /api/v1/admin/seasons/:id/progress — 结束操作进度
}
```

## 范围（做什么）

- 创建赛季列表页（当前赛季卡片 + 表格 + 操作列）
- 创建新建/编辑赛季页（表单 + 段位重置表 + 奖励配置表）
- 创建赛季操作弹窗（开始确认 + 结束双重确认 + 5 步进度）
- 创建赛季报告页（指标卡片 + 柱状图 + 数据表）
- 创建 API 对接 Hooks
- 配置路由注册

## 边界（不做什么）

- 不实现赛季管理后端 API（T14-002）
- 不实现赛季结束自动触发（定时任务）— 仅手动触发
- 不实现赛季期间排行榜实时更新（WebSocket）

## 涉及文件

- 新建: `zhiyu/frontend/src/pages/admin/seasons/SeasonListPage.tsx`
- 新建: `zhiyu/frontend/src/pages/admin/seasons/SeasonCreatePage.tsx`
- 新建: `zhiyu/frontend/src/pages/admin/seasons/SeasonEditPage.tsx`
- 新建: `zhiyu/frontend/src/pages/admin/seasons/SeasonReportPage.tsx`
- 新建: `zhiyu/frontend/src/pages/admin/seasons/components/*.tsx` (10 个组件)
- 新建: `zhiyu/frontend/src/pages/admin/seasons/hooks/*.ts` (2 个 Hook)
- 新建: `zhiyu/frontend/src/pages/admin/seasons/types.ts`
- 修改: `zhiyu/frontend/src/router/admin.tsx` — 注册赛季管理路由

## 依赖

- 前置: T14-002（赛季管理 API）、T14-007（皮肤管理页，复用部分通用组件）
- 后续: T14-012（集成验证）

## 验收标准（GIVEN-WHEN-THEN）

1. **GIVEN** 管理员（游戏运营）已登录，有一个进行中的赛季  
   **WHEN** 访问 `/admin/seasons`  
   **THEN** 页面顶部显示当前赛季高亮卡片（Rose 左边框 + 进度条 + 操作按钮），下方显示赛季列表

2. **GIVEN** 赛季列表已加载  
   **WHEN** 查看列表表格  
   **THEN** 进行中赛季行背景加亮 rgba(225,29,72,0.04)，各状态显示正确圆点和文字

3. **GIVEN** 管理员点击"新建赛季"  
   **WHEN** 进入 `/admin/seasons/create`  
   **THEN** 显示完整表单：基本信息（名称+起止日期+时长）、段位重置表（7 行可编辑 + 默认建议值）、奖励配置表（7 行可编辑）

4. **GIVEN** 管理员填写段位重置规则  
   **WHEN** 尝试将"青铜"重置为"白银 I"（向上重置）  
   **THEN** 校验失败，提示"重置后段位不可高于当前段位"

5. **GIVEN** 管理员编辑进行中赛季  
   **WHEN** 进入编辑页  
   **THEN** 页面顶部 Amber Banner "赛季已开始，起止日期不可修改..."，日期字段 Disabled 灰色

6. **GIVEN** 赛季状态为"待开始"  
   **WHEN** 点击"手动开始"→ 弹窗显示赛季信息 → 点击"确认开始"  
   **THEN** 赛季状态变为"进行中"，Toast "赛季已开始"

7. **GIVEN** 赛季状态为"进行中"  
   **WHEN** 点击"手动结束"  
   **THEN** 第一次确认弹窗（红色警告条 + 5 步清单）→ 点击"我已了解" → 第二次确认（输入赛季名校验 + #ef4444 确认按钮）

8. **GIVEN** 管理员在第二次确认输入了正确赛季名  
   **WHEN** 点击"确认结束赛季"  
   **THEN** 弹窗切换为 5 步进度展示，每步依次执行（灰→蓝Loading→绿✓），全部完成后显示"查看报告"按钮

9. **GIVEN** 赛季结束操作第 3 步失败  
   **WHEN** 查看进度弹窗  
   **THEN** 步骤 3 显示红✗ + 错误信息，提示"操作失败，赛季未结束，请联系技术团队"

10. **GIVEN** 赛季已结束  
    **WHEN** 访问 `/admin/seasons/{id}/report`  
    **THEN** 显示赛季报告：4 个指标卡片 + 段位分布柱状图 + 详细数据表

11. **GIVEN** 编辑已结束赛季  
    **WHEN** 进入编辑页  
    **THEN** 灰色 Banner 提示 + 全部字段只读

12. **GIVEN** 所有 UI 渲染完成  
    **WHEN** 检查 UI 规格  
    **THEN** 符合 Cosmic Refraction：毛玻璃面板、Rose/Sky/Amber 配色、无 Purple

## Docker 自动化测试（强制）

> ⚠️ 绝对禁止在宿主机环境测试，必须通过 Docker 容器验证 ⚠️

### 测试步骤

1. `docker compose up -d --build` — 构建并启动所有服务
2. `docker compose ps` — 确认所有容器 Running
3. Browser MCP 打开赛季列表页
4. 测试当前赛季卡片（进度条、操作按钮）
5. 测试列表表格（状态展示、行高亮、操作列）
6. 测试新建赛季表单（段位重置 + 奖励配置）
7. 测试编辑限制（进行中/已结束）
8. 测试开始赛季确认弹窗
9. 测试结束赛季双重确认 + 5 步进度
10. 测试赛季报告页（指标 + 图表）

### 测试通过标准

- [ ] TypeScript 零编译错误
- [ ] Docker 构建成功
- [ ] 当前赛季卡片正确展示（含进度条）
- [ ] 列表表格样式 + 操作列逻辑正确
- [ ] 表单字段完整，段位重置/奖励配置可编辑表格正常
- [ ] 编辑限制（进行中/已结束）正确生效
- [ ] 结束赛季双重确认 + 名称输入校验正确
- [ ] 5 步进度 UI（成功/失败）展示正确
- [ ] 赛季报告核心指标 + 图表正常渲染
- [ ] UI 风格符合 Cosmic Refraction

### 测试不通过处理

- 发现问题 → 立即修复 → 重新 Docker 构建 → 重新验证全部
- 同一问题 3 次修复失败 → 标记阻塞，停止任务

## 执行结果报告

结果文件路径: `/tasks/result/14-admin-game-system/T14-008-fe-season-management.md`

## 自检重点

- [ ] UI 规范: Tailwind CSS v4，无 tailwind.config.js
- [ ] UI 规范: Rose/Sky/Amber only, 无 Purple
- [ ] 交互: 结束赛季双重确认（名称精确匹配 + Disabled→Enabled）
- [ ] 交互: 5 步进度展示（Loading 旋转 + 成功✓/失败✗）
- [ ] 交互: 编辑限制 Banner + 字段 Disabled/只读
- [ ] 图表: 段位分布柱状图正确渲染（Recharts/ECharts）
- [ ] 状态管理: React Query 管理赛季数据
