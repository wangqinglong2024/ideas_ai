# T14-009: 前端页面 — 排行榜管理 + 推送管理

> 分类: 14-管理后台-游戏管理与系统设置 (Admin Game & System)
> 状态: 📋 待开发
> 复杂度: L(大)
> 预估文件数: 16

## 需求摘要

实现管理后台排行榜管理和推送管理的完整前端页面。排行榜模块：排行榜查看页（筛选栏含排行榜类型/游戏/赛季/段位、Top3 高亮表格、用户游戏数据侧边抽屉含各游戏数据+段位变动历史）、异常数据处理（标记可疑弹窗+异常处理弹窗含重置段位/清除数据/取消标记）。推送模块：推送列表页（筛选栏+表格+操作列）、新建/编辑推送页（三语标题+内容、推送类型卡片选择、目标人群条件构建器、推送预览卡片、定时发送配置）、发送确认弹窗+推送详情页（发送统计）。

## 相关上下文

- 产品需求: `product/admin/04-admin-game-system/03-leaderboard.md` — 排行榜查看 §一（筛选/表格/Top3/侧边抽屉）、异常处理 §二（标记/处理弹窗）
- 产品需求: `product/admin/04-admin-game-system/04-push-management.md` — 推送列表 §一（筛选/表格/操作列）、新建编辑 §二（三语内容/类型选择/人群条件/预览/定时）
- UI 规范: `grules/06-ui-design.md` — Cosmic Refraction 设计系统
- 关联任务: 前置 T14-003（排行榜 API）、T14-004（推送 API）→ 后续 T14-012（集成验证）

## 技术方案

### 路由配置

```typescript
// 排行榜管理
'/admin/leaderboard'                 → LeaderboardPage       // 排行榜查看

// 推送管理
'/admin/push'                        → PushListPage          // 推送列表
'/admin/push/create'                 → PushCreatePage        // 新建推送
'/admin/push/:pushId/edit'           → PushEditPage          // 编辑推送
'/admin/push/:pushId/detail'         → PushDetailPage        // 推送详情（只读）
```

### 排行榜组件结构

```
pages/admin/leaderboard/
├── LeaderboardPage.tsx              // 排行榜主页面
├── components/
│   ├── LeaderboardFilters.tsx       // 筛选栏（类型/游戏/赛季/段位）
│   ├── LeaderboardTable.tsx         // 排行榜表格（Top3高亮）
│   ├── UserGameDataDrawer.tsx       // 用户游戏数据侧边抽屉 (480px)
│   ├── FlagSuspiciousModal.tsx      // 标记可疑确认弹窗
│   └── HandleAnomalyModal.tsx       // 异常处理弹窗（3种操作）
├── hooks/
│   └── useLeaderboard.ts
└── types.ts
```

### 推送管理组件结构

```
pages/admin/push/
├── PushListPage.tsx                 // 推送列表页
├── PushCreatePage.tsx               // 新建推送页
├── PushEditPage.tsx                 // 编辑推送页
├── PushDetailPage.tsx               // 推送详情页（只读）
├── components/
│   ├── PushFilters.tsx              // 筛选栏（状态/类型/日期）
│   ├── PushTable.tsx                // 推送列表表格
│   ├── PushForm.tsx                 // 新建/编辑共用表单
│   ├── PushTypeSelector.tsx         // 推送类型卡片选择器
│   ├── AudienceBuilder.tsx          // 目标人群条件构建器
│   ├── PushPreviewCard.tsx          // 推送预览卡片（手机模拟）
│   ├── SendConfirmModal.tsx         // 发送确认弹窗
│   └── PushStats.tsx               // 发送统计展示
├── hooks/
│   └── usePush.ts
└── types.ts
```

### 排行榜表格核心

```typescript
// LeaderboardTable.tsx
// .glass-card, rounded-2xl
// 分页: 每页 50 条（数据量大）
// Top 3 高亮:
//   第1名: rgba(253,230,138,0.08), 🥇替代数字
//   第2名: rgba(192,192,192,0.06), 🥈替代数字
//   第3名: rgba(217,119,6,0.04), 🥉替代数字
//
// 列: 排名 / 用户信息(头像32px+昵称Sky链接) / 段位(图标+名称+星数)
//     / 总对战场次(sortable) / 总胜率(≥60%绿,<40%红) 
//     / 最近活跃(>7天Amber) / 异常标记(可疑/已处理) / 操作

// 操作列:
// - 查看详情: Sky, 始终 → UserGameDataDrawer
// - 标记可疑: Amber #d97706, 未标记时 → FlagSuspiciousModal
// - 处理: 错误色 #ef4444, 已标记可疑时 → HandleAnomalyModal
```

### 用户游戏数据侧边抽屉

```typescript
// UserGameDataDrawer.tsx — 从右侧滑入, 宽度 480px, 毛玻璃背景
// 关闭: X按钮 + 遮罩层
//
// 用户基本信息区:
//   64px头像 + H3昵称 / 用户ID(灰) / 当前段位(图标+名称+星数)
//   注册日期 / 最近活跃 / "跳转用户详情" Sky链接
//
// 各游戏数据表格 (12 行):
//   游戏名 / 对战场次 / 胜场 / 胜率 / 最高连胜 / 平均用时
//
// 段位变动历史 (最近 30 条):
//   时间 / 变动("白银I → 黄金III" 升段绿↑降段红↓) / 触发游戏
```

### 异常处理弹窗

```typescript
// HandleAnomalyModal.tsx
// 弹窗标题: "处理异常用户"
// 用户信息展示: 头像+昵称+当前段位+可疑原因
//
// 处理方式 (单选):
//   1. "重置段位" — 重置到指定段位(下拉选择)
//   2. "清除游戏数据" — 清除对战记录+段位归零
//   3. "取消标记" — 误标记，恢复正常
//
// 处理原因: 文本框, 必填, "请输入处理原因"
// 按钮: 取消(灰描边) + "确认处理"(#ef4444)
```

### 推送列表页

```typescript
// PushListPage.tsx
// 标题 "推送管理" + "新建推送" Rose 实心按钮
//
// PushFilters: 状态/类型/发送日期范围
//
// PushTable — .glass-card, 行高 56px, 分页 20 条
// 列: 标题(240px,ellipsis+Tooltip) / 类型(彩色标签Sky/Amber/灰)
//     / 目标人群 / 推送时间(待发送=Amber"定时"标签) / 状态(圆点)
//     / 送达率(仅已发送,≥90%绿<70%红) / 操作
//
// 操作列:
// - 编辑: Sky, 草稿/待发送 → /push/{id}/edit
// - 查看: Sky, 已发送/失败 → /push/{id}/detail (只读)
// - 发送: Rose, 仅草稿 → SendConfirmModal
// - 取消发送: Amber, 仅待发送 → 确认弹窗 → 回退草稿
// - 重试: Amber, 仅失败 → 重试确认
// - 删除: #ef4444, 仅草稿
```

### 新建/编辑推送表单

```typescript
// PushForm.tsx — .glass-card, max-w-[900px], mx-auto
//
// §2.2 推送标题区 — 三语标题输入框(中/英/越, 各必填)
// §2.3 推送内容区 — 三语多行文本框(中/英/越, 各必填+字数统计)
//
// §2.4 推送类型 (PushTypeSelector)
//   3 个卡片式单选: 学习提醒(BookOpen) / 活动通知(PartyPopper) / 系统通知(Settings)
//   选中: Rose边框 + 背景 rgba(225,29,72,0.06)
//
// §2.5 目标人群 (AudienceBuilder)
//   全部用户 / 自定义人群(展开条件筛选器)
//   条件: 用户类型(免费/付费) / 活跃度(X天未登录) / 国家 / 段位范围 / 课程进度
//   预估人数: 调用 estimate-audience API 展示
//
// §2.6 推送预览 (PushPreviewCard)
//   手机模拟卡片(280px宽), 显示三语Tab切换预览
//
// §2.7 发送时间
//   立即发送 / 定时发送(日期时间选择器)
//
// 底部按钮: 存为草稿(灰描边) + 发送/定时发送(Rose实心)

// SendConfirmModal — "确认发送推送"
//   三语标题预览 + 推送类型 + 目标人群数 + 发送时间
//   "发送后将无法撤回（定时推送可在发送前取消），确认发送？"
//   按钮: 取消(灰描边) + 确认发送(Rose实心)
```

### 推送详情页（只读）

```typescript
// PushDetailPage.tsx — 已发送/发送失败的推送只读查看
// 三语内容展示 + 推送类型 + 目标人群 + 发送时间
// PushStats: 目标人数 / 送达数 / 送达率 / 打开数 / 打开率
// 如发送失败: 红色错误信息 + "重试" 按钮
```

## 范围（做什么）

- 创建排行榜查看页（筛选+表格+Top3 高亮+侧边抽屉+异常处理弹窗）
- 创建推送列表页（筛选+表格+操作列）
- 创建新建/编辑推送页（三语+类型+人群+预览+定时）
- 创建推送详情页（只读+统计）
- 创建发送确认弹窗
- 创建 API 对接 Hooks
- 配置路由注册

## 边界（不做什么）

- 不实现排行榜/推送后端 API（T14-003 / T14-004）
- 不实现推送真实送达（依赖 FCM/APNs 基础设施）
- 不实现排行榜实时更新（WebSocket）

## 涉及文件

- 新建: `zhiyu/frontend/src/pages/admin/leaderboard/*.tsx` (6 个文件)
- 新建: `zhiyu/frontend/src/pages/admin/push/*.tsx` (12 个文件)
- 修改: `zhiyu/frontend/src/router/admin.tsx` — 注册排行榜+推送路由

## 依赖

- 前置: T14-003（排行榜 API）、T14-004（推送 API）
- 后续: T14-012（集成验证）

## 验收标准（GIVEN-WHEN-THEN）

1. **GIVEN** 管理员已登录  
   **WHEN** 访问 `/admin/leaderboard`  
   **THEN** 显示排行榜表格，Top3 行背景高亮（金/银/铜色），前3名显示奖牌图标

2. **GIVEN** 排行榜表格已加载  
   **WHEN** 切换筛选"赛季排行" → 选择历史赛季 + 段位"钻石"  
   **THEN** 表格仅显示该赛季钻石段位用户排名

3. **GIVEN** 排行榜有用户数据  
   **WHEN** 点击某用户"查看详情"  
   **THEN** 右侧滑入 480px 侧边抽屉，展示用户基本信息 + 12 款游戏数据表 + 段位变动历史

4. **GIVEN** 某用户被标记为"可疑"  
   **WHEN** 点击"处理" → 选择"重置段位"→ 选择目标段位 → 填写原因 → 确认  
   **THEN** 用户段位重置，异常标记变为"已处理"，列表刷新

5. **GIVEN** 管理员已登录  
   **WHEN** 访问 `/admin/push`  
   **THEN** 显示推送列表，列含标题/类型(彩色标签)/人群/时间/状态(圆点)/送达率/操作

6. **GIVEN** 管理员点击"新建推送"  
   **WHEN** 进入 `/admin/push/create`  
   **THEN** 显示完整表单：三语标题+内容、类型卡片选择、人群构建器、预览卡片、发送时间

7. **GIVEN** 管理员选择推送类型"活动通知"  
   **WHEN** 点击卡片  
   **THEN** 活动通知卡片 Rose 边框+背景高亮，其他卡片恢复默认

8. **GIVEN** 管理员选择"自定义人群"  
   **WHEN** 设置条件"7天未登录 + 付费用户"  
   **THEN** 调用 estimate-audience API，底部显示"预估覆盖约 X 人"

9. **GIVEN** 管理员填写三语推送内容  
   **WHEN** 查看推送预览卡片  
   **THEN** 手机模拟卡片显示推送通知样式，Tab 切换中/英/越预览

10. **GIVEN** 推送状态为"草稿"  
    **WHEN** 点击"发送" → 确认弹窗 → "确认发送"  
    **THEN** 调用发送 API → Toast "推送已发送" → 列表刷新

11. **GIVEN** 推送状态为"已发送"  
    **WHEN** 点击"查看" → 进入详情页  
    **THEN** 显示推送内容（只读）+ 发送统计（目标/送达/送达率/打开/打开率）

12. **GIVEN** 所有 UI 渲染完成  
    **WHEN** 检查 UI 规格  
    **THEN** 符合 Cosmic Refraction：毛玻璃面板、Rose/Sky/Amber 配色、Lucide 图标

## Docker 自动化测试（强制）

> ⚠️ 绝对禁止在宿主机环境测试，必须通过 Docker 容器验证 ⚠️

### 测试步骤

1. `docker compose up -d --build`
2. `docker compose ps`
3. Browser MCP 打开排行榜页
4. 测试排行榜筛选 + Top3 高亮 + 侧边抽屉
5. 测试异常标记 + 处理弹窗
6. Browser MCP 打开推送列表页
7. 测试推送筛选 + 操作列
8. 测试新建推送（三语+类型+人群+预览+定时）
9. 测试发送确认 + 推送详情
10. 测试整体 UI 风格一致性

### 测试通过标准

- [ ] TypeScript 零编译错误
- [ ] Docker 构建成功
- [ ] 排行榜 Top3 高亮正确（金/银/铜色 + 奖牌图标）
- [ ] 侧边抽屉内容完整（用户信息+游戏数据+段位历史）
- [ ] 异常处理 3 种方式正确
- [ ] 推送表单三语 + 类型卡片 + 人群构建器正常
- [ ] 推送预览卡片正确展示
- [ ] 发送确认 + 详情统计正确
- [ ] UI 风格统一

### 测试不通过处理

- 发现问题 → 立即修复 → 重新 Docker 构建 → 重新验证全部
- 同一问题 3 次修复失败 → 标记阻塞，停止任务

## 执行结果报告

结果文件路径: `/tasks/result/14-admin-game-system/T14-009-fe-leaderboard-push.md`

## 自检重点

- [ ] UI 规范: Tailwind CSS v4, 无 tailwind.config.js
- [ ] UI 规范: Rose/Sky/Amber only, 无 Purple
- [ ] 交互: 侧边抽屉滑入动画 + 遮罩层关闭
- [ ] 交互: 人群构建器条件联动 + 预估人数更新
- [ ] 交互: 推送预览卡片三语 Tab 切换
- [ ] 性能: 排行榜 50 条/页大数据量表格性能
