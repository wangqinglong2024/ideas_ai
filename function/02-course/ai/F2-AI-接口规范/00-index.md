# F2-AI：接口规范 · 索引

> ⚠️ **2025-11 变更**：系统内生成工作台已移除；管理端内容不再有集中处理队列，统一按 `is_published` 发布状态控制可见性。
> 详见 [./CHANGELOG-2025-11.md](../CHANGELOG-2025-11.md)。

> **功能**：课程学习引擎（中文学习 · 4 大主题 · 共享预备阶段）
> **来源**：[../../../temp/05-用户端模块设计.md](../../../temp/05-用户端模块设计.md) · [../../../temp/04-管理端模块设计.md](../../../temp/04-管理端模块设计.md) · [../../../temp/06-关键业务流程.md](../../../temp/06-关键业务流程.md) · [../F1-AI-数据模型规范/](../F1-AI-数据模型规范/)
> **遵循规范**：[../../../grules/G1-架构与技术规范/04-API接口规范.md](../../../grules/G1-架构与技术规范/04-API接口规范.md)
> **基础路径**：C 端 `/api/v1/course`、管理端 `/admin/v1/course`、内部 `/internal/v1/course`
> **拆分原则**：按"应用端 / 管理端 / 横切"分组，每文件 ≤ 1200 行

---

## 子文件导航

| # | 文件 | 内容 |
|---|------|------|
| 总览 | [00-index.md](./00-index.md) | 全部接口一览表（本文件） |
| 应用端 | [01-应用端-学习地图与节学习.md](./01-应用端-学习地图与节学习.md) | 选主题、学习地图、进入节、获取 KP 卡片、TTS 触发 |
| 应用端 | [02-应用端-答题与SRS.md](./02-应用端-答题与SRS.md) | 节末小测、提交答案、SRS 复习队列、错题本 |
| 应用端 | [03-应用端-考试与举报.md](./03-应用端-考试与举报.md) | 章测试 / 阶段考试 / HSK 模考、举报题目、个人统计 |
| 管理端 | [04-管理端-课程目录.md](./04-管理端-课程目录.md) | tracks / stages / chapters / lessons CRUD + 调序 |
| 管理端 | [05-管理端-KP与题目CRUD.md](./05-管理端-KP与题目CRUD.md) | KP 列表/详情/编辑/归档；题目列表/编辑/新建 |
| 管理端 | [06-管理端-内容导入.md](./06-管理端-内容导入.md) | KP / 题目 / 考试配置批量导入与校验 |
| 管理端 | [07-管理端-发布与举报处理.md](./07-管理端-发布与举报处理.md) | 发布/下架 + 学员举报处理 |
| 管理端 | [08-管理端-媒资与考试中心.md](./08-管理端-媒资与考试中心.md) | 媒资库去重/上传；考试中心分层配置与试抽 |
| 横切 | [09-内部任务接口.md](./09-内部任务接口.md) | 健康检查、考试超时、媒资清理等内部任务 |
| 横切 | [10-并发与冲突处理.md](./10-并发与冲突处理.md) | 多管理员编辑、考试限时锁 |
| 横切 | [11-错误码登记.md](./11-错误码登记.md) | 本功能新增 `COURSE_*` 错误码集中登记 |
| — | [12-待确认问题清单.md](./12-待确认问题清单.md) | F2 反向补丁封板清单 |

---

## 全部接口一览

### 应用端（C 端，`/api/v1/course`）

| # | 名称 | 方法 | 路径 | 权限 | 对应需求 |
|---|------|------|------|------|---------|
| C1 | 列出 5 主题 | GET | `/api/v1/course/tracks` | 公开 | [temp/05 §5.2](../../../temp/05-用户端模块设计.md) |
| C2 | 切换/选择当前主题 | POST | `/api/v1/course/me/select-track` | 登录 | [temp/05 §5.2](../../../temp/05-用户端模块设计.md) |
| C3 | 学习地图（主题下全部 stage/chapter/lesson + 进度） | GET | `/api/v1/course/tracks/:track/map` | 登录 | [temp/05 §5.4](../../../temp/05-用户端模块设计.md) |
| C4 | 进入节（取节卡片列表 + 上次断点） | GET | `/api/v1/course/lessons/:lesson_id` | 登录 | [temp/05 §5.5](../../../temp/05-用户端模块设计.md) |
| C5 | 获取 KP 详情（含 7 类差异内容） | GET | `/api/v1/course/kps/:kp_id` | 登录 | [temp/05 §5.5.1](../../../temp/05-用户端模块设计.md) |
| C6 | 触发/获取 KP 朗读音频 | POST | `/api/v1/course/kps/:kp_id/audio` | 登录 | [temp/05 §5.5.2](../../../temp/05-用户端模块设计.md) |
| C7 | 上报节内位置（断点续学） | PUT | `/api/v1/course/lessons/:lesson_id/checkpoint` | 登录 | [temp/05 §5.5.3](../../../temp/05-用户端模块设计.md) |
| C8 | 取节末小测题目 | GET | `/api/v1/course/lessons/:lesson_id/quiz` | 登录 | [temp/05 §5.6](../../../temp/05-用户端模块设计.md) |
| C9 | 提交单题答案（练习/小测/复习） | POST | `/api/v1/course/answers` | 登录 | [temp/06 §6.7 流程 F](../../../temp/06-关键业务流程.md) |
| C10 | 提交节末小测（汇总打分） | POST | `/api/v1/course/lessons/:lesson_id/quiz:submit` | 登录 | [temp/06 §6.7 流程 F](../../../temp/06-关键业务流程.md) |
| C11 | 取 SRS 复习队列（今日待复习） | GET | `/api/v1/course/srs/queue` | 登录 | [temp/06 §6.8 流程 G](../../../temp/06-关键业务流程.md) |
| C12 | 错题本列表 | GET | `/api/v1/course/me/wrong-questions` | 登录 | [temp/05 §5.8](../../../temp/05-用户端模块设计.md) |
| C13 | 列出可参加的考试（章/阶段/HSK） | GET | `/api/v1/course/exams` | 登录 | [temp/05 §5.7](../../../temp/05-用户端模块设计.md) |
| C14 | 开始考试（抽题 + 创建 attempt） | POST | `/api/v1/course/exams/:exam_id:start` | 登录 | [temp/06 §6.9 流程 H](../../../temp/06-关键业务流程.md) |
| C15 | 取当前 attempt 题目 | GET | `/api/v1/course/exam-attempts/:attempt_id` | 登录 | 同上 |
| C16 | 提交考试 | POST | `/api/v1/course/exam-attempts/:attempt_id:submit` | 登录 | 同上 |
| C17 | 主动放弃考试 | POST | `/api/v1/course/exam-attempts/:attempt_id:abandon` | 登录 | 同上 |
| C18 | 举报题目内容错误 | POST | `/api/v1/course/questions/:q_id:report` | 登录 | [temp/05 §5.9](../../../temp/05-用户端模块设计.md) |
| C19 | 个人学习统计 | GET | `/api/v1/course/me/stats` | 登录 | [temp/05 §5.10](../../../temp/05-用户端模块设计.md) |

### 管理端（`/admin/v1/course`）

| # | 名称 | 方法 | 路径 | 权限 | 对应需求 |
|---|------|------|------|------|---------|
| A1 | 列出主题 | GET | `/admin/v1/course/tracks` | content_admin+ | [temp/04 §4.2](../../../temp/04-管理端模块设计.md) |
| A2 | 阶段 CRUD | GET/POST/PATCH/DELETE | `/admin/v1/course/stages[/:id]` | content_admin+ | 同上 |
| A3 | 章节 CRUD + 调序 | GET/POST/PATCH/DELETE | `/admin/v1/course/chapters[/:id]` `/...:reorder` | content_admin+ | [temp/04 §4.3](../../../temp/04-管理端模块设计.md) |
| A4 | 节 CRUD + 调序 + 关联 KP | GET/POST/PATCH/DELETE | `/admin/v1/course/lessons[/:id]` `/...:reorder` `/...:bind-kps` | content_admin+ | [temp/04 §4.3](../../../temp/04-管理端模块设计.md) |
| A5 | KP 列表（多筛选） | GET | `/admin/v1/course/kps` | content_admin+ | [temp/04 §4.4](../../../temp/04-管理端模块设计.md) |
| A6 | KP 详情 | GET | `/admin/v1/course/kps/:id` | content_admin+ | 同上 |
| A7 | 新建 KP（人工） | POST | `/admin/v1/course/kps` | content_admin+ | 同上 |
| A8 | 编辑 KP | PATCH | `/admin/v1/course/kps/:id` | content_admin+ | 同上 |
| A9 | 软删 KP | DELETE | `/admin/v1/course/kps/:id` | content_admin+ | 同上 |
| A10 | 题目列表 | GET | `/admin/v1/course/questions` | content_admin+ | [temp/04 §4.5](../../../temp/04-管理端模块设计.md) |
| A11 | 题目详情 | GET | `/admin/v1/course/questions/:id` | content_admin+ | 同上 |
| A12 | 编辑题目 | PATCH | `/admin/v1/course/questions/:id` | content_admin+ | 同上 |
| A13 | 新建题目 | POST | `/admin/v1/course/questions` | content_admin+ | 同上 |
| A14 | 软删题目 | DELETE | `/admin/v1/course/questions/:id` | content_admin+ | 同上 |
| A15 | 内容导入批次 | GET/POST | `/admin/v1/course/import-batches[/:id]` | content_admin+ | [temp/04 §4.6](../../../temp/04-管理端模块设计.md) |
| A16 | 发布 / 下架（KP/Q/Lesson/Exam） | POST | `/admin/v1/course/:target_type/:id:publish` `:unpublish` | content_admin+ | [F2/07](./07-管理端-发布与举报处理.md) |
| A17 | 内容操作日志 | GET | `/admin/v1/course/action-log` | content_admin+ | 同上 |
| A18 | 学员举报列表 | GET | `/admin/v1/course/reports` | content_admin+ | 同上 |
| A19 | 处理举报（忽略 / 采纳） | POST | `/admin/v1/course/reports/:id:dismiss` `:adopt` | content_admin+ | 同上 |
| A20 | 媒资库（去重上传 / 列表 / 删除） | GET/POST/DELETE | `/admin/v1/course/media[/:id]` | content_admin+ | [temp/04 §4.8](../../../temp/04-管理端模块设计.md) |
| A21 | 考试中心配置 CRUD | GET/POST/PATCH/DELETE | `/admin/v1/course/exams[/:id]` | content_admin+ | [temp/04 §4.9](../../../temp/04-管理端模块设计.md) |
| A22 | 考试试抽预览 | POST | `/admin/v1/course/exams/:id:preview` | content_admin+ | 同上 |
| A23 | 全局搜索（KP/Q/Lesson 聚合） | GET | `/admin/v1/course/search` | content_admin+ | [temp/04 §4.10](../../../temp/04-管理端模块设计.md) |
| A24 | 统计大屏 | GET | `/admin/v1/course/stats/overview` `/stats/track/:track` | readonly+ | [temp/04 §4.11](../../../temp/04-管理端模块设计.md) |

### 横切（内部 / 集成）

| # | 名称 | 方法 | 路径 | 权限 | 用途 |
|---|------|------|------|------|------|
| I1 | 预留内部回调 | POST | — | service-role | 暂不开放 |
| I4 | 健康检查 | GET | `/api/v1/course/health` | 公开 | 标准 200 |

---

## 全局约定（本功能内）

- 路径中 `:lesson_id / :kp_id / :id` 一律 UUID；学员侧若使用 `lesson_code` 入口，由前端先调 C3 学习地图取 id
- 多语言：响应中 `_i18n` 字段下发完整 5 key（`zh/vi/th/id/en`，[F1-12-Q10](../F1-AI-数据模型规范/12-待确认问题清单.md) 封板，与 china 域 + [grules/G1-03 §八](../../../grules/G1-架构与技术规范/03-数据库规范.md) 一致）；学习目标本体的中文原文额外暴露独立列 `title_zh / word_zh / sentence_zh`（不可变）；`_i18n.zh` 是 UI 文案（可改）
- 分页：所有列表统一 `page` / `page_size`（默认 20，上限 100）
- 排序：`sort` 仅接受白名单字段，违规返 `40002 SORT_FIELD_NOT_ALLOWED`
- 时间：ISO-8601 +08:00
- C 端读侧 RLS：仅 `is_published=true AND deleted_at IS NULL`
- 管理端写侧：必须 `Authorization: Bearer <admin_token>`，由 `apps/api-admin` 中间件校验角色
- 编辑冲突：以最后保存为准 + 提示（详见 [10-并发与冲突处理.md](./10-并发与冲突处理.md)）
- **统一响应封装**（[grules/G1-04 §3](../../../grules/G1-架构与技术规范/04-API接口规范.md)）：所有响应注入 `request_id` + `server_time`，本文件示例省略
- **限流**（G1-04 §六 + [12-Q11](./12-待确认问题清单.md) 封板）：
  - **学员端**：默认 IP 60/分、用户 120/分；C9 提交答案 用户 600/分；C11 SRS 队列 单日上限 50；A24 全局搜索 用户 30/分
  - **管理端**：业务不限流（仅 admin token 鉴权；nginx 层默认 600/分作 DDoS 兜底）
  - 内容导入按文件大小和批次排队，不走用户侧限流

---

## 跨域调用清单

| 调用方 | 被调用 | 用途 |
|--------|-------|------|
| `apps/web-app` | `/api/v1/course/*` | 学员端全部交互 |
| `apps/web-admin` | `/admin/v1/course/*` | 管理端全部交互 |
| `scripts/cron` | `/internal/v1/course/exam-attempts:expire` | 考试限时到期标记 |

---

## 版本与兼容性

- 当前版本 `v1`
- 破坏性变更需新版本路径（如 `/v2/course/lessons/...`）
- `v1` 至少保留 12 个月并行
