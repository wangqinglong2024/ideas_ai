# T14-002: 后端 API — 赛季管理

> 分类: 14-管理后台-游戏管理与系统设置 (Admin Game & System)
> 状态: 📋 待开发
> 复杂度: M(中等)
> 预估文件数: 8

## 需求摘要

实现管理后台赛季管理的完整后端 API，包括：赛季 CRUD（名称、起止日期、赛季编号自动生成）、段位软重置规则配置（7 个大段各自的重置目标段位映射）、赛季奖励配置（各段位知语币奖励 + 专属皮肤）、赛季状态流转（待开始 → 进行中 → 已结束）、手动开始赛季、手动结束赛季（5 步链式事务操作：记录最终段位 → 发放奖励 → 重置段位 → 下架限定皮肤 → 生成报告）、赛季报告查看。权限要求：游戏运营 + 超级管理员。

## 相关上下文

- 产品需求: `product/admin/04-admin-game-system/02-season-management.md` — 赛季列表、新建/编辑、段位重置规则、奖励配置、赛季操作（开始/结束 5 步链）、赛季报告完整 PRD
- 产品需求: `product/admin/04-admin-game-system/00-index.md` §二 — 功能清单总览（#4~#5 赛季管理, #12 赛季报告）
- 产品需求: `product/admin/04-admin-game-system/07-system-logs.md` §二.2 — 赛季管理数据流
- 产品需求: `product/admin/04-admin-game-system/07-system-logs.md` §三.3 — 赛季结束事务一致性要求
- 产品总纲: `product/00-product-overview.md` §五.4 — 段位体系（青铜→白银→黄金→铂金→钻石→星耀→王者，赛季 3 个月，段位软重置）
- 架构白皮书: `grules/01-rules.md` §三 — 并发安全（SELECT ... FOR UPDATE / 乐观锁）
- API 设计: `grules/04-api-design.md` — RESTful 统一响应格式
- 编码规范: `grules/05-coding-standards.md` §三 — 后端分层、事务处理
- 关联任务: 前置 T06-002（seasons 表 + 段位相关表）、T11-003（管理员权限中间件）→ 后续 T14-008（前端赛季管理页）

## 技术方案

### API 端点设计

```
GET    /api/v1/admin/seasons                     — 赛季列表（分页+排序）
GET    /api/v1/admin/seasons/current              — 当前进行中赛季
GET    /api/v1/admin/seasons/:id                  — 赛季详情（含重置规则+奖励配置）
POST   /api/v1/admin/seasons                      — 新建赛季
PUT    /api/v1/admin/seasons/:id                  — 编辑赛季
POST   /api/v1/admin/seasons/:id/start            — 手动开始赛季
POST   /api/v1/admin/seasons/:id/end              — 手动结束赛季（5步链式操作）
GET    /api/v1/admin/seasons/:id/report           — 赛季报告
GET    /api/v1/admin/seasons/:id/end-progress     — 赛季结束进度查询
```

### 赛季数据模型

```typescript
interface Season {
  id: string
  season_number: string           // 自动生成 S001, S002...
  name: string                    // 赛季名称
  start_date: string              // 起始日期 YYYY-MM-DD
  end_date: string                // 结束日期 YYYY-MM-DD
  status: SeasonStatus            // 待开始 | 进行中 | 已结束
  reset_rules: ResetRule[]        // 段位重置规则
  rewards: SeasonReward[]         // 赛季奖励配置
  participant_count?: number      // 参与人数（已结束时有值）
  created_at: string
  updated_at: string
}

type SeasonStatus = 'pending' | 'active' | 'ended'

interface ResetRule {
  current_tier: Tier              // 当前大段
  reset_to: string                // 重置到的具体小段（如 'gold_3'）
}

interface SeasonReward {
  tier: Tier                      // 段位
  coin_reward: number             // 知语币奖励数量
  skin_id?: string                // 专属皮肤 ID（可选）
}

type Tier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'star' | 'king'
```

### 赛季结束 5 步链式操作（核心逻辑）

```typescript
// POST /api/v1/admin/seasons/:id/end
// 事务性操作，任一步失败全部回滚

async endSeason(seasonId: string, adminId: string): Promise<void> {
  // 分布式锁：同一赛季不可同时触发结束
  // 使用 pg_advisory_lock 或 Redis 分布式锁

  await withTransaction(async (tx) => {
    // 步骤 1: 记录所有用户最终段位
    //   → 写入 season_records 表（user_id, season_id, final_tier, final_stars）
    await this.recordFinalRanks(tx, seasonId)

    // 步骤 2: 按配置发放赛季奖励
    //   → 遍历参与用户，按最终段位查找奖励配置
    //   → 发放知语币（写入 coin_transactions，事由"赛季{名称}段位奖励"）
    //   → 发放专属皮肤（写入 user_skins）
    await this.distributeRewards(tx, seasonId)

    // 步骤 3: 执行段位重置
    //   → 按 reset_rules 更新所有用户段位
    //   → 写入段位变更日志
    await this.resetRanks(tx, seasonId)

    // 步骤 4: 赛季限定皮肤下架
    //   → 关联当前赛季的限定皮肤状态 → unpublished
    await this.unpublishSeasonalSkins(tx, seasonId)

    // 步骤 5: 生成赛季报告
    //   → 统计参与人数、总对战场次、各段位分布、知语币发放量等
    //   → 写入 season_reports 表
    await this.generateReport(tx, seasonId)

    // 更新赛季状态为 ended
    await this.updateStatus(tx, seasonId, 'ended')
  })

  // 写入审计日志
  await this.auditLog(adminId, 'season_end', seasonId, { steps: 5, status: 'success' })
}
```

### 赛季结束进度追踪

```typescript
// 使用 Redis 或内存缓存记录进度（5步各自的状态）
interface EndSeasonProgress {
  season_id: string
  status: 'running' | 'completed' | 'failed'
  steps: Array<{
    step: number
    name: string
    status: 'pending' | 'running' | 'completed' | 'failed'
    error?: string
  }>
  started_at: string
  completed_at?: string
}
```

### Repository 层

```typescript
export class SeasonRepository {
  async findAll(params: SeasonListQuery): Promise<{ items: Season[]; total: number }>
  async findCurrent(): Promise<Season | null>
  async findById(id: string): Promise<Season | null>
  async create(data: SeasonCreate): Promise<Season>
  async update(id: string, data: SeasonUpdate): Promise<Season>
  async updateStatus(id: string, status: SeasonStatus): Promise<void>
  async getNextSeasonNumber(): Promise<string>
  async getReport(seasonId: string): Promise<SeasonReport | null>
}
```

### Service 层

```typescript
export class SeasonService {
  async listSeasons(query: SeasonListQuery): Promise<PageData<Season>>
  async getCurrentSeason(): Promise<Season | null>
  async getSeasonById(id: string): Promise<Season>
  async createSeason(data: SeasonCreate): Promise<Season>
  async updateSeason(id: string, data: SeasonUpdate): Promise<Season>
  async startSeason(id: string, adminId: string): Promise<void>
  async endSeason(id: string, adminId: string): Promise<void>
  async getEndProgress(id: string): Promise<EndSeasonProgress>
  async getSeasonReport(id: string): Promise<SeasonReport>
}
```

### 业务规则

- 新建赛季时起始日期必须 ≥ 今天
- 结束日期必须晚于起始日期
- 同一时间只能有一个"进行中"的赛季
- 进行中赛季只可修改名称，不可修改起止日期
- 已结束赛季所有字段只读
- 赛季结束操作加分布式锁，防止并发触发
- 赛季结束 5 步操作具有原子性，任一步失败全部回滚
- 段位重置规则：重置后段位必须 ≤ 当前段位（不可向上重置）
- 7 个段位的重置目标必须全部填写
- 奖励配置中知语币为非负整数

## 范围（做什么）

- 创建 `backend/src/repositories/season.repository.ts` — 赛季数据访问层
- 创建 `backend/src/services/season.service.ts` — 赛季业务逻辑层（含 5 步链式操作）
- 创建 `backend/src/routers/v1/admin/seasons.router.ts` — 赛季管理路由
- 创建 `backend/src/models/season.ts` — 赛季相关类型和 Zod Schema
- 修改 `backend/src/routers/v1/admin/index.ts` — 挂载 seasons 路由

## 边界（不做什么）

- 不实现前端赛季管理页面（T14-008）
- 不实现赛季自动开始/结束的定时任务（MVP 手动操作）
- 不实现赛季数据导出
- 不实现段位排名匹配系统（属于游戏端）

## 涉及文件

- 新建: `zhiyu/backend/src/repositories/season.repository.ts`
- 新建: `zhiyu/backend/src/services/season.service.ts`
- 新建: `zhiyu/backend/src/routers/v1/admin/seasons.router.ts`
- 新建: `zhiyu/backend/src/models/season.ts`
- 修改: `zhiyu/backend/src/routers/v1/admin/index.ts`

## 依赖

- 前置: T06-002（seasons / season_records / user_ranks 等表）、T11-003（adminAuthMiddleware + requireRole）
- 后续: T14-008（前端赛季管理页）、T14-012（集成验证）

## 验收标准（GIVEN-WHEN-THEN）

1. **GIVEN** 管理员已登录（游戏运营角色）  
   **WHEN** GET `/api/v1/admin/seasons?page=1&page_size=20`  
   **THEN** 返回 200，data 含赛季列表、总数、分页信息，按起始日期降序

2. **GIVEN** 管理员已登录  
   **WHEN** POST `/api/v1/admin/seasons` 发送完整赛季信息（名称、起止日期、重置规则 7 条、奖励配置 7 条）  
   **THEN** 返回 201，赛季创建成功，season_number 自动生成（如 S001），状态为 pending

3. **GIVEN** 一个状态为 pending 的赛季，且无其他进行中赛季  
   **WHEN** POST `/api/v1/admin/seasons/:id/start`  
   **THEN** 返回 200，赛季状态变为 active，起始日期更新为今天

4. **GIVEN** 已有一个进行中的赛季  
   **WHEN** 尝试开始另一个赛季  
   **THEN** 返回 409，提示"已有进行中的赛季，请先结束当前赛季"

5. **GIVEN** 一个状态为 active 的赛季  
   **WHEN** POST `/api/v1/admin/seasons/:id/end`  
   **THEN** 返回 200，5 步链式操作全部成功，赛季状态变为 ended

6. **GIVEN** 赛季结束操作正在执行中  
   **WHEN** GET `/api/v1/admin/seasons/:id/end-progress`  
   **THEN** 返回 200，包含 5 步各自的执行状态（pending/running/completed/failed）

7. **GIVEN** 赛季结束操作第 3 步失败  
   **WHEN** 检查赛季状态  
   **THEN** 赛季状态仍为 active（已回滚），错误信息记录在进度中

8. **GIVEN** 一个已结束的赛季  
   **WHEN** GET `/api/v1/admin/seasons/:id/report`  
   **THEN** 返回 200，包含参与用户数、总对战场次、知语币发放总量、各段位分布、最活跃游戏等

9. **GIVEN** 一个进行中的赛季  
   **WHEN** PUT `/api/v1/admin/seasons/:id` 尝试修改起始日期  
   **THEN** 返回 400，提示"进行中赛季不可修改起止日期"

10. **GIVEN** 创建赛季时重置规则中王者重置到钻石  
    **WHEN** POST `/api/v1/admin/seasons` reset_rules 中 king → diamond_1  
    **THEN** 返回 201，保存成功（重置后 ≤ 当前段位合法）

11. **GIVEN** 创建赛季时重置规则中青铜重置到白银  
    **WHEN** POST `/api/v1/admin/seasons` reset_rules 中 bronze → silver_3  
    **THEN** 返回 400，提示"重置后段位不可高于当前段位"

12. **GIVEN** 非管理员角色用户  
    **WHEN** 访问任何 `/api/v1/admin/seasons` 端点  
    **THEN** 返回 403

## Docker 自动化测试（强制）

> ⚠️ 绝对禁止在宿主机环境测试，必须通过 Docker 容器验证 ⚠️

### 测试步骤

1. `docker compose up -d --build` — 构建并启动所有服务
2. `docker compose ps` — 确认所有容器 Running
3. `docker compose logs --tail=30 backend` — 后端无报错
4. 登录获取管理员 Token
5. 测试创建赛季（含 7 条重置规则 + 7 条奖励配置）
6. 测试赛季列表和详情
7. 测试手动开始赛季
8. 测试并发赛季冲突检测
9. 测试赛季结束 5 步链式操作
10. 测试赛季结束进度查询
11. 测试赛季报告查看
12. 测试进行中赛季编辑限制

### 测试通过标准

- [ ] TypeScript 零编译错误
- [ ] Docker 构建成功，所有容器 Running
- [ ] 赛季 CRUD 全部正常
- [ ] 手动开始赛季正确更新状态和起始日期
- [ ] 赛季结束 5 步链式操作全部成功
- [ ] 事务原子性：步骤失败时正确回滚
- [ ] 分布式锁防止并发结束
- [ ] 段位重置规则校验正确
- [ ] 赛季报告数据准确
- [ ] 所有写操作记录审计日志
- [ ] 控制台无 Error 级别日志

### 测试不通过处理

- 发现问题 → 立即修复 → 重新 Docker 构建 → 重新验证全部
- 同一问题 3 次修复失败 → 标记阻塞，停止任务

## 执行结果报告

结果文件路径: `/tasks/result/14-admin-game-system/T14-002-api-season-management.md`

## 自检重点

- [ ] 安全：赛季结束操作有分布式锁，防止并发触发
- [ ] 安全：5 步链式操作在同一事务中，原子性保障
- [ ] 性能：批量段位重置和奖励发放使用批量 SQL，避免 N+1
- [ ] 性能：赛季结束操作 10,000 用户 < 30s（PRD 性能要求）
- [ ] 类型同步：season.ts 类型与数据库 Schema 一致
- [ ] 审计日志：开始/结束/创建/编辑操作均记录
- [ ] API 规范：响应格式符合 grules/04-api-design.md
