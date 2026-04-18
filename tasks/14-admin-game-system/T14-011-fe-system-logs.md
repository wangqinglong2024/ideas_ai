# T14-011: 前端页面 — 系统操作日志

> 分类: 14-管理后台-游戏管理与系统设置 (Admin Game & System)
> 状态: 📋 待开发
> 复杂度: M(中等)
> 预估文件数: 8

## 需求摘要

实现管理后台系统操作日志的完整前端页面，包括：日志列表页（筛选栏含操作人/操作类型/日期范围/目标模块 4 个维度、日志时间线表格含可展开行、行展开详情区域含变更前后左右对比面板/差异高亮、操作详情键值对展示）、日志导出弹窗（范围选择+格式 CSV+行数/频率限制提示）。仅超级管理员可访问。所有 UI 遵循 Cosmic Refraction 设计系统。

## 相关上下文

- 产品需求: `product/admin/04-admin-game-system/07-system-logs.md` §一 — 系统操作日志（筛选栏/列表表格/行展开详情/审计核心变更对比/导出/保留策略完整 PRD）
- UI 规范: `grules/06-ui-design.md` — Cosmic Refraction 设计系统
- 关联任务: 前置 T14-006（系统日志 API）→ 后续 T14-012（集成验证）

## 技术方案

### 路由配置

```typescript
'/admin/system-logs'                 → SystemLogsPage       // 系统操作日志
```

### 组件结构

```
pages/admin/system-logs/
├── SystemLogsPage.tsx               // 日志主页面
├── components/
│   ├── LogFilters.tsx               // 筛选栏（操作人/类型/日期/模块）
│   ├── LogTable.tsx                 // 日志列表表格（含展开行）
│   ├── LogExpandRow.tsx             // 行展开详情（变更对比）
│   ├── ChangeComparePanel.tsx       // 变更前后左右对比面板
│   ├── OperationDetailPanel.tsx     // 纯操作详情（无对比时）
│   └── ExportLogModal.tsx           // 导出弹窗
├── hooks/
│   └── useSystemLogs.ts
└── types.ts
```

### 日志主页面

```typescript
// SystemLogsPage.tsx
// 权限守卫: 非超级管理员 → 跳转 403
//
// 标题 "系统操作日志" (H1, 32px, fw700)
// 标题右侧: "导出" Sky 描边按钮 → ExportLogModal
//
// LogFilters: 一行排列, 间距 12px
//   操作人: 下拉(动态获取管理员列表, 含"已删除-{原姓名}")
//   操作类型: 下拉(内容管理/用户管理/订单与退款/知语币/游戏管理/系统设置/登录登出)
//   日期范围: 日期范围选择器, 默认最近7天, 快捷(今日/7天/30天/90天/自定义), 最大365天
//   目标模块: 下拉(皮肤/赛季/排行榜/推送/多语言/管理员/课程/文章/订单/用户/知语币)
//
// LogTable — .glass-card, rounded-2xl, 分页 50 条, 默认时间降序
```

### 日志列表表格

```typescript
// LogTable.tsx
// 列:
// 1. 展开 40px — Lucide ChevronRight 灰色小箭头, 展开后旋转90°
// 2. 操作时间 160px — YYYY-MM-DD HH:mm:ss, Body S
// 3. 操作人 120px — 管理员姓名; 已删除→灰色斜体"已删除-{原姓名}"
// 4. 操作类型 120px — 彩色标签:
//      内容管理=Sky, 用户管理=Amber, 订单与退款=Rose,
//      知语币=#a855f7, 游戏管理=#22c55e, 系统设置=#a3a3a3, 登录登出=白色
// 5. 操作描述 auto — 一句话描述, Body S
// 6. 目标 120px — 可点击跳转到对应详情页
// 7. IP地址 120px — 灰色, Body S
//
// 行高: 56px (基础), 展开后自适应
// 默认排序: 时间降序
```

### 行展开详情（审计核心）

```typescript
// LogExpandRow.tsx — 点击展开按钮, 行下方展开
// 背景: rgba(255,255,255,0.02)
// 左侧缩进: 40px (与展开按钮对齐)
//
// 有变更对比 → ChangeComparePanel:
//   左右两栏:
//     左栏 "变更前" + 灰色背景
//     右栏 "变更后" + 浅绿背景 rgba(34,197,94,0.05)
//   每个变更字段:
//     字段中文标签 + ": " + 值
//     旧值: 删除线 + 红色 #ef4444
//     新值: 加粗 + 绿色 #22c55e
//
// 无变更对比(纯操作) → OperationDetailPanel:
//   键值对形式展示操作详情, 不分左右栏
//
// 操作类型 → 展示内容:
//   皮肤上架/下架: 皮肤名/类别/游戏/价格/操作人
//   赛季开始/结束: 赛季名/起止日期; 结束→5步执行结果
//   排行榜处理: 用户名/处理方式/原因
//   推送发送: 三语标题/类型/目标人数/发送时间
//   翻译发布: 版本号/变更条数/键名列表(前20条)
//   管理员变更: 字段级对比(角色/状态等)
//   管理员创建/删除: 姓名/邮箱/角色
```

### 日志导出弹窗

```typescript
// ExportLogModal.tsx
// 标题: "导出操作日志"
//
// 导出范围: 单选 "当前筛选结果" / "自定义日期范围"
//   自定义: 日期范围选择器
// 导出格式: CSV (.csv)
// 导出列: 操作时间 + 操作人 + 操作类型 + 操作描述 + 目标 + IP + 变更详情
//
// 限制提示:
//   行数: 超50,000条 → Amber Toast "导出记录超过 50,000 条，请缩小筛选范围"
//   频率: 已导出5次/小时 → 红色 Toast "本小时导出次数已达上限，请稍后再试"
//
// 按钮: 取消(灰描边) + "导出"(Rose实心)
//   导出 → 浏览器下载 CSV → Toast"导出成功"
```

### API 对接 Hook

```typescript
// useSystemLogs.ts
export function useSystemLogs() {
  // GET /api/v1/admin/system-logs — 日志列表（分页+筛选）
  // GET /api/v1/admin/system-logs/:id — 日志详情
  // POST /api/v1/admin/system-logs/export — 导出
  // GET /api/v1/admin/system-logs/operators — 操作人列表
}
```

## 范围（做什么）

- 创建系统日志主页面（筛选栏 + 可展开行表格）
- 创建行展开详情组件（变更前后对比 + 操作详情）
- 创建导出弹窗（范围+限制提示）
- 创建 API 对接 Hook
- 配置路由注册 + 权限守卫

## 边界（不做什么）

- 不实现系统日志后端 API 和中间件（T14-006）
- 不实现日志归档查询页面（P2）
- 不实现日志实时推送

## 涉及文件

- 新建: `zhiyu/frontend/src/pages/admin/system-logs/SystemLogsPage.tsx`
- 新建: `zhiyu/frontend/src/pages/admin/system-logs/components/*.tsx` (6 个组件)
- 新建: `zhiyu/frontend/src/pages/admin/system-logs/hooks/useSystemLogs.ts`
- 新建: `zhiyu/frontend/src/pages/admin/system-logs/types.ts`
- 修改: `zhiyu/frontend/src/router/admin.tsx` — 注册系统日志路由

## 依赖

- 前置: T14-006（系统日志 API）
- 后续: T14-012（集成验证）

## 验收标准（GIVEN-WHEN-THEN）

1. **GIVEN** 超级管理员已登录  
   **WHEN** 访问 `/admin/system-logs`  
   **THEN** 显示日志列表页：筛选栏(4个下拉) + 表格(7列+展开列) + 分页 50 条，默认时间降序

2. **GIVEN** 非超级管理员（如游戏运营）  
   **WHEN** 访问 `/admin/system-logs`  
   **THEN** 跳转至 403 页面

3. **GIVEN** 日志列表已加载  
   **WHEN** 筛选操作类型为"游戏管理" + 日期范围"最近 7 天"  
   **THEN** 表格仅显示匹配的日志记录

4. **GIVEN** 日志列表有一条皮肤编辑记录  
   **WHEN** 点击展开箭头  
   **THEN** 行下方展开变更前后对比面板：左栏"变更前"灰色背景，右栏"变更后"浅绿色背景，变更字段差异高亮（旧值删除线红色/新值加粗绿色）

5. **GIVEN** 日志列表有一条推送发送记录  
   **WHEN** 点击展开  
   **THEN** 展开区域显示操作详情键值对（三语标题/类型/目标人数/发送时间），无左右对比栏

6. **GIVEN** 日志列表有一条赛季结束记录  
   **WHEN** 点击展开  
   **THEN** metadata 中展示 5 步操作执行结果

7. **GIVEN** 超级管理员点击"导出"  
   **WHEN** 选择"当前筛选结果" → "导出"  
   **THEN** 浏览器下载 CSV 文件，Toast"导出成功"

8. **GIVEN** 导出条数超过 50,000  
   **WHEN** 点击"导出"  
   **THEN** Amber Toast "导出记录超过 50,000 条，请缩小筛选范围"

9. **GIVEN** 本小时已导出 5 次  
   **WHEN** 第 6 次点击"导出"  
   **THEN** 红色 Toast "本小时导出次数已达上限，请稍后再试"

10. **GIVEN** 日期范围选择器  
    **WHEN** 选择快捷"最近 30 天"  
    **THEN** 日期范围自动填充，表格刷新

11. **GIVEN** 操作人列中有已删除管理员  
    **WHEN** 查看该行  
    **THEN** 操作人显示为灰色斜体"已删除-{原姓名}"

12. **GIVEN** 所有 UI 渲染完成  
    **WHEN** 检查 UI 规格  
    **THEN** 符合 Cosmic Refraction：毛玻璃/配色/图标一致

## Docker 自动化测试（强制）

> ⚠️ 绝对禁止在宿主机环境测试，必须通过 Docker 容器验证 ⚠️

### 测试步骤

1. `docker compose up -d --build`
2. `docker compose ps`
3. Browser MCP 打开系统日志页
4. 测试权限守卫（非超管 403）
5. 测试筛选栏（4 个维度组合筛选）
6. 测试行展开（变更对比 + 操作详情）
7. 测试差异高亮（删除线红/加粗绿）
8. 测试导出弹窗（正常/超限/频率）
9. 测试日期快捷选项
10. 测试已删除管理员显示

### 测试通过标准

- [ ] TypeScript 零编译错误
- [ ] Docker 构建成功
- [ ] 权限守卫正确（仅超管可访问）
- [ ] 筛选组合正确
- [ ] 行展开/收起动画流畅
- [ ] 变更对比左右栏正确（颜色/对齐/差异高亮）
- [ ] 操作类型彩色标签正确（7 种颜色）
- [ ] 导出限制提示正确
- [ ] 日期快捷选项正确
- [ ] UI 风格统一

### 测试不通过处理

- 发现问题 → 立即修复 → 重新 Docker 构建 → 重新验证全部
- 同一问题 3 次修复失败 → 标记阻塞，停止任务

## 执行结果报告

结果文件路径: `/tasks/result/14-admin-game-system/T14-011-fe-system-logs.md`

## 自检重点

- [ ] UI 规范: Tailwind CSS v4, 无 tailwind.config.js
- [ ] UI 规范: Rose/Sky/Amber only, 无 Purple（注意：知语币标签用 #a855f7 是 PRD 明确指定的唯一例外）
- [ ] 交互: 展开箭头旋转 90° 动画
- [ ] 交互: 变更前后对比面板对齐、差异高亮清晰
- [ ] 安全: 日志内容只读，前端无修改/删除操作
- [ ] 性能: 50 条/页 + 展开行不影响滚动性能
