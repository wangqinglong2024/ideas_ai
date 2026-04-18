# T14-006: 后端 API — 系统操作日志

> 分类: 14-管理后台-游戏管理与系统设置 (Admin Game & System)
> 状态: 📋 待开发
> 复杂度: M(中等)
> 预估文件数: 7

## 需求摘要

实现管理后台系统操作日志的完整后端 API 和日志记录中间件，包括：统一日志记录中间件（拦截所有管理员写操作，自动记录操作人/操作类型/操作描述/变更前后值/IP 地址）、日志查询 API（多维度筛选：操作人/操作类型/日期范围/目标模块）、日志详情展开（字段级变更前后对比）、日志导出（CSV 格式，行数上限 50,000 条，频率限制每小时 5 次）。日志不可修改/不可删除（只追加）。权限要求：仅超级管理员。

## 相关上下文

- 产品需求: `product/admin/04-admin-game-system/07-system-logs.md` §一 — 系统操作日志页面布局、筛选栏、列表表格、行展开详情、日志导出、日志保留策略完整 PRD
- 产品需求: `product/admin/04-admin-game-system/00-index.md` §二 — 功能清单（#10 系统日志查看, #15 日志导出）
- 产品需求: `product/admin/04-admin-game-system/07-system-logs.md` §三.1 — 日志性能要求（列表加载<2s, 搜索<1.5s, 导出50,000条<30s）
- API 设计: `grules/04-api-design.md` — RESTful 统一响应格式
- 编码规范: `grules/05-coding-standards.md` §三 — 后端分层
- 关联任务: 前置 T11-001（admin_logs 表基础结构）→ 后续 T14-011（前端系统日志页）

## 技术方案

### API 端点设计

```
GET    /api/v1/admin/system-logs                   — 日志列表（分页+筛选）
GET    /api/v1/admin/system-logs/:id               — 日志详情（含变更前后对比）
POST   /api/v1/admin/system-logs/export            — 导出日志（CSV）
GET    /api/v1/admin/system-logs/operators          — 获取操作人列表（用于筛选下拉）
```

### 日志数据模型

```typescript
interface AdminLog {
  id: string
  admin_id: string                // 操作人 ID
  admin_name: string              // 操作人姓名（冗余存储，防止管理员删除后丢失）
  operation_type: OperationType   // 操作类型
  operation_desc: string          // 操作描述（一句话）
  target_module: TargetModule     // 目标模块
  target_id?: string              // 操作对象 ID
  target_label?: string           // 操作对象标识（如用户名/皮肤名/赛季名）
  changes?: FieldChange[]         // 字段级变更详情（可选）
  metadata?: Record<string, any>  // 额外元数据（如推送发送详情、赛季结束步骤等）
  ip_address: string              // 操作人 IP
  created_at: string              // 操作时间
}

type OperationType = 'content_management' | 'user_management' | 'order_refund' | 'coin_operation' | 'game_management' | 'system_setting' | 'auth'

type TargetModule = 'skin' | 'season' | 'leaderboard' | 'push' | 'i18n' | 'admin' | 'course' | 'article' | 'order' | 'user' | 'coin'

interface FieldChange {
  field: string                   // 字段名
  field_label: string             // 字段中文标签
  old_value: any                  // 变更前值
  new_value: any                  // 变更后值
}
```

### 日志记录中间件

```typescript
// backend/src/core/audit-logger.ts

/**
 * 审计日志记录器
 * 所有管理员写操作（POST/PUT/PATCH/DELETE）自动调用
 * 
 * 使用方式 1: 中间件自动记录
 *   router.post('/skins', auditLog('game_management', 'skin'), handler)
 * 
 * 使用方式 2: Service 层手动调用
 *   await auditLogger.log({
 *     adminId, operationType, operationDesc,
 *     targetModule, targetId, targetLabel,
 *     changes, metadata, ipAddress
 *   })
 */

export class AuditLogger {
  /**
   * 记录操作日志（核心方法）
   * 日志一经写入不可修改/不可删除
   */
  async log(entry: AuditLogEntry): Promise<void>

  /**
   * 生成变更差异（对比新旧对象，提取有变化的字段）
   * @param oldObj 变更前对象
   * @param newObj 变更后对象
   * @param fieldLabels 字段→中文标签映射
   */
  static diff(oldObj: Record<string, any>, newObj: Record<string, any>, fieldLabels: Record<string, string>): FieldChange[]
}

// 中间件装饰器
export function auditLog(operationType: OperationType, targetModule: TargetModule) {
  return (req: Request, res: Response, next: NextFunction) => {
    // 在响应完成后记录日志（确保操作成功才记录）
    const originalJson = res.json.bind(res)
    res.json = (body: any) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        // 异步记录日志，不阻塞响应
        auditLogger.log({
          adminId: req.adminId,
          operationType,
          targetModule,
          ipAddress: req.ip,
          // ... 从 req/res 中提取详情
        }).catch(err => logger.error('审计日志写入失败', err))
      }
      return originalJson(body)
    }
    next()
  }
}
```

### 日志查询筛选 Zod Schema

```typescript
const LogListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  page_size: z.coerce.number().int().min(1).max(100).default(50),
  admin_id: z.string().uuid().optional().describe('操作人 ID'),
  operation_type: z.enum([
    'content_management', 'user_management', 'order_refund',
    'coin_operation', 'game_management', 'system_setting', 'auth'
  ]).optional(),
  target_module: z.enum([
    'skin', 'season', 'leaderboard', 'push', 'i18n',
    'admin', 'course', 'article', 'order', 'user', 'coin'
  ]).optional(),
  start_date: z.string().optional().describe('起始日期 YYYY-MM-DD'),
  end_date: z.string().optional().describe('结束日期 YYYY-MM-DD'),
  keyword: z.string().max(100).optional().describe('搜索关键词'),
})
```

### 日志导出处理

```typescript
// POST /api/v1/admin/system-logs/export
// Body: { scope: 'filtered' | 'custom', start_date?, end_date?, filters? }

// 导出限制：
// - 单次最大 50,000 条
// - 同一管理员每小时最多 5 次
// - 最大日期跨度 365 天
// - 导出操作本身也写入日志

const ExportSchema = z.object({
  scope: z.enum(['filtered', 'custom']),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  admin_id: z.string().uuid().optional(),
  operation_type: z.string().optional(),
  target_module: z.string().optional(),
})
```

### Repository 层

```typescript
export class AdminLogRepository {
  async findAll(params: LogListQuery): Promise<{ items: AdminLog[]; total: number }>
  async findById(id: string): Promise<AdminLog | null>
  async create(entry: AdminLog): Promise<void>  // 仅创建，不可更新/删除
  async getOperators(): Promise<{ admin_id: string; admin_name: string }[]>
  async exportToCSV(params: LogExportQuery): Promise<{ data: Buffer; count: number }>
  async getExportCount(adminId: string, withinHours: number): Promise<number>
}
```

### Service 层

```typescript
export class AdminLogService {
  async listLogs(query: LogListQuery): Promise<PageData<AdminLog>>
  async getLogDetail(id: string): Promise<AdminLog>
  async getOperators(): Promise<{ admin_id: string; admin_name: string }[]>
  async exportLogs(params: LogExportQuery, adminId: string): Promise<Buffer>
}
```

### 业务规则

- 日志只追加，不可修改/不可删除（数据库层面无 UPDATE/DELETE 权限）
- admin_name 冗余存储，管理员删除后日志中显示"已删除-{原姓名}"
- 筛选日期默认最近 7 天
- 最大日期跨度 365 天
- 导出行数上限 50,000 条
- 同一管理员每小时导出次数上限 5 次
- 导出操作本身记录到日志
- 仅超级管理员可访问系统日志

## 范围（做什么）

- 创建 `backend/src/core/audit-logger.ts` — 审计日志记录器 + 中间件
- 创建 `backend/src/repositories/admin-log.repository.ts`
- 创建 `backend/src/services/admin-log.service.ts`
- 创建 `backend/src/routers/v1/admin/system-logs.router.ts`
- 创建 `backend/src/models/admin-log.ts`
- 修改 `backend/src/routers/v1/admin/index.ts` — 挂载 system-logs 路由
- 将 audit-logger 集成到已有的管理后台路由中（T14-001~T14-005 的路由）

## 边界（不做什么）

- 不实现前端系统日志页面（T14-011）
- 不实现日志自动归档（P2 功能）
- 不实现日志实时推送（WebSocket 通知新日志）
- 不实现日志全文搜索（Elasticsearch 等）— MVP 用 LIKE 搜索

## 涉及文件

- 新建: `zhiyu/backend/src/core/audit-logger.ts`
- 新建: `zhiyu/backend/src/repositories/admin-log.repository.ts`
- 新建: `zhiyu/backend/src/services/admin-log.service.ts`
- 新建: `zhiyu/backend/src/routers/v1/admin/system-logs.router.ts`
- 新建: `zhiyu/backend/src/models/admin-log.ts`
- 修改: `zhiyu/backend/src/routers/v1/admin/index.ts`
- 修改: 已有管理后台路由文件（集成审计日志中间件）

## 依赖

- 前置: T11-001（admin_logs 表基础结构）
- 后续: T14-011（前端系统日志页）、T14-012（集成验证）

## 验收标准（GIVEN-WHEN-THEN）

1. **GIVEN** 超级管理员已登录  
   **WHEN** GET `/api/v1/admin/system-logs?page=1&page_size=50`  
   **THEN** 返回 200，日志列表按时间降序，包含操作时间/操作人/操作类型/操作描述/目标/IP

2. **GIVEN** 超级管理员已登录  
   **WHEN** GET `/api/v1/admin/system-logs?operation_type=game_management&start_date=2026-04-01&end_date=2026-04-18`  
   **THEN** 返回 200，仅包含指定日期范围内的游戏管理操作日志

3. **GIVEN** 超级管理员已登录  
   **WHEN** GET `/api/v1/admin/system-logs/:id`（一条皮肤编辑日志）  
   **THEN** 返回 200，包含 changes 数组，每个 change 含 field/field_label/old_value/new_value

4. **GIVEN** 管理员执行了皮肤上架操作  
   **WHEN** 查询最新日志  
   **THEN** 日志包含操作人、操作类型=game_management、目标模块=skin、操作描述含皮肤名称

5. **GIVEN** 管理员执行了赛季结束操作  
   **WHEN** 查询该日志详情  
   **THEN** metadata 中包含 5 步操作的执行结果

6. **GIVEN** 超级管理员已登录  
   **WHEN** POST `/api/v1/admin/system-logs/export` 导出最近 7 天日志  
   **THEN** 返回 CSV 文件流，包含所有筛选条件内的日志

7. **GIVEN** 超级管理员本小时已导出 5 次  
   **WHEN** 第 6 次导出  
   **THEN** 返回 429，提示"本小时导出次数已达上限，请稍后再试"

8. **GIVEN** 导出请求的日志条数超过 50,000  
   **WHEN** POST `/api/v1/admin/system-logs/export`  
   **THEN** 返回 400，提示"导出记录超过 50,000 条，请缩小筛选范围"

9. **GIVEN** 超级管理员已登录  
   **WHEN** GET `/api/v1/admin/system-logs/operators`  
   **THEN** 返回 200，包含所有管理员列表（含已删除管理员标记）

10. **GIVEN** 数据库中尝试 UPDATE 或 DELETE admin_logs 表  
    **WHEN** 执行该操作  
    **THEN** 操作被拒绝（数据库层面限制或应用层禁止）

11. **GIVEN** 非超级管理员角色（如游戏运营）  
    **WHEN** 访问 `/api/v1/admin/system-logs`  
    **THEN** 返回 403

12. **GIVEN** 审计日志中间件已集成  
    **WHEN** 任何管理员执行写操作（创建/编辑/删除/状态变更）  
    **THEN** 操作自动记录到 admin_logs，无需每个路由手动调用

## Docker 自动化测试（强制）

> ⚠️ 绝对禁止在宿主机环境测试，必须通过 Docker 容器验证 ⚠️

### 测试步骤

1. `docker compose up -d --build` — 构建并启动所有服务
2. `docker compose ps` — 确认所有容器 Running
3. 登录获取超级管理员 Token
4. 执行一系列管理操作（创建皮肤、编辑赛季、发送推送等）
5. 测试日志列表查询（各维度筛选组合）
6. 测试日志详情（变更前后对比）
7. 测试日志导出（正常/超限/频率限制）
8. 测试审计日志中间件自动记录
9. 测试日志不可修改/删除
10. 测试权限拦截（非超管 403）

### 测试通过标准

- [ ] TypeScript 零编译错误
- [ ] Docker 构建成功，所有容器 Running
- [ ] 日志列表查询 < 2s，搜索 < 1.5s
- [ ] 筛选（操作人/类型/日期/模块）组合正确
- [ ] 日志详情含完整变更对比
- [ ] 审计中间件自动记录所有写操作
- [ ] 导出 CSV 格式正确
- [ ] 导出频率限制生效
- [ ] 日志不可修改/不可删除
- [ ] 权限拦截正确（仅超管可访问）
- [ ] 控制台无 Error 级别日志

### 测试不通过处理

- 发现问题 → 立即修复 → 重新 Docker 构建 → 重新验证全部
- 同一问题 3 次修复失败 → 标记阻塞，停止任务

## 执行结果报告

结果文件路径: `/tasks/result/14-admin-game-system/T14-006-api-system-logs.md`

## 自检重点

- [ ] 安全：日志表无 UPDATE/DELETE 权限（只追加）
- [ ] 安全：仅超级管理员可访问日志查询和导出
- [ ] 安全：导出频率限制防止滥用
- [ ] 性能：日志表有索引（created_at, admin_id, operation_type, target_module）
- [ ] 性能：日志列表查询 < 2s，导出 50,000 条 < 30s
- [ ] 性能：审计日志记录异步执行，不阻塞业务响应
- [ ] 类型同步：admin-log.ts 类型与数据库 Schema 一致
- [ ] API 规范：响应格式符合 grules/04-api-design.md
