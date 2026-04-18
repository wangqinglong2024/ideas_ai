# T14-001: 后端 API — 皮肤管理

> 分类: 14-管理后台-游戏管理与系统设置 (Admin Game & System)
> 状态: 📋 待开发
> 复杂度: M(中等)
> 预估文件数: 8

## 需求摘要

实现管理后台皮肤商城管理的完整后端 API，包括：皮肤 CRUD（三语名称、描述、分类、适用游戏）、皮肤资源文件上传（预览图/动画/资源包，存储到 Supabase Storage）、定价管理（知语币单位，支持原价/折扣价）、上架/下架状态流转、赛季限定标记与关联赛季、皮肤列表筛选（分类/游戏/状态/赛季限定）与分页排序。权限要求：游戏运营 + 超级管理员。

## 相关上下文

- 产品需求: `product/admin/04-admin-game-system/01-skin-management.md` — 皮肤列表、新建/编辑、上架/下架、定价完整 PRD
- 产品需求: `product/admin/04-admin-game-system/00-index.md` §二 — 功能清单总览（#1~#3 皮肤管理, #11 皮肤销售数据）
- 产品需求: `product/admin/04-admin-game-system/07-system-logs.md` §二.1 — 皮肤管理数据流
- 架构白皮书: `grules/01-rules.md` §二 — Supabase Storage 直传方案
- API 设计: `grules/04-api-design.md` — RESTful 统一响应格式、文件上传接口规范
- 编码规范: `grules/05-coding-standards.md` §三 — 后端路由/服务/仓库分层、§六 — 安全规范
- 游戏总览: `game/00-index.md` — 12 款游戏列表（G1~G12）
- 产品总纲: `product/00-product-overview.md` §五.4 — 游戏皮肤/特效 = 游戏侧变现
- 关联任务: 前置 T06-003（skins 表）、T11-003（管理员权限中间件）→ 后续 T14-007（前端皮肤管理页）

## 技术方案

### API 端点设计

```
GET    /api/v1/admin/skins                  — 皮肤列表（分页+筛选+排序）
GET    /api/v1/admin/skins/:id              — 皮肤详情
POST   /api/v1/admin/skins                  — 新建皮肤
PUT    /api/v1/admin/skins/:id              — 编辑皮肤（全量更新）
DELETE /api/v1/admin/skins/:id              — 删除皮肤（仅草稿状态软删除）
POST   /api/v1/admin/skins/:id/publish      — 上架皮肤
POST   /api/v1/admin/skins/:id/unpublish    — 下架皮肤
POST   /api/v1/admin/skins/upload           — 皮肤资源文件上传
```

### 皮肤数据模型（与 T06-003 skins 表对齐）

```typescript
interface Skin {
  id: string                    // UUID
  name_zh: string               // 中文名称
  name_en: string               // 英文名称
  name_vi: string               // 越南语名称
  description_zh?: string       // 中文描述
  description_en?: string       // 英文描述
  description_vi?: string       // 越南语描述
  category: SkinCategory        // 分类: character | background | effect | sound
  applicable_games: string[]    // 适用游戏 ID 数组（G1~G12 或 'all'）
  preview_image_url: string     // 预览图 URL（Supabase Storage）
  animation_url?: string        // 动画预览 URL
  resource_url?: string         // 资源包 URL
  price: number                 // 价格（知语币）
  original_price?: number       // 原价（可选，用于折扣展示）
  status: SkinStatus            // 状态: draft | published | unpublished
  is_seasonal: boolean          // 是否赛季限定
  season_id?: string            // 关联赛季 ID
  sales_count: number           // 销量（只读）
  created_at: string
  updated_at: string
  deleted_at?: string           // 软删除标记
}

type SkinCategory = 'character' | 'background' | 'effect' | 'sound'
type SkinStatus = 'draft' | 'published' | 'unpublished'
```

### 筛选参数 Zod Schema

```typescript
const SkinListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  page_size: z.coerce.number().int().min(1).max(100).default(20),
  sort_by: z.enum(['created_at', 'price', 'sales_count']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
  category: z.enum(['character', 'background', 'effect', 'sound']).optional(),
  game_id: z.string().optional(),
  status: z.enum(['draft', 'published', 'unpublished']).optional(),
  is_seasonal: z.enum(['true', 'false']).optional(),
  keyword: z.string().max(50).optional(),
})
```

### 创建/编辑 Zod Schema

```typescript
const SkinCreateSchema = z.object({
  name_zh: z.string().min(1).max(30).describe('中文名称'),
  name_en: z.string().min(1).max(50).describe('英文名称'),
  name_vi: z.string().min(1).max(50).describe('越南语名称'),
  description_zh: z.string().max(200).optional().describe('中文描述'),
  description_en: z.string().max(500).optional().describe('英文描述'),
  description_vi: z.string().max(500).optional().describe('越南语描述'),
  category: z.enum(['character', 'background', 'effect', 'sound']).describe('皮肤分类'),
  applicable_games: z.array(z.string()).min(1).describe('适用游戏列表'),
  preview_image_url: z.string().url().describe('预览图 URL'),
  animation_url: z.string().url().optional().describe('动画预览 URL'),
  resource_url: z.string().url().optional().describe('资源包 URL'),
  price: z.number().int().min(1).max(99999).describe('价格（知语币）'),
  original_price: z.number().int().min(1).max(99999).optional().describe('原价'),
  is_seasonal: z.boolean().default(false).describe('是否赛季限定'),
  season_id: z.string().uuid().optional().describe('关联赛季 ID'),
})
```

### 文件上传处理

```typescript
// POST /api/v1/admin/skins/upload
// Content-Type: multipart/form-data
// 字段: file（单文件）, type（preview_image | animation | resource）

// MIME 白名单
const UPLOAD_CONFIG = {
  preview_image: { types: ['image/png', 'image/jpeg', 'image/webp'], maxSize: 2 * 1024 * 1024 },
  animation: { types: ['image/gif', 'image/webp'], maxSize: 5 * 1024 * 1024 },
  resource: { types: ['application/zip', 'application/json'], maxSize: 50 * 1024 * 1024 },
}

// 存储路径: skins/{type}/{timestamp}-{uuid}.{ext}
// 返回: { url: string } — Supabase Storage 公开 URL
```

### Repository 层

```typescript
export class SkinRepository {
  async findAll(params: SkinListQuery): Promise<{ items: Skin[]; total: number }>
  async findById(id: string): Promise<Skin | null>
  async create(data: SkinCreate): Promise<Skin>
  async update(id: string, data: SkinUpdate): Promise<Skin>
  async softDelete(id: string): Promise<void>
  async updateStatus(id: string, status: SkinStatus): Promise<void>
}
```

### Service 层

```typescript
export class SkinService {
  async listSkins(query: SkinListQuery): Promise<PageData<Skin>>
  async getSkinById(id: string): Promise<Skin>
  async createSkin(data: SkinCreate): Promise<Skin>
  async updateSkin(id: string, data: SkinUpdate): Promise<Skin>
  async deleteSkin(id: string): Promise<void>      // 仅草稿可删
  async publishSkin(id: string): Promise<void>      // 草稿/已下架 → 已上架
  async unpublishSkin(id: string): Promise<void>    // 已上架 → 已下架
  async uploadResource(file: Express.Multer.File, type: string): Promise<string>
}
```

### 状态流转规则

```
草稿 → 已上架（上架）
草稿 → 删除（软删除）
已上架 → 已下架（下架）
已下架 → 已上架（重新上架）
// 已上架 / 已下架的皮肤不可删除（MVP 阶段）
```

### 业务规则

- 上架前校验：预览图必须已上传、价格 > 0、三语名称均已填写
- 原价必须大于实际价格（如已填写）
- 赛季限定皮肤开启时 season_id 必填，且赛季状态为"待开始"或"进行中"
- 所有写操作写入系统操作日志（admin_logs）

## 范围（做什么）

- 创建 `backend/src/repositories/skin.repository.ts` — 皮肤数据访问层
- 创建 `backend/src/services/skin.service.ts` — 皮肤业务逻辑层
- 创建 `backend/src/routers/v1/admin/skins.router.ts` — 皮肤管理路由
- 创建 `backend/src/models/skin.ts` — 皮肤相关类型和 Zod Schema
- 修改 `backend/src/routers/v1/admin/index.ts` — 挂载 skins 路由
- 配置 Supabase Storage Bucket `skins`（RLS：仅管理员可上传）

## 边界（不做什么）

- 不实现前端皮肤管理页面（T14-007）
- 不实现皮肤销售数据统计查询（P1 第二迭代）
- 不实现用户端皮肤商城 API（属于应用端任务）
- 不实现皮肤购买/消耗知语币逻辑（属于应用端任务）

## 涉及文件

- 新建: `zhiyu/backend/src/repositories/skin.repository.ts`
- 新建: `zhiyu/backend/src/services/skin.service.ts`
- 新建: `zhiyu/backend/src/routers/v1/admin/skins.router.ts`
- 新建: `zhiyu/backend/src/models/skin.ts`
- 修改: `zhiyu/backend/src/routers/v1/admin/index.ts`
- 新建: `supabase/migrations/xxx-create-skins-bucket.sql`（如需）

## 依赖

- 前置: T06-003（skins 表 + 相关 ENUM）、T11-003（adminAuthMiddleware + requireRole 中间件）
- 后续: T14-007（前端皮肤管理页）、T14-012（集成验证）

## 验收标准（GIVEN-WHEN-THEN）

1. **GIVEN** 管理员已登录且角色为游戏运营  
   **WHEN** GET `/api/v1/admin/skins?page=1&page_size=20`  
   **THEN** 返回 200，data 包含 items 数组、total、page、page_size、has_next

2. **GIVEN** 管理员已登录  
   **WHEN** GET `/api/v1/admin/skins?category=character&status=published&sort_by=sales_count&sort_order=desc`  
   **THEN** 返回 200，items 中仅包含分类为 character 且状态为 published 的皮肤，按销量降序排列

3. **GIVEN** 管理员已登录  
   **WHEN** POST `/api/v1/admin/skins` 发送完整的皮肤信息（三语名称、分类、适用游戏、预览图 URL、价格）  
   **THEN** 返回 201，皮肤创建成功，状态为 draft

4. **GIVEN** 管理员已登录  
   **WHEN** POST `/api/v1/admin/skins` 缺少 name_zh 或 price  
   **THEN** 返回 400，message 明确提示缺失字段

5. **GIVEN** 一个状态为 draft 的皮肤  
   **WHEN** POST `/api/v1/admin/skins/:id/publish`  
   **THEN** 返回 200，皮肤状态变为 published，操作写入 admin_logs

6. **GIVEN** 一个状态为 published 的皮肤  
   **WHEN** POST `/api/v1/admin/skins/:id/unpublish`  
   **THEN** 返回 200，皮肤状态变为 unpublished

7. **GIVEN** 一个状态为 draft 的皮肤  
   **WHEN** DELETE `/api/v1/admin/skins/:id`  
   **THEN** 返回 204，皮肤软删除成功

8. **GIVEN** 一个状态为 published 的皮肤  
   **WHEN** DELETE `/api/v1/admin/skins/:id`  
   **THEN** 返回 400，提示"已上架皮肤不可删除"

9. **GIVEN** 管理员上传一个 PNG 预览图（< 2MB）  
   **WHEN** POST `/api/v1/admin/skins/upload` type=preview_image  
   **THEN** 返回 201，包含 Supabase Storage 公开 URL

10. **GIVEN** 管理员上传一个 50MB+ 的 ZIP 文件  
    **WHEN** POST `/api/v1/admin/skins/upload` type=resource  
    **THEN** 返回 400，提示"文件大小不能超过 50MB"

11. **GIVEN** 赛季限定开启但未传 season_id  
    **WHEN** POST `/api/v1/admin/skins` is_seasonal=true, season_id=undefined  
    **THEN** 返回 400，提示"赛季限定皮肤必须关联赛季"

12. **GIVEN** 非管理员角色用户（普通用户 Token）  
    **WHEN** 访问任何 `/api/v1/admin/skins` 端点  
    **THEN** 返回 403，提示"无权操作该资源"

## Docker 自动化测试（强制）

> ⚠️ 绝对禁止在宿主机环境测试，必须通过 Docker 容器验证 ⚠️

### 测试步骤

1. `docker compose up -d --build` — 构建并启动所有服务
2. `docker compose ps` — 确认所有容器 Running
3. `docker compose logs --tail=30 backend` — 后端无报错
4. 登录获取管理员 Token：`curl -X POST http://localhost:8100/api/v1/admin/auth/login -H 'Content-Type: application/json' -d '{"email":"admin@ideas.top","password":"Zhiyu@2026"}'`
5. 测试创建皮肤 API
6. 测试皮肤列表（筛选+分页+排序）
7. 测试皮肤上架/下架状态流转
8. 测试文件上传（合法/超限/非法格式）
9. 测试草稿状态皮肤删除
10. 测试已上架皮肤不可删除
11. 测试赛季限定校验
12. 测试权限拦截（非管理员 403）

### 测试通过标准

- [ ] TypeScript 零编译错误
- [ ] Docker 构建成功，所有容器 Running
- [ ] 皮肤 CRUD API 全部正常工作
- [ ] 筛选（分类/游戏/状态/赛季限定）组合正确
- [ ] 状态流转严格按规则执行
- [ ] 文件上传 MIME 校验和大小限制生效
- [ ] 赛季限定逻辑校验正确
- [ ] 权限拦截正确（403）
- [ ] 所有写操作写入 admin_logs
- [ ] 控制台无 Error 级别日志

### 测试不通过处理

- 发现问题 → 立即修复 → 重新 Docker 构建 → 重新验证全部
- 同一问题 3 次修复失败 → 标记阻塞，停止任务

## 执行结果报告

结果文件路径: `/tasks/result/14-admin-game-system/T14-001-api-skin-management.md`

## 自检重点

- [ ] 安全：文件上传 MIME 双重校验 + 大小限制 + 文件名消毒
- [ ] 安全：Supabase Storage Bucket RLS 禁止匿名写入
- [ ] 性能：列表查询有索引（category, status, created_at）
- [ ] 类型同步：skin.ts 类型与数据库 Schema 一致
- [ ] 审计日志：上架/下架/创建/编辑/删除均记录到 admin_logs
- [ ] API 规范：响应格式符合 grules/04-api-design.md
