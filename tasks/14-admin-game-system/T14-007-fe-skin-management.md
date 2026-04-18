# T14-007: 前端页面 — 皮肤管理

> 分类: 14-管理后台-游戏管理与系统设置 (Admin Game & System)
> 状态: 📋 待开发
> 复杂度: L(大)
> 预估文件数: 12

## 需求摘要

实现管理后台皮肤管理的完整前端页面，包括：皮肤列表页（分类/游戏/状态/赛季限定筛选、分页排序表格、操作列按钮）、新建/编辑皮肤页（三语名称和描述表单、分类和适用游戏选择、资源上传区含拖拽上传预览图/动画/资源包、定价区含知语币价格/原价、赛季限定开关联动关联赛季选择）、上架/下架/删除确认弹窗。所有 UI 遵循 Cosmic Refraction 设计系统（毛玻璃面板、Rose/Sky/Amber 主色、Lucide 图标），Tailwind CSS v4。

## 相关上下文

- 产品需求: `product/admin/04-admin-game-system/01-skin-management.md` — 皮肤列表 §一（布局/筛选/表格/操作列/确认弹窗完整 pixel-level 规格）、新建编辑 §二（表单字段/资源上传/定价/赛季限定完整规格）
- UI 规范: `grules/06-ui-design.md` — Cosmic Refraction 设计系统、.glass-card / .glass-input 组件规范
- 编码规范: `grules/05-coding-standards.md` §二 — 前端目录结构、组件规范、路由约定
- Tailwind: `grules/01-rules.md` §一.5 — Tailwind CSS v4（@import "tailwindcss" + @theme，禁止 tailwind.config.js）
- 关联任务: 前置 T14-001（皮肤管理 API）、T02-003（全局 UI 组件库，如有）→ 后续 T14-012（集成验证）

## 技术方案

### 路由配置

```typescript
// 皮肤管理路由
'/admin/skins'                    → SkinListPage        // 皮肤列表
'/admin/skins/create'             → SkinCreatePage       // 新建皮肤
'/admin/skins/:skinId/edit'       → SkinEditPage         // 编辑皮肤
```

### 页面组件结构

```
pages/admin/skins/
├── SkinListPage.tsx              // 皮肤列表页（主页面）
├── SkinCreatePage.tsx            // 新建皮肤页
├── SkinEditPage.tsx              // 编辑皮肤页
├── components/
│   ├── SkinFilters.tsx           // 筛选栏（分类/游戏/状态/赛季限定）
│   ├── SkinTable.tsx             // 列表表格（含操作列）
│   ├── SkinForm.tsx              // 新建/编辑共用表单
│   ├── SkinResourceUpload.tsx    // 资源上传区（预览图/动画/资源包）
│   ├── PublishConfirmModal.tsx   // 上架确认弹窗
│   ├── UnpublishConfirmModal.tsx // 下架确认弹窗
│   └── DeleteConfirmModal.tsx    // 删除确认弹窗
├── hooks/
│   ├── useSkins.ts              // 皮肤列表 CRUD Hook
│   └── useSkinForm.ts           // 表单状态管理 Hook
└── types.ts                     // 皮肤相关类型定义
```

### 皮肤列表页核心实现

```typescript
// SkinListPage.tsx
// - 页面标题 "皮肤管理"（H1, 32px, font-weight 700）
// - 右侧 "新建皮肤" Rose 色实心按钮（rounded-full, h-10, Lucide Plus + 文字）
// - SkinFilters: 一行排列，分类/游戏/状态/赛季限定 4 个 .glass-input 下拉 + 重置筛选
// - SkinTable: .glass-card 面板，rounded-2xl
//   - 表头: rgba(255,255,255,0.03) 背景，12px 灰色大写
//   - 行高 64px（含缩略图），hover rgba(255,255,255,0.04)
//   - 斑马纹: 偶数行 rgba(255,255,255,0.02)
//   - 分页: 每页 20 条，"共 X 条记录 · 第 X/Y 页"
```

### 列表表格列定义

```typescript
const columns = [
  { key: 'index',       label: '序号',     width: '60px'  },
  { key: 'thumbnail',   label: '缩略图',   width: '80px'  },  // 48×48 rounded-sm
  { key: 'name_zh',     label: '皮肤名称', width: '200px' },  // 中文名 + NEW 标签
  { key: 'category',    label: '分类',     width: '100px' },  // 彩色标签
  { key: 'games',       label: '适用游戏', width: '160px' },  // G1,G3 / 全部游戏
  { key: 'price',       label: '价格',     width: '100px', sortable: true },  // X 知语币
  { key: 'sales',       label: '销量',     width: '80px',  sortable: true, defaultSort: 'desc' },
  { key: 'status',      label: '状态',     width: '100px' },  // 圆点+文字+限定标签
  { key: 'actions',     label: '操作',     width: '200px' },
]
```

### 操作列逻辑

```typescript
// 操作列按钮（文字按钮，间距 16px）
// - 编辑: Sky 色 #0284c7, 始终显示, → /admin/skins/{id}/edit
// - 上架: 成功色 #22c55e, 仅 draft | unpublished, → PublishConfirmModal
// - 下架: 警告色 #f59e0b, 仅 published, → UnpublishConfirmModal
// - 删除: 错误色 #ef4444, 仅 draft, → DeleteConfirmModal
```

### 新建/编辑表单核心结构

```typescript
// SkinForm.tsx — .glass-card, max-w-[800px], mx-auto
// §2.2 基本信息区
//   - 皮肤名称 中文/英文/越南语 (.glass-input, rounded-full)
//   - 皮肤描述 中文/英文/越南语 (多行文本框, rounded-md, h-20)
//   - 分类选择 (下拉单选): 角色皮肤/背景/特效/音效
//   - 适用游戏 (多选下拉 + 全选 + 标签展示)
// §2.3 资源上传区
//   - 预览图: PNG/JPG/WebP, 512×512建议, ≤2MB, 必填
//   - 动画预览: GIF/WebP, ≤5MB, 可选
//   - 资源包: ZIP/JSON, ≤50MB, 可选
// §2.4 定价区
//   - 价格: 数字输入 + "知语币" 单位, 1-99999
//   - 原价: 可选, 必须 > 价格
// §2.5 特殊标记区
//   - 赛季限定 Switch (off=灰, on=Rose)
//   - 关联赛季 下拉 (联动显示, 仅待开始/进行中的赛季)
// 底部按钮栏: 固定底部, 毛玻璃背景, h-18, 按钮靠右
//   - 取消 (灰色描边) + 保存 (Rose 实心)
```

### 资源上传组件

```typescript
// SkinResourceUpload.tsx
// - 虚线边框上传区域 (#404040), rounded-lg (16px), h-[200px]
// - 拖拽上传 + 点击上传
// - 上传中: 进度条 (Rose 色)
// - 上传后: 缩略图 (200×200) + "重新上传" + "删除" 按钮
// - 文件校验:
//   preview_image: PNG/JPG/WebP, ≥256×256, ≤2MB
//   animation: GIF/WebP, ≤5MB
//   resource: ZIP/JSON, ≤50MB
// - 上传至 Supabase Storage, 返回 URL 存表
```

### API 对接 Hook

```typescript
// useSkins.ts
export function useSkins() {
  // GET /api/v1/admin/skins — 列表查询（分页+筛选）
  const { data, isLoading, refetch } = useQuery(...)
  // POST /api/v1/admin/skins — 创建
  const createSkin = useMutation(...)
  // PUT /api/v1/admin/skins/:id — 编辑
  const updateSkin = useMutation(...)
  // PATCH /api/v1/admin/skins/:id/publish — 上架
  const publishSkin = useMutation(...)
  // PATCH /api/v1/admin/skins/:id/unpublish — 下架
  const unpublishSkin = useMutation(...)
  // DELETE /api/v1/admin/skins/:id — 删除
  const deleteSkin = useMutation(...)
  // POST /api/v1/admin/skins/:id/upload — 上传资源
  const uploadResource = useMutation(...)
}
```

### 确认弹窗规格

```typescript
// PublishConfirmModal — "确认上架皮肤"
//   内容: 皮肤名称 + 分类 + 游戏列表 + 价格
//   提示: "上架后用户即可在游戏内购买此皮肤，请确认信息无误。"
//   按钮: 取消(灰描边) + 确认上架(Rose实心)

// UnpublishConfirmModal — "确认下架皮肤"
//   内容: "确认下架「{名称}」？下架后用户将无法在商城中看到此皮肤，已购买用户不受影响。"
//   按钮: 取消(灰描边) + 确认下架(Amber实心)

// DeleteConfirmModal — "确认删除皮肤"
//   内容: "确认删除「{名称}」？此操作不可恢复。"
//   按钮: 取消(灰描边) + 确认删除(#ef4444实心)
//   限制: 仅 draft 可删除
```

## 范围（做什么）

- 创建皮肤列表页（SkinListPage）及其子组件
- 创建新建/编辑皮肤页（SkinCreatePage / SkinEditPage）
- 创建资源上传组件（拖拽 + 校验 + 预览）
- 创建上架/下架/删除确认弹窗
- 创建 API 对接 Hooks
- 配置路由注册

## 边界（不做什么）

- 不实现皮肤管理后端 API（T14-001）
- 不实现全局 UI 组件库（如 GlassCard / GlassInput 等通用组件）
- 不实现用户端皮肤商城页面
- 不实现皮肤预览 3D 效果

## 涉及文件

- 新建: `zhiyu/frontend/src/pages/admin/skins/SkinListPage.tsx`
- 新建: `zhiyu/frontend/src/pages/admin/skins/SkinCreatePage.tsx`
- 新建: `zhiyu/frontend/src/pages/admin/skins/SkinEditPage.tsx`
- 新建: `zhiyu/frontend/src/pages/admin/skins/components/*.tsx` (7 个组件)
- 新建: `zhiyu/frontend/src/pages/admin/skins/hooks/*.ts` (2 个 Hook)
- 新建: `zhiyu/frontend/src/pages/admin/skins/types.ts`
- 修改: `zhiyu/frontend/src/router/admin.tsx` — 注册皮肤管理路由

## 依赖

- 前置: T14-001（皮肤管理 API）、T02-003（全局 UI 组件库，如有）
- 后续: T14-012（集成验证）

## 验收标准（GIVEN-WHEN-THEN）

1. **GIVEN** 管理员（游戏运营）已登录  
   **WHEN** 访问 `/admin/skins`  
   **THEN** 显示皮肤列表页，包含筛选栏（4 个下拉 + 重置）+ 表格（9 列 + 分页 20 条/页）

2. **GIVEN** 皮肤列表已加载  
   **WHEN** 切换分类筛选为"角色皮肤" + 状态筛选为"已上架"  
   **THEN** 表格仅显示匹配条目，重置筛选后恢复全部

3. **GIVEN** 皮肤列表已加载  
   **WHEN** 查看表格列展示  
   **THEN** 缩略图 48×48 rounded-sm、分类彩色标签（Rose/Sky/Amber/灰）、价格含删除线原价、销量 0 显示"—"、状态含圆点+限定标签

4. **GIVEN** 某皮肤状态为"草稿"  
   **WHEN** 查看操作列  
   **THEN** 显示"编辑"(Sky) + "上架"(绿) + "删除"(红) 三个按钮，不显示"下架"

5. **GIVEN** 管理员点击"新建皮肤"按钮  
   **WHEN** 进入 `/admin/skins/create`  
   **THEN** 显示完整表单：基本信息（6 个文本框 + 分类 + 游戏多选）、资源上传（3 区域）、定价（2 输入）、赛季限定开关

6. **GIVEN** 管理员正在填写皮肤表单  
   **WHEN** 上传预览图（拖拽 PNG 文件 1.5MB）  
   **THEN** 显示上传进度 → 完成后显示缩略图预览 + "重新上传"/"删除" 按钮

7. **GIVEN** 管理员上传 3MB 预览图  
   **WHEN** 触发上传  
   **THEN** 前端拦截，显示错误"文件大小不能超过 2MB"，不发起网络请求

8. **GIVEN** 管理员开启"赛季限定"开关  
   **WHEN** 开关变为 Rose 色  
   **THEN** 显示"关联赛季"下拉（标红星），选项来自待开始/进行中的赛季

9. **GIVEN** 管理员填写完必填字段并保存  
   **WHEN** 点击"保存"按钮  
   **THEN** 表单校验通过 → 调用 API → Toast"保存成功"→ 跳转回列表

10. **GIVEN** 皮肤状态为"草稿"  
    **WHEN** 点击"上架"→ 弹窗显示皮肤信息 → 点击"确认上架"  
    **THEN** 调用上架 API → Toast"皮肤已上架"→ 列表刷新，状态变为"已上架"

11. **GIVEN** 编辑页有未保存修改  
    **WHEN** 点击返回箭头  
    **THEN** 弹出离开确认弹窗，确认后丢弃修改并返回列表

12. **GIVEN** 页面渲染完成  
    **WHEN** 检查 UI 规格  
    **THEN** 所有组件符合 Cosmic Refraction 设计系统：.glass-card 毛玻璃面板、Rose/Sky/Amber 配色、Lucide 图标、无 Purple 色

## Docker 自动化测试（强制）

> ⚠️ 绝对禁止在宿主机环境测试，必须通过 Docker 容器验证 ⚠️

### 测试步骤

1. `docker compose up -d --build` — 构建并启动所有服务
2. `docker compose ps` — 确认所有容器 Running
3. 使用 Browser MCP 打开皮肤列表页
4. 测试筛选栏功能（4 个筛选项 + 重置）
5. 测试表格展示（缩略图/标签/价格/状态/操作列）
6. 测试新建皮肤表单（所有字段 + 资源上传 + 校验）
7. 测试编辑皮肤（回填数据 + 修改保存）
8. 测试上架/下架/删除确认弹窗流程
9. 测试赛季限定联动
10. 测试离开未保存确认

### 测试通过标准

- [ ] TypeScript 零编译错误
- [ ] Docker 构建成功，前端页面可正常访问
- [ ] 列表页筛选/排序/分页正常
- [ ] 表格列样式符合 PRD 规格（宽度/颜色/字体/标签）
- [ ] 新建/编辑表单字段完整，校验正确
- [ ] 资源上传（拖拽+点击）、预览、删除正常
- [ ] 文件校验生效（格式/大小/尺寸）
- [ ] 确认弹窗内容和操作正确
- [ ] 赛季限定开关联动正常
- [ ] UI 风格符合 Cosmic Refraction（毛玻璃/配色/图标）
- [ ] 无 Tailwind 编译警告
- [ ] 控制台无 Error 级别日志

### 测试不通过处理

- 发现问题 → 立即修复 → 重新 Docker 构建 → 重新验证全部
- 同一问题 3 次修复失败 → 标记阻塞，停止任务

## 执行结果报告

结果文件路径: `/tasks/result/14-admin-game-system/T14-007-fe-skin-management.md`

## 自检重点

- [ ] UI 规范: 全部使用 Tailwind CSS v4（@import "tailwindcss"），无 tailwind.config.js
- [ ] UI 规范: 颜色仅 Rose/Sky/Amber，绝对无 Purple
- [ ] UI 规范: .glass-card / .glass-input / rounded-2xl / rounded-full 一致性
- [ ] 安全: 文件上传前端校验（格式+大小），上传到 Supabase Storage
- [ ] 无障碍: 表单字段有 label + aria 属性
- [ ] 响应式: 最小支持 1280px 宽度（管理后台）
- [ ] 状态管理: 使用 React Query（TanStack Query）管理服务端状态
