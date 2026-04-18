# T14-005: 后端 API — 多语言管理

> 分类: 14-管理后台-游戏管理与系统设置 (Admin Game & System)
> 状态: 📋 待开发
> 复杂度: M(中等)
> 预估文件数: 8

## 需求摘要

实现管理后台多语言文案管理（i18n）的完整后端 API，包括：翻译文案 CRUD（键名、中文基准文案、英文翻译、越南语翻译）、按模块/翻译状态/关键词搜索与筛选、行内快速编辑、批量导入（Excel/CSV 解析）、批量导出（生成 Excel/CSV）、缺失翻译检测与高亮、翻译发布机制（版本号自增 + 同步到 CDN 语言包）、发布历史记录。权限要求：超级管理员 + 内容运营。

## 相关上下文

- 产品需求: `product/admin/04-admin-game-system/05-i18n-management.md` — 语言包列表、搜索/筛选、行内编辑、翻译编辑弹窗、导入/导出、发布机制、发布历史完整 PRD
- 产品需求: `product/admin/04-admin-game-system/00-index.md` §二 — 功能清单（#14 多语言管理, #17 多语言发布历史）
- 产品需求: `product/admin/04-admin-game-system/07-system-logs.md` §二.4 — 多语言管理数据流
- API 设计: `grules/04-api-design.md` — RESTful 统一响应格式、批量操作规范
- 编码规范: `grules/05-coding-standards.md` §三 — 后端分层
- 关联任务: 前置 T02-006（i18n 基础设施，如有）、T11-003（管理员权限中间件）→ 后续 T14-010（前端多语言管理页）

## 技术方案

### API 端点设计

```
GET    /api/v1/admin/i18n                          — 翻译文案列表（分页+搜索+筛选）
GET    /api/v1/admin/i18n/:key                     — 单条翻译详情
PUT    /api/v1/admin/i18n/:key                     — 编辑翻译（单条）
PATCH  /api/v1/admin/i18n/:key/quick-edit          — 行内快速编辑（仅更新指定语言）
POST   /api/v1/admin/i18n/import                   — 批量导入翻译
POST   /api/v1/admin/i18n/export                   — 批量导出翻译
POST   /api/v1/admin/i18n/publish                  — 发布翻译（同步到 CDN）
GET    /api/v1/admin/i18n/publish/history           — 发布历史列表
GET    /api/v1/admin/i18n/publish/history/:version  — 发布版本详情
GET    /api/v1/admin/i18n/stats                     — 翻译统计（各语言完成率、缺失数）
```

### 翻译数据模型

```typescript
interface I18nEntry {
  key: string                     // 键名，如 'home.welcome_title'
  module: string                  // 模块，如 'global', 'discover', 'course', 'game'
  text_zh: string                 // 中文基准文案
  text_en?: string                // 英文翻译
  text_vi?: string                // 越南语翻译
  status: I18nStatus              // 翻译状态
  updated_at: string
  updated_by?: string             // 最后修改人
}

type I18nStatus = 'translated' | 'pending' | 'modified_unpublished'

interface I18nPublishHistory {
  version: number                 // 版本号（自增整数）
  published_at: string
  published_by: string            // 操作人 admin_id
  change_count: number            // 变更条数
  changes: Array<{
    key: string
    field: 'text_en' | 'text_vi'
    old_value: string
    new_value: string
  }>
}

interface I18nStats {
  total_keys: number
  en_translated: number
  en_pending: number
  vi_translated: number
  vi_pending: number
  modified_unpublished: number
}
```

### 筛选参数 Zod Schema

```typescript
const I18nListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  page_size: z.coerce.number().int().min(1).max(100).default(50),
  sort_by: z.enum(['key', 'updated_at']).default('key'),
  sort_order: z.enum(['asc', 'desc']).default('asc'),
  module: z.enum(['global', 'discover', 'course', 'game', 'profile', 'payment', 'error']).optional(),
  status: z.enum(['translated', 'pending', 'modified_unpublished']).optional(),
  keyword: z.string().max(100).optional(),
  language: z.enum(['zh', 'en', 'vi']).default('zh'),
})
```

### 导入/导出处理

```typescript
// 导入：POST /api/v1/admin/i18n/import
// Content-Type: multipart/form-data
// 字段: file (xlsx/csv), conflict_strategy ('overwrite' | 'skip')

// 导入流程：
// 1. 解析文件（xlsx 用 xlsx 库，csv 用 csv-parse）
// 2. 校验格式（必须包含 key, text_zh, text_en, text_vi 列）
// 3. 匹配键名（不存在的键名跳过）
// 4. 按策略处理冲突（覆盖/跳过）
// 5. 批量更新数据库
// 6. 返回导入结果统计

interface ImportResult {
  total: number              // 文件中总条数
  imported: number           // 成功导入条数
  skipped: number            // 跳过条数（键名不存在 / 冲突跳过）
  overwritten: number        // 覆盖条数
  errors: string[]           // 错误信息列表
}

// 导出：POST /api/v1/admin/i18n/export
// Body: { scope: 'all' | 'pending' | 'filtered', format: 'xlsx' | 'csv' }
// 返回：文件流（Content-Disposition: attachment）
```

### 发布机制

```typescript
// POST /api/v1/admin/i18n/publish
// 发布流程：
// 1. 获取所有 status = 'modified_unpublished' 的条目
// 2. 版本号自增（SELECT MAX(version) + 1）
// 3. 将修改同步到正式表 i18n_published
// 4. 生成语言包 JSON（按语言分文件：zh.json, en.json, vi.json）
// 5. 上传到 Supabase Storage CDN
// 6. 更新所有已发布条目状态为 'translated'
// 7. 写入 i18n_history 发布记录
// 8. 写入 admin_logs

// 并发控制：发布操作加锁（同一时间仅一个发布操作）
```

### Repository 层

```typescript
export class I18nRepository {
  async findAll(params: I18nListQuery): Promise<{ items: I18nEntry[]; total: number }>
  async findByKey(key: string): Promise<I18nEntry | null>
  async update(key: string, data: I18nUpdate): Promise<I18nEntry>
  async quickEdit(key: string, language: string, text: string): Promise<void>
  async batchUpdate(entries: I18nUpdate[]): Promise<number>
  async getModifiedUnpublished(): Promise<I18nEntry[]>
  async markAsPublished(keys: string[]): Promise<void>
  async getStats(): Promise<I18nStats>
  async getPublishHistory(page: number, pageSize: number): Promise<{ items: I18nPublishHistory[]; total: number }>
  async getPublishVersion(version: number): Promise<I18nPublishHistory | null>
  async createPublishRecord(record: I18nPublishHistory): Promise<void>
}
```

### Service 层

```typescript
export class I18nService {
  async listEntries(query: I18nListQuery): Promise<PageData<I18nEntry>>
  async getEntry(key: string): Promise<I18nEntry>
  async updateEntry(key: string, data: I18nUpdate, adminId: string): Promise<I18nEntry>
  async quickEdit(key: string, language: string, text: string, adminId: string): Promise<void>
  async importTranslations(file: Buffer, format: string, strategy: string): Promise<ImportResult>
  async exportTranslations(scope: string, format: string, filters?: I18nListQuery): Promise<Buffer>
  async publish(adminId: string): Promise<{ version: number; change_count: number }>
  async getStats(): Promise<I18nStats>
  async getPublishHistory(page: number, pageSize: number): Promise<PageData<I18nPublishHistory>>
  async getPublishVersion(version: number): Promise<I18nPublishHistory>
}
```

### 业务规则

- 键名不可创建/删除（由开发人员通过代码管理），管理端只编辑翻译内容
- 编辑翻译后状态变为 modified_unpublished
- 发布后所有已修改条目状态恢复为 translated
- 发布操作加锁，防止并发发布导致版本冲突
- 导入时不存在的键名自动跳过（不新增）
- 导出频率限制：同一管理员每小时最多 10 次
- 导入文件最大 10MB
- 导入条数上限 5,000 条

## 范围（做什么）

- 创建 `backend/src/repositories/i18n.repository.ts`
- 创建 `backend/src/services/i18n.service.ts`
- 创建 `backend/src/routers/v1/admin/i18n.router.ts`
- 创建 `backend/src/models/i18n.ts`
- 修改 `backend/src/routers/v1/admin/index.ts` — 挂载 i18n 路由

## 边界（不做什么）

- 不实现前端多语言管理页面（T14-010）
- 不实现应用端语言包加载机制（属于应用端任务）
- 不实现键名管理（创建/删除/重命名）— 由开发流程管理
- 不实现翻译记忆（Translation Memory）或机器翻译集成

## 涉及文件

- 新建: `zhiyu/backend/src/repositories/i18n.repository.ts`
- 新建: `zhiyu/backend/src/services/i18n.service.ts`
- 新建: `zhiyu/backend/src/routers/v1/admin/i18n.router.ts`
- 新建: `zhiyu/backend/src/models/i18n.ts`
- 修改: `zhiyu/backend/src/routers/v1/admin/index.ts`
- 修改: `zhiyu/backend/package.json` — 添加 xlsx / csv-parse 依赖

## 依赖

- 前置: T02-006（i18n 基础数据表，如有）、T11-003（adminAuthMiddleware）
- 后续: T14-010（前端多语言管理页）、T14-012（集成验证）

## 验收标准（GIVEN-WHEN-THEN）

1. **GIVEN** 管理员已登录（内容运营角色）  
   **WHEN** GET `/api/v1/admin/i18n?page=1&page_size=50&module=game&status=pending`  
   **THEN** 返回 200，仅包含游戏模块下待翻译的文案条目

2. **GIVEN** 管理员已登录  
   **WHEN** GET `/api/v1/admin/i18n?keyword=welcome`  
   **THEN** 返回 200，匹配键名或文案内容包含"welcome"的条目

3. **GIVEN** 管理员已登录  
   **WHEN** PUT `/api/v1/admin/i18n/home.welcome_title` body: { text_en: "Welcome", text_vi: "Chào mừng" }  
   **THEN** 返回 200，翻译更新成功，状态变为 modified_unpublished

4. **GIVEN** 管理员已登录  
   **WHEN** PATCH `/api/v1/admin/i18n/home.welcome_title/quick-edit` body: { language: "en", text: "Hello" }  
   **THEN** 返回 200，仅英文翻译更新，状态变为 modified_unpublished

5. **GIVEN** 有 12 条 modified_unpublished 状态的翻译  
   **WHEN** POST `/api/v1/admin/i18n/publish`  
   **THEN** 返回 200，version 自增，change_count = 12，所有条目状态恢复为 translated

6. **GIVEN** 管理员已登录  
   **WHEN** POST `/api/v1/admin/i18n/import` 上传包含 100 条翻译的 xlsx 文件（覆盖策略）  
   **THEN** 返回 200，包含 imported、skipped、overwritten 统计

7. **GIVEN** 管理员已登录  
   **WHEN** POST `/api/v1/admin/i18n/export` body: { scope: "pending", format: "csv" }  
   **THEN** 返回文件流，Content-Disposition 含文件名，CSV 包含所有待翻译条目

8. **GIVEN** 管理员已登录  
   **WHEN** GET `/api/v1/admin/i18n/stats`  
   **THEN** 返回 200，包含总键数、各语言已翻译数/待翻译数、未发布修改数

9. **GIVEN** 管理员已登录  
   **WHEN** GET `/api/v1/admin/i18n/publish/history?page=1&page_size=20`  
   **THEN** 返回 200，包含发布历史列表（版本号、发布时间、操作人、变更数）

10. **GIVEN** 发布操作正在执行中  
    **WHEN** 另一管理员同时尝试发布  
    **THEN** 返回 409，提示"有正在进行的发布操作，请稍后重试"

11. **GIVEN** 导入文件格式错误（非 xlsx/csv）  
    **WHEN** POST `/api/v1/admin/i18n/import`  
    **THEN** 返回 400，提示"仅支持 .xlsx 和 .csv 格式"

12. **GIVEN** 非管理员角色用户  
    **WHEN** 访问任何 `/api/v1/admin/i18n` 端点  
    **THEN** 返回 403

## Docker 自动化测试（强制）

> ⚠️ 绝对禁止在宿主机环境测试，必须通过 Docker 容器验证 ⚠️

### 测试步骤

1. `docker compose up -d --build` — 构建并启动所有服务
2. `docker compose ps` — 确认所有容器 Running
3. 登录获取管理员 Token
4. 测试翻译列表查询（搜索+模块筛选+状态筛选）
5. 测试编辑翻译（全量+快速编辑）
6. 测试翻译状态流转（modified_unpublished）
7. 测试发布机制（版本号自增+状态恢复）
8. 测试导入翻译（覆盖/跳过策略）
9. 测试导出翻译（xlsx/csv）
10. 测试翻译统计
11. 测试发布并发锁
12. 测试权限拦截

### 测试通过标准

- [ ] TypeScript 零编译错误
- [ ] Docker 构建成功，所有容器 Running
- [ ] 翻译 CRUD + 搜索/筛选正常
- [ ] 导入解析正确，冲突策略生效
- [ ] 导出文件格式正确
- [ ] 发布版本号正确自增
- [ ] 发布并发锁生效
- [ ] 翻译统计数据准确
- [ ] 所有写操作记录审计日志
- [ ] 控制台无 Error 级别日志

### 测试不通过处理

- 发现问题 → 立即修复 → 重新 Docker 构建 → 重新验证全部
- 同一问题 3 次修复失败 → 标记阻塞，停止任务

## 执行结果报告

结果文件路径: `/tasks/result/14-admin-game-system/T14-005-api-i18n-management.md`

## 自检重点

- [ ] 安全：导入文件大小限制（10MB）+ 条数限制（5,000）
- [ ] 安全：导出频率限制（每小时 10 次）
- [ ] 性能：翻译列表搜索有索引（key, module, status）
- [ ] 性能：导入 5,000 条 < 10s（PRD 要求）
- [ ] 性能：发布同步到 CDN < 10s
- [ ] 类型同步：i18n.ts 类型与数据库 Schema 一致
- [ ] 审计日志：编辑/发布/导入操作均记录
- [ ] API 规范：响应格式符合 grules/04-api-design.md
