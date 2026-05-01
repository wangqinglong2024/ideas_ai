# 管理端：KP 与题目 CRUD

> 内容生产侧的 KP / Question 管理。所有写操作需 `content_admin+`。系统内不提供题目重生任务。

---

## A5 · KP 列表

**方法**：GET
**路径**：`/admin/v1/course/kps`
**权限**：`readonly+`

**请求参数**：

| 参数 | 类型 | 说明 |
|------|------|------|
| `track` | enum | 5 主题 |
| `stage_id` / `chapter_id` / `lesson_id` | uuid | 联动筛选 |
| `kp_type` | enum | 7 类 |
| `is_published` | bool | — |
| `q` | string | 模糊匹配 `title_zh / kp_code` |
| `page` / `page_size` | int | — |
| `sort` | enum | 白名单 `created_at/updated_at/kp_code` |

**响应 200**：

```json
{
  "code": 0,
  "data": {
    "items": [
      {
        "kp_id": "<uuid>",
        "kp_code": "kp_ec_word_000123",
        "kp_type": "word",
        "track": "ec",
        "title_zh": "你好",
        "translation_summary_i18n": { "vi":"xin chào","en":"hello", ... },
        "is_published": true,
        "linked_lessons_count": 2,
        "questions_count": 8,
        "created_at": "...",
        "source_batch_id": "<uuid|null>"
      }
    ],
    "pagination": { "page":1, "page_size":20, "total":520 }
  }
}
```

---

## A6 · KP 详情

**方法**：GET
**路径**：`/admin/v1/course/kps/:id`
**权限**：`readonly+`

**响应 200**：完整 `content` jsonb + `media` + 关联 `linked_lessons` 列表 + `version` 历史（最近 5 条）+ 关联 `questions` 简表。

---

## A7 · 新建 KP（人工）

**方法**：POST
**路径**：`/admin/v1/course/kps`
**权限**：`content_admin+`

**请求体**：

```json
{
  "kp_type": "word",
  "track": "ec",
  "title_zh": "你好",
  "content": {
    "word_zh": "你好",
    "pinyin": "nǐ hǎo",
    "pos": "感叹词",
    "translation_i18n": { "vi":"xin chào","th":"...","id":"...","en":"hello" },
    "examples": [...]
  }
}
```

**业务校验**：
- `content` 必须匹配 `kp_type` schema（[F1-09 §5](../F1-AI-数据模型规范/09-校验规则汇总.md)）
- 自动生成 `kp_code`（[F1-10 §2](../F1-AI-数据模型规范/10-编号生成规则.md)）
- 新建后 `is_published=false`，管理端显示「待发布」

**响应 201**：返回新建对象。

---

## A8 · 编辑 KP

**方法**：PATCH
**路径**：`/admin/v1/course/kps/:id`
**权限**：`content_admin+`

**业务校验**：
- 编辑直接更新原行并 `version+=1`。
- 是否对学员可见只由发布接口 A16 控制；普通编辑不自动切换 `is_published`。
- 结构性字段（`kp_type / kp_code`）直接拒绝（`409 COURSE_FIELD_IMMUTABLE`）。

**请求体**：仅传变更字段。

**响应 200**：

```json
{ "code": 0, "data": { "kp_id":"<uuid>", "version": 3, "branched_from": "<old_id|null>" } }
```

**编辑冲突**：详见 [10-并发与冲突处理.md](./10-并发与冲突处理.md)；本接口要求 header `If-Match: <updated_at>`，不一致返 `409 COURSE_STALE_VERSION`。

---

## A9 · 软删 KP

**方法**：DELETE
**路径**：`/admin/v1/course/kps/:id`
**权限**：`content_admin+`

**业务校验**：仍被任何 lesson 引用 → `409 COURSE_KP_STILL_REFERENCED`（前端先解绑）

**响应 200**：`{ "code":0, "data": { "soft_deleted": true } }`

---

## A10 · 题目列表

**方法**：GET
**路径**：`/admin/v1/course/questions`
**权限**：`readonly+`

**请求参数**（同 A5 风格）：`kp_id / track / q_type / is_published / q (模糊 q_code+stem_zh) / page / sort`。

**响应 200**：与 A5 类似，含 `q_code / q_type / kp_id / kp_title_zh / is_published / wrong_rate（最近 30 天，便于发现"问题题"）`。

**引用关系**：同一道题可同时被节测、章测、阶段测引用；是否参与某类测试由题目 `exam_scope` 与对应考试配置的抽题范围共同决定。题目下架后立即从所有新抽题池排除，历史 attempt snapshot 不回溯修改。

---

## A11 · 题目详情

**方法**：GET
**路径**：`/admin/v1/course/questions/:id`

**响应 200**：完整 `payload` jsonb + `correct_answer` + `explanation_i18n` + `media` + 关联 KP 摘要 + `version` 历史 + 最近 7 天作答统计 (`accuracy / count`)。

---

## A12 · 编辑题目

**方法**：PATCH
**路径**：`/admin/v1/course/questions/:id`
**权限**：`content_admin+`

**业务校验**：
- `payload` 必须匹配 `q_type` schema
- 编辑逻辑同 A8，直接更新原行并 `version+=1`
- `correct_answer` 修改时，前端必须二次确认（影响历史正确率统计）

---

## A13 · 新建题目

**方法**：POST
**路径**：`/admin/v1/course/questions`
**权限**：`content_admin+`

**业务校验**：
- `kp_id` 必须存在。
- `payload` 必须匹配 `q_type` schema。
- `exam_scope` 至少包含 1 个可抽层级。
- 新建后 `is_published=false`，管理端显示「待发布」。

**响应 201**：返回新建题目对象。

---

## A14 · 软删题目

**方法**：DELETE
**路径**：`/admin/v1/course/questions/:id`
**权限**：`content_admin+`

**业务校验**：题被流水（course_user_answers）引用即可软删；物理清理由 cron 在 30 天后处理。

---

## KP / 题目发布与下架（通过 A16）

KP 与题目的发布 / 下架统一通过 [07-管理端-发布与举报处理.md](./07-管理端-发布与举报处理.md) 的 A16 完成：

| Target | 路径 | 行为 |
|---|---|---|
| kp | `/admin/v1/course/kp/:id:publish` / `:unpublish` | KP 可单独发布或下架；下架后不在学员端展示 |
| question | `/admin/v1/course/question/:id:publish` / `:unpublish` | 题目可单独发布或下架；下架后不再进入节测、章测、阶段测抽题池 |

节发布会默认发布节下绑定 KP 与这些 KP 下可抽层级合法的题目；之后运营仍可在 P-A-4 / P-A-5 单独下架某个 KP 或题目。列表页必须提供行内「发布 / 下架」按钮，编辑抽屉里的「保存」不改变 `is_published`。

题目下架后的分数由考试运行时动态重算：试卷满分保持 `total_score`（默认 100），有效题数为当前抽中的已发布题数，单题分 `total_score / effective_question_count`。

---

## 共通错误

| HTTP | code | 触发 |
|------|------|------|
| 400 | `COURSE_KP_CONTENT_SCHEMA_MISMATCH` | content 不匹配 kp_type |
| 400 | `COURSE_PAYLOAD_SCHEMA_MISMATCH` | payload 不匹配 q_type |
| 401 | 40101 | 未登录 |
| 403 | `COURSE_ADMIN_ONLY` | 角色不足 |
| 404 | 40400 | 实体不存在 |
| 409 | `COURSE_STALE_VERSION` | 编辑冲突（最后保存为准 + 提示） |
| 409 | `COURSE_KP_STILL_REFERENCED` | KP 仍被节绑定 |
| 409 | `COURSE_FIELD_IMMUTABLE` | 不可改字段 |
