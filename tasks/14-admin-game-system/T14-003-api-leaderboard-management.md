# T14-003: 后端 API — 排行榜管理

> 分类: 14-管理后台-游戏管理与系统设置 (Admin Game & System)
> 状态: 📋 待开发
> 复杂度: M(中等)
> 预估文件数: 7

## 需求摘要

实现管理后台排行榜管理的完整后端 API，包括：全服段位排行榜查看（实时排名）、赛季排行榜查看（历史赛季最终段位排名）、按游戏筛选活跃排行、按段位范围筛选、用户游戏数据详情查看（各游戏对战数据 + 段位变动历史）、异常数据处理（标记可疑用户、重置段位、清除游戏数据、取消标记）、排行榜快照。权限要求：游戏运营 + 超级管理员。

## 相关上下文

- 产品需求: `product/admin/04-admin-game-system/03-leaderboard.md` — 排行榜查看、筛选、用户数据侧边栏、异常数据处理完整 PRD
- 产品需求: `product/admin/04-admin-game-system/00-index.md` §二 — 功能清单（#6 排行榜查看, #7 异常数据处理）
- 产品需求: `product/admin/04-admin-game-system/07-system-logs.md` §一.4 — 排行榜异常处理日志展开内容
- 产品总纲: `product/00-product-overview.md` §五.4 — 段位体系（青铜→王者，赢+1星/输-1星）
- API 设计: `grules/04-api-design.md` — RESTful 统一响应格式
- 编码规范: `grules/05-coding-standards.md` §三 — 后端分层
- 关联任务: 前置 T06-007（leaderboard / user_ranks 相关表）→ 后续 T14-009（前端排行榜管理页）

## 技术方案

### API 端点设计

```
GET    /api/v1/admin/leaderboard                          — 排行榜数据（分页+筛选）
GET    /api/v1/admin/leaderboard/users/:userId/game-data  — 用户游戏数据详情
GET    /api/v1/admin/leaderboard/users/:userId/rank-history — 用户段位变动历史
POST   /api/v1/admin/leaderboard/users/:userId/flag        — 标记可疑用户
POST   /api/v1/admin/leaderboard/users/:userId/handle      — 处理异常用户
```

### 排行榜数据模型

```typescript
interface LeaderboardEntry {
  rank: number
  user_id: string
  nickname: string
  avatar_url?: string
  tier: string                  // 如 'diamond_3'
  tier_name: string             // 如 '钻石 III'
  stars: number
  total_matches: number         // 总对战场次
  win_rate: number              // 胜率（百分比）
  last_active_at: string        // 最近活跃时间
  flag_status: FlagStatus       // 异常标记状态
}

type FlagStatus = 'normal' | 'suspicious' | 'handled'

interface UserGameData {
  user_id: string
  nickname: string
  avatar_url?: string
  current_tier: string
  stars: number
  registered_at: string
  last_active_at: string
  games: Array<{
    game_id: string
    game_name: string
    matches: number
    wins: number
    win_rate: number
    max_win_streak: number
    avg_duration_seconds: number
  }>
}

interface RankHistory {
  timestamp: string
  from_tier: string
  to_tier: string
  trigger_game: string
}
```

### 筛选参数 Zod Schema

```typescript
const LeaderboardQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  page_size: z.coerce.number().int().min(1).max(100).default(50),
  type: z.enum(['global', 'season']).default('global'),
  game_id: z.string().optional(),
  season_id: z.string().uuid().optional(),
  tier: z.enum(['bronze', 'silver', 'gold', 'platinum', 'diamond', 'star', 'king']).optional(),
  sort_by: z.enum(['rank', 'total_matches', 'win_rate']).default('rank'),
  sort_order: z.enum(['asc', 'desc']).default('asc'),
})
```

### 异常处理 Zod Schema

```typescript
const FlagUserSchema = z.object({
  reason: z.string().min(10).max(500).describe('标记原因'),
})

const HandleUserSchema = z.object({
  action: z.enum(['reset_rank', 'clear_data', 'unflag']).describe('处理方式'),
  reason: z.string().min(10).max(500).optional().describe('处理原因（重置/清除时必填）'),
})
```

### Repository 层

```typescript
export class LeaderboardRepository {
  async getGlobalRanking(params: LeaderboardQuery): Promise<{ items: LeaderboardEntry[]; total: number }>
  async getSeasonRanking(seasonId: string, params: LeaderboardQuery): Promise<{ items: LeaderboardEntry[]; total: number }>
  async getUserGameData(userId: string): Promise<UserGameData>
  async getUserRankHistory(userId: string, limit?: number): Promise<RankHistory[]>
  async flagUser(userId: string, reason: string, adminId: string): Promise<void>
  async resetUserRank(userId: string, reason: string, adminId: string): Promise<void>
  async clearUserGameData(userId: string, reason: string, adminId: string): Promise<void>
  async unflagUser(userId: string, adminId: string): Promise<void>
}
```

### Service 层

```typescript
export class LeaderboardService {
  async getRanking(query: LeaderboardQuery): Promise<PageData<LeaderboardEntry>>
  async getUserGameData(userId: string): Promise<UserGameData>
  async getUserRankHistory(userId: string): Promise<RankHistory[]>
  async flagUser(userId: string, reason: string, adminId: string): Promise<void>
  async handleUser(userId: string, action: HandleAction, reason: string, adminId: string): Promise<void>
}
```

### 异常处理逻辑

```
标记可疑:
  → user flag_status = 'suspicious'
  → 写入 admin_logs（操作人、目标用户、标记原因）

重置段位:
  → user tier = bronze_3, stars = 1
  → 写入段位变更日志（原因：管理员重置）
  → flag_status = 'handled'
  → 写入 admin_logs

清除游戏数据:
  → user tier = bronze_3, stars = 1
  → 清除 match_records 中该用户全部记录
  → flag_status = 'handled'
  → 写入 admin_logs（含处理原因）

取消标记:
  → flag_status = 'normal'
  → 写入 admin_logs
```

## 范围（做什么）

- 创建 `backend/src/repositories/leaderboard.repository.ts`
- 创建 `backend/src/services/leaderboard.service.ts`
- 创建 `backend/src/routers/v1/admin/leaderboard.router.ts`
- 创建 `backend/src/models/leaderboard.ts`
- 修改 `backend/src/routers/v1/admin/index.ts` — 挂载 leaderboard 路由

## 边界（不做什么）

- 不实现前端排行榜管理页面（T14-009）
- 不实现自动作弊检测算法（MVP 人工标记）
- 不实现用户端排行榜展示（属于应用端任务）
- 不实现 PK 匹配系统（属于游戏端）

## 涉及文件

- 新建: `zhiyu/backend/src/repositories/leaderboard.repository.ts`
- 新建: `zhiyu/backend/src/services/leaderboard.service.ts`
- 新建: `zhiyu/backend/src/routers/v1/admin/leaderboard.router.ts`
- 新建: `zhiyu/backend/src/models/leaderboard.ts`
- 修改: `zhiyu/backend/src/routers/v1/admin/index.ts`

## 依赖

- 前置: T06-007（leaderboard / user_ranks / match_records 相关表）
- 后续: T14-009（前端排行榜管理页）、T14-012（集成验证）

## 验收标准（GIVEN-WHEN-THEN）

1. **GIVEN** 管理员已登录（游戏运营角色）  
   **WHEN** GET `/api/v1/admin/leaderboard?type=global&page=1&page_size=50`  
   **THEN** 返回 200，data 含排行榜条目列表（含排名、用户信息、段位、对战数据、异常标记）

2. **GIVEN** 管理员已登录  
   **WHEN** GET `/api/v1/admin/leaderboard?type=season&season_id={id}&tier=diamond`  
   **THEN** 返回 200，仅包含该赛季钻石段位用户的排名数据

3. **GIVEN** 管理员已登录  
   **WHEN** GET `/api/v1/admin/leaderboard?game_id=G1&sort_by=total_matches&sort_order=desc`  
   **THEN** 返回 200，按 G1 游戏对战场次降序排列

4. **GIVEN** 管理员已登录  
   **WHEN** GET `/api/v1/admin/leaderboard/users/:userId/game-data`  
   **THEN** 返回 200，包含该用户 12 款游戏各自的对战数据（场次、胜率、连胜、平均用时）

5. **GIVEN** 管理员已登录  
   **WHEN** GET `/api/v1/admin/leaderboard/users/:userId/rank-history`  
   **THEN** 返回 200，包含最近 30 条段位变动记录（时间、变动前后段位、触发游戏）

6. **GIVEN** 一个 flag_status 为 normal 的用户  
   **WHEN** POST `/api/v1/admin/leaderboard/users/:userId/flag` body: { reason: "1小时内胜场50场" }  
   **THEN** 返回 200，用户标记为 suspicious，写入 admin_logs

7. **GIVEN** 一个 flag_status 为 suspicious 的用户  
   **WHEN** POST `/api/v1/admin/leaderboard/users/:userId/handle` body: { action: "reset_rank", reason: "确认作弊" }  
   **THEN** 返回 200，用户段位重置为青铜 III（1 星），flag_status 变为 handled

8. **GIVEN** 一个 flag_status 为 suspicious 的用户  
   **WHEN** POST `/api/v1/admin/leaderboard/users/:userId/handle` body: { action: "clear_data", reason: "严重作弊" }  
   **THEN** 返回 200，用户段位重置 + 全部对战记录清除，flag_status 变为 handled

9. **GIVEN** 一个 flag_status 为 suspicious 的用户  
   **WHEN** POST `/api/v1/admin/leaderboard/users/:userId/handle` body: { action: "unflag" }  
   **THEN** 返回 200，flag_status 恢复为 normal

10. **GIVEN** 处理操作选择 reset_rank 但未提供 reason  
    **WHEN** POST `.../handle` body: { action: "reset_rank" }  
    **THEN** 返回 400，提示"处理原因为必填项"

11. **GIVEN** 非管理员角色用户  
    **WHEN** 访问任何 `/api/v1/admin/leaderboard` 端点  
    **THEN** 返回 403

12. **GIVEN** 管理员执行异常处理操作  
    **WHEN** 操作完成后查询 admin_logs  
    **THEN** 日志中包含操作人、目标用户、处理方式、处理原因

## Docker 自动化测试（强制）

> ⚠️ 绝对禁止在宿主机环境测试，必须通过 Docker 容器验证 ⚠️

### 测试步骤

1. `docker compose up -d --build` — 构建并启动所有服务
2. `docker compose ps` — 确认所有容器 Running
3. 登录获取管理员 Token
4. 测试全服排行榜查询（默认+筛选+排序）
5. 测试赛季排行榜查询
6. 测试用户游戏数据详情
7. 测试用户段位变动历史
8. 测试标记可疑用户
9. 测试重置段位
10. 测试清除游戏数据
11. 测试取消标记
12. 测试权限拦截

### 测试通过标准

- [ ] TypeScript 零编译错误
- [ ] Docker 构建成功，所有容器 Running
- [ ] 排行榜查询正确返回排名数据
- [ ] 筛选（类型/游戏/赛季/段位）组合正确
- [ ] 用户游戏数据和段位历史完整
- [ ] 标记/重置/清除/取消操作正确执行
- [ ] 重置段位确实变为青铜 III 1 星
- [ ] 清除数据确实删除对战记录
- [ ] 所有异常处理操作写入 admin_logs
- [ ] 权限拦截正确
- [ ] 控制台无 Error 级别日志

### 测试不通过处理

- 发现问题 → 立即修复 → 重新 Docker 构建 → 重新验证全部
- 同一问题 3 次修复失败 → 标记阻塞，停止任务

## 执行结果报告

结果文件路径: `/tasks/result/14-admin-game-system/T14-003-api-leaderboard-management.md`

## 自检重点

- [ ] 安全：异常处理操作必须记录完整审计日志
- [ ] 安全：清除游戏数据操作不可恢复，需要 reason 强制校验
- [ ] 性能：排行榜查询有索引（tier, stars, total_matches），< 2s 响应
- [ ] 性能：分页查询使用 LIMIT + OFFSET，禁止全表扫描
- [ ] 类型同步：leaderboard.ts 类型与数据库 Schema 一致
- [ ] API 规范：响应格式符合 grules/04-api-design.md
