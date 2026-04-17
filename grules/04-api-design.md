# API 设计规约 (API Design Standards)

> **版本**: v3.0 | **最后更新**: 2026-04-17
>
> **适用范围**：所有 Express/TypeScript/Node.js 后端项目的 RESTful API 设计。
> **核心原则**：一致性 > 灵活性。所有 API 必须"长得一样"，前端无需猜测。
> **关联文件**：
> - 后端编码实现 → `coding-standards.md` §三
> - 任务执行协议 → `task-workflow.md`（API 任务的上下文加载 + 验证策略）
> - 安全规范 → `coding-standards.md` §六（签名验证、幂等、CORS）

---

## 一、URL 设计规范

### 1. 基本格式
```
https://{domain}/api/v{version}/{resource}
```

### 2. 规则清单
| 规则 | 正确 ✅ | 错误 ❌ |
|------|---------|---------|
| 资源用复数名词 | `/api/v1/users` | `/api/v1/user`, `/api/v1/getUser` |
| kebab-case | `/api/v1/chat-messages` | `/api/v1/chatMessages` |
| 不暴露动词 | `POST /api/v1/orders` | `/api/v1/createOrder` |
| 嵌套不超过 2 层 | `/api/v1/users/{id}/orders` | `/api/v1/users/{id}/orders/{oid}/items/{iid}` |
| 查询参数 snake_case | `?page_size=20&sort_by=created_at` | `?pageSize=20` |

### 3. 特殊操作用子路径
当动作无法映射到 CRUD 时，使用动词子路径：
```
POST /api/v1/users/{id}/activate     # 激活用户
POST /api/v1/orders/{id}/cancel      # 取消订单
POST /api/v1/auth/refresh-token      # 刷新 Token
```

---

## 二、HTTP 方法语义

| 方法 | 用途 | 幂等 | 请求体 | 典型响应码 |
|------|------|------|--------|-----------|
| `GET` | 查询（单个/列表） | ✅ | 无 | 200 |
| `POST` | 创建资源 | ❌ | 有 | 201 |
| `PUT` | 全量更新 | ✅ | 有 | 200 |
| `PATCH` | 局部更新 | ✅ | 有 | 200 |
| `DELETE` | 删除资源 | ✅ | 无 | 204 |

---

## 三、统一响应格式

### 成功响应
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "uuid-xxx",
    "username": "zhangsan"
  }
}
```

### 列表响应（带分页）
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "items": [ ... ],
    "total": 156,
    "page": 1,
    "page_size": 20,
    "has_next": true
  }
}
```

### 错误响应
```json
{
  "code": 40101,
  "message": "登录已过期，请重新登录",
  "data": null
}
```

### 业务错误码规范
```
格式：{HTTP状态码}{2位序号}

200xx — 成功
400xx — 请求参数错误
  40001 — 参数缺失
  40002 — 参数格式错误
  40003 — 参数值越界
401xx — 认证失败
  40101 — Token 过期
  40102 — Token 无效
  40103 — 未提供 Token
403xx — 权限不足
  40301 — 无权操作该资源
  40302 — 账户已被封禁
404xx — 资源不存在
  40401 — 用户不存在
  40402 — 记录不存在
409xx — 资源冲突
  40901 — 用户名已被占用
  40902 — 邮箱已注册
429xx — 请求过于频繁
500xx — 服务器内部错误（不向前端暴露具体原因）
```

---

## 四、后端实现模板

### 统一响应封装
```typescript
// src/core/response.ts

export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T | null
}

export interface PageData<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasNext: boolean
}

export function ok<T>(data?: T, message = 'success'): ApiResponse<T> {
  return { code: 0, message, data: data ?? null }
}

export function error(code: number, message: string): ApiResponse<null> {
  return { code, message, data: null }
}
```

### 自定义业务异常
```typescript
// src/core/exceptions.ts

export class BizError extends Error {
  /** 业务异常，会被全局错误处理中间件捕获并转为标准 JSON 响应 */
  constructor(
    public readonly code: number,
    message: string,
    public readonly statusCode: number = 400,
  ) {
    super(message)
    this.name = 'BizError'
  }
}

// 使用示例
throw new BizError(40901, '用户名已被占用')
throw new BizError(40301, '无权操作该资源', 403)
```

### 全局错误处理中间件
```typescript
// 在 main.ts 中注册
import { Request, Response, NextFunction } from 'express'
import { BizError } from '@/core/exceptions'
import { logger } from '@/core/logger'

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof BizError) {
    return res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
      data: null,
    })
  }

  // 生产环境不暴露错误详情
  logger.error(`未处理异常: ${err.message}`, { stack: err.stack })
  res.status(500).json({
    code: 50000,
    message: '服务器内部错误',
    data: null,
  })
}
```

---

## 五、分页查询规范

### 请求参数
```
GET /api/v1/users?page=1&page_size=20&sort_by=created_at&sort_order=desc&keyword=张
```

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `page` | int | 1 | 页码，从 1 开始 |
| `page_size` | int | 20 | 每页条数，上限 100 |
| `sort_by` | string | `created_at` | 排序字段 |
| `sort_order` | string | `desc` | `asc` 或 `desc` |
| `keyword` | string | - | 搜索关键词（可选） |

### 后端通用分页中间件
```typescript
import { Request } from 'express'
import { z } from 'zod'

export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1).describe('页码'),
  pageSize: z.coerce.number().int().min(1).max(100).default(20).describe('每页条数'),
  sortBy: z.string().default('created_at').describe('排序字段'),
  sortOrder: z.enum(['asc', 'desc']).default('desc').describe('排序方向'),
})

export type PaginationParams = z.infer<typeof PaginationSchema>

export function parsePagination(query: Request['query']): PaginationParams & { offset: number } {
  const params = PaginationSchema.parse(query)
  return { ...params, offset: (params.page - 1) * params.pageSize }
}
```

---

## 六、认证与鉴权

### Token 传递方式
```
Authorization: Bearer <jwt_token>
```

### 鉴权粒度
```
0 级 — 无需登录（公开接口）：     GET /api/v1/public/...
1 级 — 需要登录（普通用户）：     Depends(get_current_user)
2 级 — 需要特定角色（管理员等）： Depends(require_role("admin"))
3 级 — 需要资源所有权验证：       在 Service 层校验 user_id == resource.owner_id
```

### 前端 Token 管理
```
1. 登录成功 → Supabase Auth 返回 session（含 access_token + refresh_token）
2. 前端 api-client 拦截器自动从 Supabase session 获取 access_token 附加到 Header
3. Token 过期 → Supabase SDK 自动用 refresh_token 刷新
4. refresh 也失败 → 跳转登录页
```

---

## 七、前端 API 调用层规范

### 每个功能模块的 service 文件
```tsx
// src/features/auth/services/auth-service.ts
import { apiClient } from '@/lib/api-client'
import type { LoginRequest, LoginResponse } from '../types'

export const authService = {
  // 邮箱密码登录
  login: (data: LoginRequest) =>
    apiClient.post<LoginResponse>('/api/v1/auth/login', data),

  // 获取当前用户信息
  getProfile: () =>
    apiClient.get<UserProfile>('/api/v1/users/me'),

  // 更新用户资料
  updateProfile: (data: Partial<UserProfile>) =>
    apiClient.patch<UserProfile>('/api/v1/users/me', data),
}
```

### service + hook 搭配
```tsx
// src/features/auth/hooks/use-profile.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '../services/auth-service'

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: authService.getProfile,
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}
```

---

## 八、接口文档要求

- 后端 API 文档使用 `swagger-ui-express` + `swagger-jsdoc` 自动生成（仅 dev 环境开放 `/docs`）
- 每个路由函数必须有完整的中文 JSDoc 注释
- 每个 Zod Schema 字段必须有 `.describe('中文说明')`
- Tag 分组必须与业务模块名一致（如 `用户管理`、`对话`）
- 响应示例必须在 Zod Schema / TypeScript 类型中体现，不手写 OpenAPI JSON

---

## 九、API 版本管理与弃用策略

### 1. 版本号规则
```
/api/v{major}/{resource}
```
- **Major 版本号**：仅当发生破坏性变更（Breaking Change）时递增
- **非破坏性变更**（新增字段、新增端点）直接在当前版本发布，无需新版本
- 同时最多维护 **2 个主版本**（当前版 + 上一版）

### 2. 破坏性变更定义
| 类型 | 是否破坏 | 示例 |
|------|---------|------|
| 新增可选字段 | ❌ | 响应体新增 `avatar_url` |
| 新增端点 | ❌ | `POST /api/v1/users/export` |
| 删除字段 | ✅ | 移除响应中的 `phone` |
| 重命名字段 | ✅ | `userName` → `user_name` |
| 修改字段类型 | ✅ | `id: number` → `id: string` |
| 修改错误码语义 | ✅ | `40101` 含义变更 |

### 3. 弃用流程（Sunset Protocol）
```
Phase 1 — 标记弃用（至少 30 天）
  ├── 响应头添加：Deprecation: true
  ├── 响应头添加：Sunset: Sat, 01 Jun 2026 00:00:00 GMT
  └── 文档标注 [DEPRECATED]，给出迁移指南

Phase 2 — 返回警告（Sunset 日期前 7 天）
  └── 响应体追加 warning 字段：
      { "warning": "此接口将于 2026-06-01 下线，请迁移至 /api/v2/..." }

Phase 3 — 正式下线
  └── 返回 410 Gone + 迁移指引
      { "code": 41000, "message": "此接口已下线，请使用 /api/v2/users" }
```

### 4. 版本协商中间件
```typescript
// src/middleware/api-version.ts
import { Request, Response, NextFunction } from 'express'

/** 解析并校验 API 版本号，注入 req.apiVersion */
export function apiVersionGuard(supportedVersions: number[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const match = req.path.match(/^\/api\/v(\d+)\//)
    if (!match) return next()

    const version = parseInt(match[1], 10)
    if (!supportedVersions.includes(version)) {
      return res.status(400).json({
        code: 40004,
        message: `不支持的 API 版本 v${version}，当前支持：${supportedVersions.map(v => `v${v}`).join(', ')}`,
        data: null,
      })
    }

    ;(req as any).apiVersion = version
    next()
  }
}
```

---

## 十、实时接口规范（WebSocket / Supabase Realtime）

### 1. 通信协议选型
| 场景 | 方案 | 理由 |
|------|------|------|
| 数据库行级变更推送 | Supabase Realtime | 零后端代码，直接订阅 Postgres Changes |
| 自定义业务事件（聊天、通知） | Supabase Realtime Broadcast | 利用 Supabase Channel，无需自建 WS 服务 |
| 需要后端处理逻辑的双向通信 | Socket.IO on Express | 鉴权中间件复用，房间管理灵活 |

### 2. Supabase Realtime 前端订阅模板
```typescript
// src/lib/realtime.ts
import { supabase } from './supabase-client'
import type { RealtimeChannel } from '@supabase/supabase-js'

/**
 * 订阅指定表的实时变更
 * @param table 表名
 * @param filter 可选行级过滤，如 'user_id=eq.xxx'
 * @param onInsert 新增回调
 * @param onUpdate 更新回调
 * @param onDelete 删除回调
 * @returns 取消订阅函数
 */
export function subscribeTable(
  table: string,
  filter: string | undefined,
  callbacks: {
    onInsert?: (payload: any) => void
    onUpdate?: (payload: any) => void
    onDelete?: (payload: any) => void
  },
): () => void {
  const channelConfig: any = {
    event: '*',
    schema: 'public',
    table,
  }
  if (filter) channelConfig.filter = filter

  const channel: RealtimeChannel = supabase
    .channel(`${table}-changes`)
    .on('postgres_changes', channelConfig, (payload) => {
      switch (payload.eventType) {
        case 'INSERT': callbacks.onInsert?.(payload.new); break
        case 'UPDATE': callbacks.onUpdate?.(payload.new); break
        case 'DELETE': callbacks.onDelete?.(payload.old); break
      }
    })
    .subscribe()

  // 返回清理函数，组件卸载时调用
  return () => { supabase.removeChannel(channel) }
}
```

### 3. React Hook 封装
```tsx
// src/hooks/use-realtime.ts
import { useEffect } from 'react'
import { subscribeTable } from '@/lib/realtime'
import { useQueryClient } from '@tanstack/react-query'

/**
 * 订阅表变更并自动刷新 React Query 缓存
 * @param table 表名
 * @param queryKey 需要失效的 React Query key
 * @param filter 可选行级过滤
 */
export function useRealtimeInvalidation(
  table: string,
  queryKey: string[],
  filter?: string,
) {
  const queryClient = useQueryClient()

  useEffect(() => {
    const unsubscribe = subscribeTable(table, filter, {
      onInsert: () => queryClient.invalidateQueries({ queryKey }),
      onUpdate: () => queryClient.invalidateQueries({ queryKey }),
      onDelete: () => queryClient.invalidateQueries({ queryKey }),
    })
    return unsubscribe
  }, [table, filter, queryKey.join(',')])
}

// 使用示例：实时同步订单列表
// useRealtimeInvalidation('orders', ['orders', 'list'], `user_id=eq.${userId}`)
```

### 4. Socket.IO 后端模板（需要自定义逻辑时）
```typescript
// src/realtime/socket.ts
import { Server as SocketServer } from 'socket.io'
import { Server } from 'http'
import { verifyJwt } from '@/core/auth'

export function initSocketIO(httpServer: Server) {
  const io = new SocketServer(httpServer, {
    cors: { origin: process.env.CORS_ORIGINS?.split(',') },
    path: '/ws',
  })

  // JWT 鉴权中间件——复用 HTTP 层的验签逻辑
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token
    if (!token) return next(new Error('未提供认证 Token'))
    try {
      const payload = await verifyJwt(token)
      ;(socket as any).userId = payload.sub
      next()
    } catch {
      next(new Error('Token 无效或已过期'))
    }
  })

  io.on('connection', (socket) => {
    const userId = (socket as any).userId
    // 自动加入用户私有房间
    socket.join(`user:${userId}`)

    socket.on('disconnect', () => {
      // 清理逻辑
    })
  })

  return io
}
```

### 5. 实时接口铁律
- **鉴权必须前置**：WebSocket 连接必须在握手阶段完成 JWT 校验，不接受连接后再验证
- **订阅范围最小化**：只订阅当前用户有权访问的数据（RLS 会自动过滤 Supabase Realtime）
- **前端必须清理**：组件卸载时必须调用 `unsubscribe()`，防止内存泄漏和幽灵连接
- **心跳与重连**：Supabase Realtime SDK 内置重连；Socket.IO 使用默认 `reconnection: true`
- **禁止轮询替代**：有实时通道时，严禁使用 `setInterval` 轮询 REST API

---

## 十一、文件上传接口规范

### 1. 上传策略选型
| 方案 | 适用场景 | 优势 |
|------|---------|------|
| **Supabase Storage 直传** | 头像、附件、公开资源 | 前端直传 CDN，后端零负载 |
| **后端中转上传** | 需校验/处理（水印、压缩） | 可做内容审核、病毒扫描 |
| **分片上传** | 大文件 > 50MB | 断点续传，进度可控 |

### 2. Supabase Storage 直传模板
```typescript
// 前端直传——后端只负责签发上传 URL 或直接用 Supabase SDK
import { supabase } from '@/lib/supabase-client'

interface UploadOptions {
  bucket: string       // 存储桶名
  path: string         // 文件路径，如 'avatars/{userId}.jpg'
  file: File           // File 对象
  maxSizeMB?: number   // 最大文件大小，默认 10MB
  allowedTypes?: string[] // MIME 白名单
}

export async function uploadFile({ bucket, path, file, maxSizeMB = 10, allowedTypes }: UploadOptions) {
  // 前端预校验——减少无效上传
  if (file.size > maxSizeMB * 1024 * 1024) {
    throw new Error(`文件不能超过 ${maxSizeMB}MB`)
  }
  if (allowedTypes && !allowedTypes.includes(file.type)) {
    throw new Error(`不支持的文件类型：${file.type}`)
  }

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true, // 同路径覆盖
    })

  if (error) throw error

  // 返回公开 URL
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path)
  return urlData.publicUrl
}
```

### 3. 后端中转上传端点
```typescript
// POST /api/v1/files/upload
// Content-Type: multipart/form-data

import multer from 'multer'
import { Router } from 'express'
import { BizError } from '@/core/exceptions'
import { ok } from '@/core/response'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 5,                    // 单次最多 5 个文件
  },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
    if (!allowed.includes(file.mimetype)) {
      cb(new BizError(40002, `不支持的文件类型：${file.mimetype}`))
      return
    }
    cb(null, true)
  },
})

const router = Router()

router.post('/upload', upload.array('files', 5), async (req, res) => {
  const files = req.files as Express.Multer.File[]
  if (!files?.length) throw new BizError(40001, '未上传任何文件')

  const results = await Promise.all(
    files.map(async (file) => {
      // 上传到 Supabase Storage
      const path = `uploads/${Date.now()}-${file.originalname}`
      const { data, error } = await supabase.storage
        .from('files')
        .upload(path, file.buffer, { contentType: file.mimetype })
      if (error) throw error
      return { name: file.originalname, path: data.path, size: file.size }
    })
  )

  res.status(201).json(ok(results))
})
```

### 4. 文件上传铁律
- **MIME 双重校验**：前端 `accept` 属性 + 后端 `fileFilter` 双重拦截，不信任前端
- **文件名消毒**：存储路径禁止使用原始文件名，用 `{timestamp}-{uuid}.{ext}` 格式
- **大小限制明示**：错误信息必须告知用户限制值（如"最大 10MB"），不返回模糊错误
- **进度反馈**：超过 1MB 的文件必须在前端显示上传进度条
- **Storage Bucket RLS**：Supabase Storage 的存储桶必须配置 RLS Policy，禁止匿名写入

---

## 十二、批量操作接口规范

### 1. 批量操作端点设计
```
POST /api/v1/users/batch          # 批量创建
PATCH /api/v1/users/batch         # 批量更新
DELETE /api/v1/users/batch        # 批量删除
POST /api/v1/users/batch/export   # 批量导出
```

### 2. 批量请求体格式
```json
// 批量删除
{
  "ids": ["uuid-1", "uuid-2", "uuid-3"]
}

// 批量更新（每项需包含 id）
{
  "items": [
    { "id": "uuid-1", "status": "active" },
    { "id": "uuid-2", "status": "disabled" }
  ]
}
```

### 3. 批量响应格式——部分成功模式
```json
{
  "code": 0,
  "message": "批量操作完成",
  "data": {
    "total": 3,
    "succeeded": 2,
    "failed": 1,
    "results": [
      { "id": "uuid-1", "success": true },
      { "id": "uuid-2", "success": true },
      { "id": "uuid-3", "success": false, "error": "记录不存在" }
    ]
  }
}
```

### 4. 批量操作实现模板
```typescript
// src/services/batch-service.ts

interface BatchResult<T = unknown> {
  total: number
  succeeded: number
  failed: number
  results: Array<{ id: string; success: boolean; data?: T; error?: string }>
}

/**
 * 通用批量操作执行器
 * 逐条执行并收集结果，不因单条失败而中断整体
 */
export async function executeBatch<T>(
  ids: string[],
  operation: (id: string) => Promise<T>,
  maxBatchSize = 100,
): Promise<BatchResult<T>> {
  if (ids.length > maxBatchSize) {
    throw new BizError(40003, `批量操作上限 ${maxBatchSize} 条，当前 ${ids.length} 条`)
  }

  // 去重
  const uniqueIds = [...new Set(ids)]
  const results: BatchResult<T>['results'] = []

  // 并发控制：分批执行，每批 10 条
  const CONCURRENCY = 10
  for (let i = 0; i < uniqueIds.length; i += CONCURRENCY) {
    const batch = uniqueIds.slice(i, i + CONCURRENCY)
    const batchResults = await Promise.allSettled(
      batch.map(async (id) => {
        const data = await operation(id)
        return { id, data }
      })
    )

    for (const result of batchResults) {
      if (result.status === 'fulfilled') {
        results.push({ id: result.value.id, success: true, data: result.value.data })
      } else {
        const errorMsg = result.reason?.message || '未知错误'
        results.push({ id: batch[results.length % batch.length], success: false, error: errorMsg })
      }
    }
  }

  return {
    total: uniqueIds.length,
    succeeded: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results,
  }
}
```

### 5. 批量操作铁律
- **上限必设**：任何批量端点必须设置条目上限（默认 100），防止超大请求拖垮数据库
- **去重必做**：后端必须对 `ids` 数组去重，前端传重复 ID 不应导致重复操作
- **部分成功必须反映**：响应中必须逐条返回成功/失败状态，不使用"全成功或全回滚"模式（除非业务明确要求事务性）
- **权限逐条校验**：批量删除/更新必须对每条记录校验所有权，不因"批量"跳过 RLS
- **异步降级**：超过 50 条的批量操作应考虑异步处理（返回任务 ID，前端轮询状态）

---

## 十三、API 安全加固清单

### 1. Rate Limiting（速率限制）
```typescript
// src/middleware/rate-limit.ts
import rateLimit from 'express-rate-limit'

// 全局速率限制
export const globalLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 分钟窗口
  max: 100,              // 每 IP 最多 100 次
  standardHeaders: true,
  legacyHeaders: false,
  message: { code: 42900, message: '请求过于频繁，请稍后再试', data: null },
})

// 登录接口专属限制（防暴力破解）
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟窗口
  max: 10,                   // 最多 10 次
  message: { code: 42901, message: '登录尝试次数过多，请 15 分钟后重试', data: null },
})
```

### 2. 请求体大小限制
```typescript
// main.ts
app.use(express.json({ limit: '1mb' }))   // JSON 请求体上限 1MB
app.use(express.urlencoded({ extended: true, limit: '1mb' }))
```

### 3. 安全响应头
```typescript
import helmet from 'helmet'
app.use(helmet())  // 自动添加 X-Content-Type-Options, X-Frame-Options 等
```

### 4. CORS 严格配置
```typescript
import cors from 'cors'
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || [],  // 白名单，不用 '*'
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400, // 预检缓存 24 小时
}))
```

### 5. 输入清洗
- **Zod Schema** 作为唯一入口：所有请求参数必须过 Zod 校验，不手写 `if (!req.body.xxx)`
- **SQL 注入防护**：使用 Supabase SDK 的参数化查询，严禁字符串拼接 SQL
- **XSS 防护**：用户输入落库前必须转义 HTML 特殊字符（`<`, `>`, `&`, `"`, `'`）

---

> 📌 **交叉引用**：后端架构哲学与全异步规范详见 [rules.md §三/§四](rules.md)；安全纵深体系详见 [coding-standards.md §六](coding-standards.md)；Docker 测试规范详见 [qa-testing.md](qa-testing.md)
