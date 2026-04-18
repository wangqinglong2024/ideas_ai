# T14-010: 前端页面 — 多语言管理

> 分类: 14-管理后台-游戏管理与系统设置 (Admin Game & System)
> 状态: 📋 待开发
> 复杂度: L(大)
> 预估文件数: 12

## 需求摘要

实现管理后台多语言管理的完整前端页面，包括：语言包列表页（语言 Tab 切换(中/英/越)、搜索栏(500ms防抖)、模块筛选、翻译状态筛选、文案列表表格含行内快速编辑(双击进入编辑)）、翻译编辑弹窗（键名只读+中文原文只读+英文/越南语文本框）、批量导入弹窗（上传区+文件解析预览+冲突策略+进度条）、批量导出弹窗（范围选择+格式选择）、翻译发布功能（发布按钮含角标+变更差异预览+确认发布）、发布历史列表。所有 UI 遵循 Cosmic Refraction 设计系统。

## 相关上下文

- 产品需求: `product/admin/04-admin-game-system/05-i18n-management.md` — 语言包列表 §一（Tab/搜索/筛选/表格/行内编辑）、翻译弹窗 §二、导入导出 §三、发布机制 §四、发布历史 §五 完整 PRD
- UI 规范: `grules/06-ui-design.md` — Cosmic Refraction 设计系统
- 关联任务: 前置 T14-005（i18n 管理 API）→ 后续 T14-012（集成验证）

## 技术方案

### 路由配置

```typescript
'/admin/i18n'                        → I18nManagementPage    // 多语言管理主页
'/admin/i18n/publish-history'        → PublishHistoryPage    // 发布历史
```

### 组件结构

```
pages/admin/i18n/
├── I18nManagementPage.tsx           // 多语言管理主页面
├── PublishHistoryPage.tsx           // 发布历史页面
├── components/
│   ├── LanguageTabs.tsx             // 语言 Tab 切换（中/English/Tiếng Việt）
│   ├── I18nSearchBar.tsx            // 搜索栏（500ms 防抖）
│   ├── I18nFilters.tsx              // 模块筛选 + 翻译状态筛选
│   ├── I18nTable.tsx                // 文案列表表格（含行内编辑）
│   ├── InlineEditCell.tsx           // 行内快速编辑单元格
│   ├── TranslationEditModal.tsx     // 翻译编辑弹窗
│   ├── ImportModal.tsx              // 批量导入弹窗（含预览）
│   ├── ExportModal.tsx              // 批量导出弹窗
│   ├── PublishConfirmModal.tsx      // 发布确认弹窗（含变更预览）
│   └── PublishHistoryTable.tsx      // 发布历史列表表格
├── hooks/
│   ├── useI18n.ts                  // i18n CRUD Hook
│   └── useI18nPublish.ts           // 发布相关 Hook
└── types.ts
```

### 多语言管理主页面

```typescript
// I18nManagementPage.tsx
// 标题 "多语言管理" (H1, 32px, fw700)
// 标题右侧按钮组:
//   "导入" Sky 描边按钮 → ImportModal
//   "导出" Sky 描边按钮 → ExportModal
//   "发布" Rose 实心按钮 (有 modified_unpublished 时显示角标如 "发布 (12)")
//     → PublishConfirmModal
//
// LanguageTabs: 毛玻璃面板内 3 Tab ("中文" | "English" | "Tiếng Việt")
//   选中态: Rose 下划线 + 文字 Rose 色
//   切换: 更新表格"当前语言翻译"列
//
// I18nSearchBar: .glass-input, rounded-full, w-[360px], Lucide Search
//   500ms 防抖自动搜索, 匹配键名和文案内容
//
// I18nFilters: 模块下拉(全局/发现/课程/游戏/个人/支付/错误) + 状态下拉(已翻译/待翻译/已修改未发布)
//
// I18nTable — .glass-card, rounded-2xl, 自适应行高(min 56px), 分页 50 条
```

### 文案列表表格

```typescript
// I18nTable.tsx
// 列:
// 1. 键名 220px — 等宽字体, 灰色, Hover可复制→Toast"已复制"
// 2. 中文文案 260px — 白色, 超2行截断+Tooltip
// 3. 当前语言翻译 260px — 中文Tab时隐藏; 待翻译=灰色斜体"待翻译"; 已翻译=白色
// 4. 状态 120px — 已翻译=绿圆点; 待翻译=Amber圆点; 已修改未发布=Sky圆点+Sky"未发布"标签
// 5. 操作 80px — "编辑" Sky文字按钮 → TranslationEditModal

// 行内快速编辑 (InlineEditCell):
// - 触发: 双击"当前语言翻译"列单元格
// - 效果: 变为可编辑文本框, 白色背景, auto focus
// - 保存: Enter 或点击外部 → PATCH quick-edit API → 状态→modified_unpublished → 恢复只读
// - 取消: Esc → 恢复原值
// - 校验: 不可为空
```

### 翻译编辑弹窗

```typescript
// TranslationEditModal.tsx — 宽度 680px
// 标题: "编辑翻译"
// 触发: 点击操作列"编辑" 或 双击行非操作列区域
//
// 键名区: 等宽字体只读 + "复制"图标按钮
// 中文原文区: 只读文本, 白色背景, 完整中文文案
// 英文翻译区: 多行文本框 (.glass-input, rounded-md, 最小h-15), 标红星, 必填
// 越南语翻译区: 同上, 标红星, 必填
//
// 按钮: 取消(灰描边) + 保存(Rose实心)
//   保存 → PUT API → 状态→modified_unpublished → Toast"翻译已保存" → 列表刷新
```

### 批量导入弹窗

```typescript
// ImportModal.tsx
// 标题: "导入语言包"
//
// 上传区: 虚线边框, Lucide Upload 32px + "点击或拖拽上传翻译文件" + "支持 .xlsx/.csv"
// 文件限制: 最大 10MB
//
// 上传后自动解析 → 导入预览:
//   统计: "共 X 条翻译，其中 Y 条已有翻译将被覆盖，Z 条为新增翻译"
//   冲突策略: 单选 "覆盖已有翻译"(默认) / "跳过已有翻译（仅导入空缺项）"
//   预览表格: 前 10 条 (键名 + 中文 + 英文 + 越南语 + 状态标签"新增"/"覆盖"/"跳过")
//
// 按钮: 取消(灰描边) + "确认导入"(Rose实心)
//   确认 → POST import API → 进度条 → Toast"导入完成，共导入 X 条" → 列表刷新
//
// 错误处理: 格式错误 → "仅支持 .xlsx 和 .csv 格式"; 条数超限 → "导入条数不能超过 5,000 条"
```

### 批量导出弹窗

```typescript
// ExportModal.tsx
// 标题: "导出语言包"
//
// 导出范围: 单选 "全部文案" / "仅待翻译文案" / "仅当前筛选结果"
// 导出格式: 单选 "Excel (.xlsx)" / "CSV (.csv)"
// 导出列: 键名 + 中文原文 + 英文翻译 + 越南语翻译 + 模块 + 翻译状态
//
// 按钮: 取消(灰描边) + "导出"(Rose实心)
//   导出 → POST export API → 浏览器自动下载 → Toast"导出成功"
//   文件名: zhiyu_i18n_{日期}_{范围}.xlsx
```

### 发布确认弹窗

```typescript
// PublishConfirmModal.tsx
// 标题: "发布翻译"
//
// 变更摘要: "本次发布包含 X 条翻译变更"
// 变更预览列表: 键名 / 语言 / 旧值(删除线灰) / 新值(绿色加粗)，最多显示 20 条 + "查看全部"
// 版本信息: "发布后版本号将升级为 v{next}"
//
// 按钮: 取消(灰描边) + "确认发布"(Rose实心)
//   发布 → POST publish API → Toast"翻译已发布 (v{版本})" → 角标清零 → 列表状态刷新
```

### 发布历史页

```typescript
// PublishHistoryPage.tsx
// 标题: "发布历史" + ArrowLeft 返回多语言管理
//
// PublishHistoryTable — .glass-card, 分页 20 条
// 列: 版本号 / 发布时间 / 操作人 / 变更条数 / 操作("查看详情" Sky色)
// 查看详情 → 展开行或弹窗，展示变更键名列表(字段/旧值/新值)
```

### API 对接 Hook

```typescript
// useI18n.ts
export function useI18n() {
  // GET /api/v1/admin/i18n — 列表（分页+搜索+筛选）
  // GET /api/v1/admin/i18n/:key — 详情
  // PUT /api/v1/admin/i18n/:key — 编辑
  // PATCH /api/v1/admin/i18n/:key/quick-edit — 行内快速编辑
  // POST /api/v1/admin/i18n/import — 导入
  // POST /api/v1/admin/i18n/export — 导出
  // GET /api/v1/admin/i18n/stats — 统计
}

// useI18nPublish.ts
export function useI18nPublish() {
  // POST /api/v1/admin/i18n/publish — 发布
  // GET /api/v1/admin/i18n/publish/history — 历史列表
  // GET /api/v1/admin/i18n/publish/history/:version — 版本详情
}
```

## 范围（做什么）

- 创建多语言管理主页面（Tab+搜索+筛选+表格+行内编辑）
- 创建翻译编辑弹窗
- 创建导入弹窗（上传+解析预览+冲突策略+进度）
- 创建导出弹窗
- 创建发布确认弹窗（变更预览）
- 创建发布历史页
- 创建 API 对接 Hooks
- 配置路由注册

## 边界（不做什么）

- 不实现 i18n 后端 API（T14-005）
- 不实现键名管理（创建/删除/重命名）
- 不实现机器翻译/翻译建议功能
- 不实现翻译协作（多人同时编辑冲突处理）

## 涉及文件

- 新建: `zhiyu/frontend/src/pages/admin/i18n/I18nManagementPage.tsx`
- 新建: `zhiyu/frontend/src/pages/admin/i18n/PublishHistoryPage.tsx`
- 新建: `zhiyu/frontend/src/pages/admin/i18n/components/*.tsx` (10 个组件)
- 新建: `zhiyu/frontend/src/pages/admin/i18n/hooks/*.ts` (2 个 Hook)
- 新建: `zhiyu/frontend/src/pages/admin/i18n/types.ts`
- 修改: `zhiyu/frontend/src/router/admin.tsx` — 注册 i18n 路由

## 依赖

- 前置: T14-005（i18n 管理 API）
- 后续: T14-012（集成验证）

## 验收标准（GIVEN-WHEN-THEN）

1. **GIVEN** 管理员（内容运营）已登录  
   **WHEN** 访问 `/admin/i18n`  
   **THEN** 显示多语言管理页：Tab 栏(中/英/越) + 搜索栏 + 筛选 + 文案表格

2. **GIVEN** 当前 Tab 为 "English"  
   **WHEN** 查看文案表格  
   **THEN** "当前语言翻译"列显示英文翻译；待翻译条目显示灰色斜体"待翻译"

3. **GIVEN** 管理员在搜索栏输入 "welcome"  
   **WHEN** 500ms 防抖后自动触发搜索  
   **THEN** 表格刷新，仅显示键名或文案包含"welcome"的条目

4. **GIVEN** 管理员双击某行"当前语言翻译"列  
   **WHEN** 单元格变为可编辑文本框  
   **THEN** 自动 focus，输入新内容 → Enter 保存 → 状态变为"已修改未发布" + Sky "未发布"标签

5. **GIVEN** 管理员点击"编辑"按钮  
   **WHEN** 弹出翻译编辑弹窗  
   **THEN** 显示键名(只读) + 中文原文(只读) + 英文/越南语输入框(标红星)

6. **GIVEN** 有 12 条"已修改未发布"翻译  
   **WHEN** 查看页面标题右侧"发布"按钮  
   **THEN** 按钮显示角标 "发布 (12)"

7. **GIVEN** 管理员点击"发布"按钮  
   **WHEN** 弹出发布确认弹窗  
   **THEN** 显示变更摘要 + 变更预览列表(旧值删除线/新值绿色) + 版本号信息

8. **GIVEN** 管理员点击"导入"→ 上传 xlsx 文件  
   **WHEN** 文件解析完成  
   **THEN** 显示导入预览：统计(总/覆盖/新增) + 冲突策略选择 + 前10条预览表

9. **GIVEN** 管理员点击"导出"  
   **WHEN** 选择"仅待翻译文案" + "CSV" → 点击"导出"  
   **THEN** 浏览器自动下载 CSV 文件，Toast"导出成功"

10. **GIVEN** 管理员访问发布历史页  
    **WHEN** 查看历史列表  
    **THEN** 显示版本号/发布时间/操作人/变更数，点击"查看详情"展示变更键名列表

11. **GIVEN** 管理员 Hover 某行键名列  
    **WHEN** 点击键名  
    **THEN** 键名复制到剪贴板，Toast"已复制"

12. **GIVEN** 所有 UI 渲染完成  
    **WHEN** 检查 UI 规格  
    **THEN** 符合 Cosmic Refraction：毛玻璃/Rose/Sky/Amber/Lucide 图标

## Docker 自动化测试（强制）

> ⚠️ 绝对禁止在宿主机环境测试，必须通过 Docker 容器验证 ⚠️

### 测试步骤

1. `docker compose up -d --build`
2. `docker compose ps`
3. Browser MCP 打开多语言管理页
4. 测试 Tab 切换（中/英/越）
5. 测试搜索（防抖 500ms）+ 筛选（模块/状态）
6. 测试行内快速编辑（双击→编辑→Enter 保存→Esc 取消）
7. 测试翻译编辑弹窗
8. 测试导入弹窗（上传+预览+冲突策略）
9. 测试导出弹窗（范围+格式）
10. 测试发布（角标+变更预览+确认）
11. 测试发布历史

### 测试通过标准

- [ ] TypeScript 零编译错误
- [ ] Docker 构建成功
- [ ] Tab 切换联动表格列内容正确
- [ ] 搜索防抖正确（500ms）
- [ ] 行内编辑功能完整（双击/Enter/Esc）
- [ ] 导入预览和冲突策略正确
- [ ] 导出文件下载正常
- [ ] 发布角标 + 变更预览正确
- [ ] 发布历史列表和详情正确
- [ ] 键名 Hover 复制功能正常
- [ ] UI 风格统一

### 测试不通过处理

- 发现问题 → 立即修复 → 重新 Docker 构建 → 重新验证全部
- 同一问题 3 次修复失败 → 标记阻塞，停止任务

## 执行结果报告

结果文件路径: `/tasks/result/14-admin-game-system/T14-010-fe-i18n-management.md`

## 自检重点

- [ ] UI 规范: Tailwind CSS v4, 无 tailwind.config.js
- [ ] UI 规范: Rose/Sky/Amber only, 无 Purple
- [ ] 交互: 行内编辑进入/保存/取消完整流程
- [ ] 交互: 搜索防抖 500ms（不要每次按键都请求）
- [ ] 交互: 导入文件解析 + 预览 + 进度条
- [ ] 交互: 发布角标数字实时更新
- [ ] 安全: 文件上传前端校验（格式+大小 10MB）
