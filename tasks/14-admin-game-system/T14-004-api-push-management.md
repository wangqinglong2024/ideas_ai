# T14-004: 后端 API — 推送管理

> 分类: 14-管理后台-游戏管理与系统设置 (Admin Game & System)
> 状态: 📋 待开发
> 复杂度: M(中等)
> 预估文件数: 8

## 需求摘要

实现管理后台推送通知管理的完整后端 API，包括：推送 CRUD（三语标题和内容、推送类型、目标人群筛选条件）、推送模板管理、目标人群精准筛选（按用户类型/活跃度/地区/段位/课程进度组合筛选）、目标人数实时预估、立即发送 / 定时发送、推送历史记录、推送效果统计（送达率/打开率）。权限要求：超级管理员 + 所有运营角色。

## 相关上下文

- 产品需求: `product/admin/04-admin-game-system/04-push-management.md` — 推送列表、新建/编辑、目标人群筛选、推送时间、效果统计完整 PRD
- 产品需求: `product/admin/04-admin-game-system/00-index.md` §二 — 功能清单（#8 推送列表与创建, #13 推送数据统计, #16 定时发送）
- 产品需求: `product/admin/04-admin-game-system/07-system-logs.md` §二.3 — 推送管理数据流
- 产品需求: `product/admin/04-admin-game-system/07-system-logs.md` §三.1 — 推送发送性能要求（10,000人<5s, 50,000人<15s）
- API 设计: `grules/04-api-design.md` — RESTful 统一响应格式
- 编码规范: `grules/05-coding-standards.md` §三 — 后端分层
- 关联任务: 前置 T02-009（推送基础设施，如有）、T11-003（管理员权限中间件）→ 后续 T14-009（前端推送管理页）

## 技术方案

### API 端点设计

```
GET    /api/v1/admin/push                          — 推送列表（分页+筛选）
GET    /api/v1/admin/push/:id                      — 推送详情
POST   /api/v1/admin/push                          — 新建推送（草稿）
PUT    /api/v1/admin/push/:id                      — 编辑推送
DELETE /api/v1/admin/push/:id                      — 删除推送（仅草稿）
POST   /api/v1/admin/push/:id/send                 — 立即发送推送
POST   /api/v1/admin/push/:id/schedule             — 定时发送
POST   /api/v1/admin/push/:id/cancel               — 取消定时发送（回退为草稿）
POST   /api/v1/admin/push/:id/retry                — 重试失败的推送
POST   /api/v1/admin/push/estimate-audience        — 预估目标人数
GET    /api/v1/admin/push/:id/stats                — 推送效果统计
```

### 推送数据模型

```typescript
interface PushMessage {
  id: string
  title_zh: string                // 中文标题
  title_en: string                // 英文标题
  title_vi: string                // 越南语标题
  content_zh: string              // 中文内容
  content_en: string              // 英文内容
  content_vi: string              // 越南语内容
  push_type: PushType             // 推送类型
  target_audience: AudienceFilter // 目标人群筛选条件
  status: PushStatus              // 状态
  scheduled_at?: string           // 定时发送时间
  sent_at?: string                // 实际发送时间
  estimated_count?: number        // 预估目标人数
  actual_count?: number           // 实际发送人数
  created_by: string              // 创建人 admin_id
  created_at: string
  updated_at: string
  deleted_at?: string
}

type PushType = 'learning_reminder' | 'activity_notice' | 'system_notice'
type PushStatus = 'draft' | 'scheduled' | 'sent' | 'failed'

interface AudienceFilter {
  scope: 'all' | 'custom'
  user_types?: ('guest' | 'free' | 'paid')[]
  activity?: {
    type: 'active_within' | 'inactive_for' | 'custom_inactive'
    days?: number
  }
  countries?: string[]
  tier_range?: {
    min_tier?: Tier
    max_tier?: Tier
  }
  course_progress?: 'not_started' | 'l1_l3_learning' | 'l1_l3_completed' | 'l4_plus'
}

interface PushStats {
  push_id: string
  total_sent: number
  delivered: number
  delivery_rate: number           // 送达率 %
  opened: number
  open_rate: number               // 打开率 %
  failed: number
  failure_reasons: Record<string, number>  // 失败原因统计
}
```

### 目标人群预估

```typescript
// POST /api/v1/admin/push/estimate-audience
// 根据筛选条件实时计算匹配用户数量
// 500ms 防抖由前端控制，后端直接返回计数结果

const EstimateAudienceSchema = z.object({
  scope: z.enum(['all', 'custom']),
  user_types: z.array(z.enum(['guest', 'free', 'paid'])).optional(),
  activity: z.object({
    type: z.enum(['active_within', 'inactive_for', 'custom_inactive']),
    days: z.number().int().min(1).max(365).optional(),
  }).optional(),
  countries: z.array(z.string()).optional(),
  tier_range: z.object({
    min_tier: z.enum(['bronze', 'silver', 'gold', 'platinum', 'diamond', 'star', 'king']).optional(),
    max_tier: z.enum(['bronze', 'silver', 'gold', 'platinum', 'diamond', 'star', 'king']).optional(),
  }).optional(),
  course_progress: z.enum(['not_started', 'l1_l3_learning', 'l1_l3_completed', 'l4_plus']).optional(),
})
```

### 定时发送机制

```typescript
// 定时发送使用后端定时任务（node-cron 或 bull 队列）
// POST /api/v1/admin/push/:id/schedule
// 将推送状态设为 scheduled，scheduled_at 写入计划时间
// 定时任务每分钟扫描 scheduled_at <= NOW() 且 status = scheduled 的推送，执行发送

// 校验：定时时间必须晚于当前时间至少 5 分钟
```

### 推送发送流程

```
管理员点击"确认发送" / 定时任务触发
       ↓
  ① 根据 target_audience 条件查询匹配用户列表
       ↓
  ② 按用户语言偏好选择对应语言的标题和内容
       ↓
  ③ 批量推送到 FCM / APNs（分批发送，每批 500 人）
       ↓
  ④ 记录发送结果（成功/失败）
       ↓
  ⑤ 更新 push_stats 统计数据
       ↓
  ⑥ 写入 admin_logs（推送标题、类型、目标人数、发送时间）
```

### Repository 层

```typescript
export class PushRepository {
  async findAll(params: PushListQuery): Promise<{ items: PushMessage[]; total: number }>
  async findById(id: string): Promise<PushMessage | null>
  async create(data: PushCreate): Promise<PushMessage>
  async update(id: string, data: PushUpdate): Promise<PushMessage>
  async softDelete(id: string): Promise<void>
  async updateStatus(id: string, status: PushStatus): Promise<void>
  async estimateAudience(filter: AudienceFilter): Promise<number>
  async getMatchingUsers(filter: AudienceFilter): Promise<{ user_id: string; language: string }[]>
  async getStats(pushId: string): Promise<PushStats | null>
  async upsertStats(pushId: string, stats: Partial<PushStats>): Promise<void>
}
```

### Service 层

```typescript
export class PushService {
  async listPushMessages(query: PushListQuery): Promise<PageData<PushMessage>>
  async getPushById(id: string): Promise<PushMessage>
  async createPush(data: PushCreate, adminId: string): Promise<PushMessage>
  async updatePush(id: string, data: PushUpdate): Promise<PushMessage>
  async deletePush(id: string): Promise<void>
  async sendPush(id: string, adminId: string): Promise<void>
  async schedulePush(id: string, scheduledAt: string, adminId: string): Promise<void>
  async cancelSchedule(id: string): Promise<void>
  async retryPush(id: string, adminId: string): Promise<void>
  async estimateAudience(filter: AudienceFilter): Promise<number>
  async getPushStats(id: string): Promise<PushStats>
}
```

### 业务规则

- 仅草稿状态可编辑和删除
- 已发送推送不可修改、不可删除
- 定时发送时间必须晚于当前时间至少 5 分钟
- 取消定时发送后状态回退为草稿
- 发送失败的推送可重试
- 目标人数预估 < 2s 响应
- 10,000 人推送队列入队 < 5s
- 50,000 人推送队列入队 < 15s
- 所有发送操作写入 admin_logs

## 范围（做什么）

- 创建 `backend/src/repositories/push.repository.ts`
- 创建 `backend/src/services/push.service.ts`
- 创建 `backend/src/routers/v1/admin/push.router.ts`
- 创建 `backend/src/models/push.ts`
- 创建 `backend/src/jobs/push-scheduler.ts` — 定时推送任务
- 修改 `backend/src/routers/v1/admin/index.ts` — 挂载 push 路由

## 边界（不做什么）

- 不实现前端推送管理页面（T14-009）
- 不实现 FCM/APNs 真实集成（MVP 用日志模拟，记录"已推送"状态）
- 不实现推送消息模板中心（第二迭代）
- 不实现用户端推送接收和展示

## 涉及文件

- 新建: `zhiyu/backend/src/repositories/push.repository.ts`
- 新建: `zhiyu/backend/src/services/push.service.ts`
- 新建: `zhiyu/backend/src/routers/v1/admin/push.router.ts`
- 新建: `zhiyu/backend/src/models/push.ts`
- 新建: `zhiyu/backend/src/jobs/push-scheduler.ts`
- 修改: `zhiyu/backend/src/routers/v1/admin/index.ts`

## 依赖

- 前置: T02-009（推送基础设施，如有）、T11-003（adminAuthMiddleware）
- 后续: T14-009（前端排行榜与推送管理页）、T14-012（集成验证）

## 验收标准（GIVEN-WHEN-THEN）

1. **GIVEN** 管理员已登录  
   **WHEN** GET `/api/v1/admin/push?page=1&page_size=20&status=sent`  
   **THEN** 返回 200，仅包含已发送的推送列表，按推送时间降序

2. **GIVEN** 管理员已登录  
   **WHEN** POST `/api/v1/admin/push` 发送完整推送信息（三语标题+内容+类型+目标人群）  
   **THEN** 返回 201，推送创建成功，状态为 draft

3. **GIVEN** 一个 draft 状态的推送  
   **WHEN** POST `/api/v1/admin/push/:id/send`  
   **THEN** 返回 200，推送执行发送，状态变为 sent，写入 admin_logs

4. **GIVEN** 一个 draft 状态的推送  
   **WHEN** POST `/api/v1/admin/push/:id/schedule` body: { scheduled_at: "2026-04-20T10:00:00Z" }  
   **THEN** 返回 200，状态变为 scheduled

5. **GIVEN** 定时发送时间早于当前时间 + 5 分钟  
   **WHEN** POST `/api/v1/admin/push/:id/schedule`  
   **THEN** 返回 400，提示"定时发送时间必须晚于当前时间至少 5 分钟"

6. **GIVEN** 一个 scheduled 状态的推送  
   **WHEN** POST `/api/v1/admin/push/:id/cancel`  
   **THEN** 返回 200，状态回退为 draft

7. **GIVEN** 自定义人群筛选（付费用户 + 7 天未登录 + 钻石及以上段位）  
   **WHEN** POST `/api/v1/admin/push/estimate-audience`  
   **THEN** 返回 200，包含预估人数（< 2s 响应）

8. **GIVEN** 一个已发送的推送  
   **WHEN** GET `/api/v1/admin/push/:id/stats`  
   **THEN** 返回 200，包含 total_sent, delivered, delivery_rate, opened, open_rate

9. **GIVEN** 一个 sent 状态的推送  
   **WHEN** DELETE `/api/v1/admin/push/:id`  
   **THEN** 返回 400，提示"已发送推送不可删除"

10. **GIVEN** 一个 failed 状态的推送  
    **WHEN** POST `/api/v1/admin/push/:id/retry`  
    **THEN** 返回 200，重新执行发送

11. **GIVEN** 推送内容缺少英文标题  
    **WHEN** POST `/api/v1/admin/push`  
    **THEN** 返回 400，提示"英文标题为必填项"

12. **GIVEN** 非管理员角色用户  
    **WHEN** 访问任何 `/api/v1/admin/push` 端点  
    **THEN** 返回 403

## Docker 自动化测试（强制）

> ⚠️ 绝对禁止在宿主机环境测试，必须通过 Docker 容器验证 ⚠️

### 测试步骤

1. `docker compose up -d --build` — 构建并启动所有服务
2. `docker compose ps` — 确认所有容器 Running
3. 登录获取管理员 Token
4. 测试创建推送（草稿）
5. 测试推送列表（筛选状态/类型/日期）
6. 测试立即发送
7. 测试定时发送与取消
8. 测试目标人群预估
9. 测试推送效果统计
10. 测试发送失败重试
11. 测试已发送推送不可删除
12. 测试权限拦截

### 测试通过标准

- [ ] TypeScript 零编译错误
- [ ] Docker 构建成功，所有容器 Running
- [ ] 推送 CRUD 全部正常
- [ ] 立即发送/定时发送/取消/重试状态流转正确
- [ ] 目标人群预估 < 2s 响应
- [ ] 推送效果统计数据正确
- [ ] 所有发送操作写入 admin_logs
- [ ] 权限拦截正确
- [ ] 控制台无 Error 级别日志

### 测试不通过处理

- 发现问题 → 立即修复 → 重新 Docker 构建 → 重新验证全部
- 同一问题 3 次修复失败 → 标记阻塞，停止任务

## 执行结果报告

结果文件路径: `/tasks/result/14-admin-game-system/T14-004-api-push-management.md`

## 自检重点

- [ ] 安全：推送内容 XSS 防护（用户输入转义）
- [ ] 性能：目标人群预估查询有索引优化，< 2s
- [ ] 性能：大批量推送分批发送（500 人/批），不阻塞主线程
- [ ] 类型同步：push.ts 类型与数据库 Schema 一致
- [ ] 审计日志：发送/取消/重试操作均记录
- [ ] API 规范：响应格式符合 grules/04-api-design.md
