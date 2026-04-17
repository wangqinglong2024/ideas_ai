# 规范文件索引 (Standards Index)

> **版本**: v3.0 | **最后更新**: 2026-04-17
>
> **⚡ AI 必须首先读完此文件**，理解规范体系和行为契约后再行动。
>
> **架构概要**：单服务器（`115.159.109.23`）三环境架构。基础设施（Supabase/Dify/NocoBase）仅一套，前后端按 dev/staging/prod 独立容器。

---

## ⚠️ AI 行为契约（Anti-Hallucination Protocol）

> **以下 10 条是 AI 在本项目中的铁律，违反任何一条等同于交付失败。**

| # | 规则 | 违反后果 |
|---|------|---------|
| 1 | **不确定就问，不猜测不臆造** — 对需求、表结构、字段名、API 路径有任何不确定，立即提问或用工具查证 | 臆造的代码 100% 返工 |
| 2 | **先查后建** — 写任何新代码前，先搜索项目内是否已有类似实现（utils/hooks/services），先查 Supabase 有无原生能力 | 重复造轮子 = 技术债 |
| 3 | **规范先行** — 编码前读 `coding-standards.md`，设计前读 `ui-design.md`，测试前读 `qa-testing.md` | 不读规范写的代码不予接受 |
| 4 | **原子提交** — 一个 commit = 一个逻辑变更，每个 commit 独立可编译可回退 | 混合提交 = 回退灾难 |
| 5 | **Docker 唯一** — 所有测试/验证必须基于 Docker 容器，严禁宿主机裸跑 | 环境不一致 = 线上事故 |
| 6 | **三次失败即停** — 同一问题尝试 3 次仍失败，立即停下报告状态为 🚫 阻塞 | 无限循环浪费资源 |
| 7 | **不擅自扩大范围** — 只做用户要求的，不加功能不搞"顺手优化" | 范围蔓延 = 质量失控 |
| 8 | **先计划再执行** — 计划和编码严格分离，禁止边想边写（见 `task-workflow.md` §四.1） | 无计划 = 返工率翻倍 |
| 9 | **增量验证** — 每写完一个函数/组件立即验证，不要等全部写完再测（见 `task-workflow.md` §四.3） | 积压错误 = 调试地狱 |
| 10 | **上下文完整才动手** — 开始编码前必须通过 6 项上下文检查清单（见 `task-workflow.md` §一.1） | 上下文缺失 = 臆造代码 |

---

## 文件清单与阅读优先级

### 🔴 L0 — 全局必读（每个会话 / 每个项目启动时）

| 文件 | 内容 | 什么时候读 |
|------|------|-----------|
| **本文件 index.md** | 规范索引 + AI 行为契约 + 开发流水线 | **每次对话开始时** |
| [01-rules.md](01-rules.md) | 全局架构白皮书（技术栈声明 + Cosmic Refraction 设计系统技术参数 + Supabase/Express/测试哲学） | **每个项目启动时必读** |
| [env.md](env.md) | 项目凭证与配置（Supabase/Dify/微信支付等） | 需要配置连接信息时 |

### 🟠 L1 — 产品与设计阶段

| 文件 | 内容 | 什么时候读 |
|------|------|-----------|
| [03-product-design.md](03-product-design.md) | PRD 全维度规范 + Stitch 原型工作流 + MCP 调用手册 + 竞品/旅程模板 | 写需求、审查原型、管理设计系统时 |
| [06-ui-design.md](06-ui-design.md) | UI/UE 设计规范（视觉/交互/动效/响应式/无障碍） | 设计页面、审查 UI、评审原型时 |

### 🟡 L2 — 编码与开发阶段

| 文件 | 内容 | 什么时候读 |
|------|------|-----------|
| [05-coding-standards.md](05-coding-standards.md) | 编码规范 + 安全纵深体系 + 支付资金安全 + 数据库铁律 + 审查检查表 | **写任何代码前必读** |
| [09-task-workflow.md](09-task-workflow.md) | **AI 任务执行工作流**（任务拆解 + Story File + 上下文工程 + 执行协议 + 质量门禁） | **开始开发任务前必读** |
| [07-documentation-standards.md](07-documentation-standards.md) | 代码注释与文档规范 + AI 生成内容规范 | 写代码/生成文档/交付任务时 |
| [04-api-design.md](04-api-design.md) | RESTful API 设计规约 | 设计或开发 API 时 |
| [02-project-structure.md](02-project-structure.md) | 项目目录结构标准模板 | 创建新项目或新模块时 |

### 🟢 L3 — 测试与质量阶段

| 文件 | 内容 | 什么时候读 |
|------|------|-----------|
| [08-qa-testing.md](08-qa-testing.md) | QA 测试规范 + Browser MCP + Docker 强制 + 健康评分 + AI 自验证协议 | 测试任何功能时必读 |

---

## 技术栈速查

```
前端：Vite + React 19 + TypeScript 5.x + Tailwind CSS v4
后端：Express + TypeScript + Node.js 22+（全异步）
数据库：Supabase（PostgreSQL + Auth + Storage + Realtime）
容器化：Docker + Docker Compose
网关：Nginx 反向代理
AI 工作流：Dify
原型设计：Stitch（通过 MCP 集成）
数据校验：Zod（前后端共享 Schema）
状态管理：TanStack Query + React Context
```

---

## AI 标准开发流水线（v3.0）

> AI 从需求到交付的完整工作流。每个阶段有明确的输入、输出和质量门禁（Gate），严禁跳过。
> **详细的任务执行协议见 → `task-workflow.md`**

```
┌─────────────────────────────────────────────────────────────────┐
│                    AI 标准开发流水线 v3.0                         │
│                                                                 │
│  ❶ 预检          加载规范 + 确认上下文                            │
│      ↓ Gate 0     上下文完整性检查通过                            │
│  ❷ 需求理解       读取 PRD / 用户描述 → 复述确认                  │
│      ↓ Gate 1     用户确认理解无偏差                              │
│  ❸ PRD 优化       按 product-design.md 8 维度检查                │
│      ↓ Gate 2     8 维度全部达标                                 │
│  ❹ 原型审查       Stitch 原型 ↔ PRD 一致性 + UI 规范合规         │
│      ↓ Gate 3     审查报告通过                                   │
│  ❺ 技术分析       模块拆解 + 数据库设计 + API 清单 + 风险评估      │
│      ↓ Gate 4     技术方案用户确认                                │
│  ❻ 任务拆解       按依赖关系拆分原子任务 → Story File              │
│      ↓ Gate 5     任务清单含验收标准                              │
│  ❼ 逐任务开发     基础设施 → DB → 后端 → 前端 → 集成              │
│      ↓ Gate 6     每任务完成后 Docker 构建 + 自检清单通过          │
│  ❽ QA 测试        Docker + Browser MCP 全链路验证                 │
│      ↓ Gate 7     健康评分 ≥ 90 分                               │
│  ❾ 交付确认       代码审查检查表 + 完成状态声明                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 阶段详解

#### ❶ 预检（Pre-flight Check）
```
□ 已读取 index.md（本文件）
□ 已读取 rules.md（架构白皮书）
□ 已确认目标项目的技术栈和环境配置
□ 如涉及数据库，已通过 MCP 查明当前 Schema
□ 如涉及已有代码，已搜索项目内相关文件
```
- **Gate 0**：上下文完整，可以开始分析

#### ❷ 需求理解
- 读取用户提供的需求描述或 PRD 文件
- 用自己的话复述需求，确认理解无偏差
- 列出"不做什么"（明确排除范围）
- 如有歧义，**立即提问**，不擅自假设
- **Gate 1**：用户确认理解无偏差

#### ❸ PRD 优化（参照 `product-design.md`）
- 按 8 维度检查矩阵逐项审查
- 补全信息架构、状态矩阵、用户动线
- 输出优化后的 PRD 保存到 `product/prd-{项目名}.md`
- **Gate 2**：8 维度全部达标后方可进入下一阶段

#### ❹ 原型审查（参照 `product-design.md` + `ui-design.md`）
- 检查 Stitch 原型与 PRD 的一致性
- 检查 Cosmic Refraction 设计系统合规性
- 如无原型，从 PRD 生成原型
- **Gate 3**：原型审查通过后方可进入技术分析

#### ❺ 技术分析
- 从 PRD 功能清单推导出：功能模块划分、数据库表设计、API 端点清单
- 绘制核心数据流图
- 标记技术风险点和依赖关系
- **评估复杂度**：简单（< 3 文件）/ 中等（3-10 文件）/ 复杂（> 10 文件）
- **参照**：`rules.md`（架构哲学）+ `coding-standards.md`（安全/数据库铁律）
- **Gate 4**：技术方案获得用户确认

#### ❻ 任务拆解（参照 `task-workflow.md`）
- 每个任务 = 一个可独立验证的最小功能单元
- 任务按依赖关系排序：基础设施 → 数据库 → 后端 API → 前端页面 → 集成联调
- 每个任务必须包含：范围、涉及文件、GIVEN-WHEN-THEN 验收标准
- 复杂任务必须生成 Story File（见 `task-workflow.md`）
- **Gate 5**：任务清单完整且含验收标准

任务拆解模板：
```markdown
### T-{模块}.{序号}: {任务标题}
- **复杂度**：简单 / 中等 / 复杂
- **范围**：{具体要做什么}
- **涉及文件**：
  - 前端：`src/features/{module}/...`
  - 后端：`src/services/{module}-service.ts`
  - 数据库：`supabase/migrations/...`
- **验收标准（GIVEN-WHEN-THEN）**：
  1. GIVEN {前置条件} WHEN {操作} THEN {预期结果}
  2. GIVEN {异常条件} WHEN {操作} THEN {错误处理}
- **依赖**：T-{x}.{y}（如有）
- **自检重点**：安全 / 性能 / 类型同步（标注该任务需要特别注意的维度）
```

#### ❼ 逐任务开发
严格按以下顺序执行每个任务：

```
1. 创建数据库迁移文件 → MCP 执行 → 同步三端类型
2. 编写后端 Repository → Service → Router
3. 编写前端 Service → Hook → 组件 → 页面
4. Docker 构建验证：docker compose up -d --build
5. 代码审查检查表自查（coding-standards.md §代码审查自检清单）
6. 增量验证：每写完一个函数/组件立即验证
7. 标记任务完成
```

**开发纪律**：
- 一个任务一个 commit，禁止跨任务混合提交
- 每个 commit 后 Docker 构建必须成功（零编译错误）
- 前端代码必须通过 `npm run build`
- 后端代码必须通过 TypeScript 编译
- **增量验证**：每写完一个函数/组件立即验证，不要等全部写完再测
- **Gate 6**：Docker 构建成功 + 自检清单全绿

#### ❽ QA 测试（参照 `qa-testing.md`）
- 所有测试基于 Docker 环境，**严禁宿主机裸跑**
- 使用 Browser MCP 执行端到端验证
- 输出健康评分，≥ 90 分方可交付
- **Gate 7**：健康评分达标

#### ❾ 交付确认
输出交付清单：

```markdown
## 交付清单

### 新增/修改文件
- `file-path` — 说明

### 验收方式
1. 启动命令
2. 访问地址
3. 预期效果

### 完成状态
✅ 完成 / ⚠️ 完成但有顾虑 / 🚫 阻塞 / ❓ 需要上下文

### 遗留风险（如有）
- {风险描述} — {建议处理方式}
```

---

## AI 升级机制与停止信号

| 状态 | 含义 | 触发条件 |
|------|------|---------|
| ✅ **完成** | 全部步骤成功，有验证证据 | 代码写完、测试通过、自检清单全绿 |
| ⚠️ **完成但有顾虑** | 已完成，但有需注意的问题 | 主路径可用但存在已知边界限制 |
| 🚫 **阻塞** | 无法继续，需要外部输入 | 缺少凭证、依赖服务不可达、需求不明确 |
| ❓ **需要上下文** | 缺少必要信息 | 不确定产品意图、不确定技术选型 |

**升级规则**：
- 同一问题尝试 **3 次**仍失败 → 立即停下，报告 🚫 阻塞
- 涉及安全敏感变更 → 不擅自行动，报告 ❓ 需要上下文
- 影响范围超出当前任务边界 → 标记 ⚠️ 完成但有顾虑
- 累计修改超过 **15 个文件** → 暂停，检查是否偏离任务范围

---

## 全流程覆盖验证

```
💡 想法 ──→ product-design.md（PRD 优化 + 8 维度门禁）
🎨 设计 ──→ ui-design.md（视觉/交互/动效/响应式/无障碍设计标杆）
         + rules.md §一（Cosmic Refraction 技术参数）
         + product-design.md §二-三（Stitch 原型工作流 + 设计系统同步）
💻 编码 ──→ coding-standards.md（命名/安全/Git/支付）
         + task-workflow.md（任务执行协议 + Story File + 上下文工程）
         + documentation-standards.md（注释/文档/AI 输出规范）
         + api-design.md（API 设计规约）
         + project-structure.md（目录结构模板）
🧪 测试 ──→ qa-testing.md（Browser MCP + Docker 强制 + AI 自验证协议）
⚙️ 配置 ──→ env.md（凭证）
```

---

## 新项目启动快速指引

```
1. 把 grules/ 整个目录复制到新项目（或保持在公共位置引用）
2. AI 读取 index.md → rules.md → env.md（L0 全局必读）
3. 在 product/ 目录写好产品需求文档（按 product-design.md 规范优化）
4. 页面设计按 ui-design.md 的视觉体系和交互规范执行
5. 如有 Stitch 原型，按 product-design.md 的流程审查
6. 阅读 task-workflow.md，按上下文工程方法拆解任务
7. 所有代码遵循 coding-standards.md + documentation-standards.md
8. 按 project-structure.md 创建项目骨架 + Docker 基础设施
9. 开始按本文件「AI 标准开发流水线」的 9 个阶段推进
```
