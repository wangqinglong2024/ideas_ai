# 04 · API 接口规范

> 引用：[00-index.md](./00-index.md)
> 适用：`apps/api-app`（C 端）与 `apps/api-admin`（后台）

---

## 一、基础约定

| 项目 | 约定 |
|------|------|
| 基础路径（C 端） | `/api/v1` |
| 基础路径（后台） | `/admin/v1` |
| 协议 | HTTPS（生产）/ HTTP（dev 容器内） |
| 请求格式 | `application/json; charset=utf-8`（文件上传 `multipart/form-data`）|
| 响应格式 | `application/json; charset=utf-8` |
| 字符编码 | UTF-8 |
| 时间格式 | ISO-8601 带时区，如 `2026-04-28T10:00:00+08:00` |
| 时区 | 服务端存储 UTC，输出按用户 locale 时区；DB 字段全部 `timestamptz` |
| 鉴权 | `Authorization: Bearer <supabase_access_token>` |
| 语言协商 | `Accept-Language: zh-CN \| en \| vi \| th \| id`，未带默认 `en` |
| 幂等 | 写接口可选 `Idempotency-Key` 头；支付/扣费**强制要求** |
| 请求 ID | 入口注入 `X-Request-Id`，回写响应头，贯穿日志 |

---

## 二、URL 命名规则

- 资源名：**复数 + kebab-case**，例：`/courses`、`/game-sessions`。
- 嵌套深度 ≤ 2 级。
- 子操作（非 CRUD）使用动词，置于资源末段，例：`POST /orders/:id/refund`。

| 操作 | 方法 | 格式 | 示例 |
|------|------|------|------|
| 列表 | GET | `/{resources}` | `GET /api/v1/courses?page=1&page_size=20` |
| 详情 | GET | `/{resources}/{id}` | `GET /api/v1/courses/abc-123` |
| 创建 | POST | `/{resources}` | `POST /api/v1/courses` |
| 全量替换 | PUT | `/{resources}/{id}` | `PUT /api/v1/courses/abc-123` |
| 部分修改 | PATCH | `/{resources}/{id}` | `PATCH /api/v1/courses/abc-123` |
| 删除 | DELETE | `/{resources}/{id}` | `DELETE /api/v1/courses/abc-123` |
| 子资源 | GET/POST | `/{resources}/{id}/{sub}` | `POST /api/v1/courses/abc-123/lessons` |
| 特殊操作 | POST | `/{resources}/{id}/{verb}` | `POST /api/v1/orders/abc-123/refund` |
| 批量操作 | POST | `/{resources}:batch-{verb}` | `POST /api/v1/notifications:batch-read` |

---

## 三、统一响应格式

### 3.1 成功（单对象）

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "id": "abc-123",
    "title": "HSK 1 入门"
  },
  "request_id": "req_01HX...",
  "server_time": "2026-04-28T10:00:00+08:00"
}
```

### 3.2 列表（含分页）

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "items": [ { "id": "..." } ],
    "pagination": {
      "page": 1,
      "page_size": 20,
      "total": 134,
      "total_pages": 7,
      "has_next": true
    }
  },
  "request_id": "req_01HX...",
  "server_time": "2026-04-28T10:00:00+08:00"
}
```

### 3.3 错误

```json
{
  "code": 40001,
  "message": "参数 email 不合法",
  "errors": [
    { "field": "email", "code": "invalid_format", "message": "Email 格式不正确" }
  ],
  "data": null,
  "request_id": "req_01HX...",
  "server_time": "2026-04-28T10:00:00+08:00"
}
```

> **HTTP 状态码** 与 `code` 一并使用，遵循 RESTful 约定（见下表）；客户端**优先以 `code` 判定业务结果**。

---

## 四、错误码体系

| HTTP | code 范围 | 说明 | 典型场景 |
|------|----------|------|---------|
| 200 | 0 | 成功 | — |
| 400 | 40000-40099 | 通用参数错误 | 字段缺失、格式错误 |
| 400 | 40100-40199 | 业务参数冲突 | 额度不足、状态不允许 |
| 401 | 40100 | 未登录 / Token 失效 | 用户未登录 |
| 401 | 40101 | Token 过期 | refresh 后重试 |
| 403 | 40300 | 无权限 | RBAC 拒绝 |
| 403 | 40301 | 实名/手机/邮箱未验证 | 业务前置校验 |
| 404 | 40400 | 资源不存在 | id 无对应记录 |
| 409 | 40900 | 冲突 | 重复创建、版本冲突 |
| 409 | 40901 | 幂等键冲突 | `Idempotency-Key` 复用 |
| 422 | 42200 | 语义校验失败 | 内容审核未过、AI 生成不合规 |
| 429 | 42900 | 限流 | 单 IP / 单用户 |
| 500 | 50000-50099 | 服务器内部错误 | 未捕获异常 |
| 502/503 | 50200/50300 | 上游错误 | 第三方/AI 不可用 |
| 504 | 50400 | 上游超时 | LLM/支付超时 |

> **业务子码**：在范围内自由分配，须在 `packages/shared-config/src/error-codes.js` 集中登记，并附 i18n 文案。

---

## 五、分页、排序、筛选

### 5.1 分页参数

| 参数 | 类型 | 默认值 | 上限 | 说明 |
|------|------|--------|------|------|
| `page` | int ≥ 1 | 1 | — | 页码 |
| `page_size` | int ≥ 1 | 20 | 100 | 每页条数 |
| `cursor` | string | — | — | 可选游标分页（高频流式列表如消息、动态）|

> 同一接口 `page` 与 `cursor` 二选一；游标分页时不返回 `total`。

### 5.2 排序

- 参数：`sort=field1,-field2`，前缀 `-` 表示降序。
- 接口必须在文档中声明可排序字段白名单，越白名单返回 `40002`。

### 5.3 筛选参数

| 类型 | 传参方式 | 示例 |
|------|---------|------|
| 精确匹配 | `field=value` | `status=published` |
| 多选（OR） | `field=v1,v2` | `status=draft,published` |
| 模糊搜索 | `q=keyword`（统一字段，按接口语义路由）| `q=汉字` |
| 范围（数值/日期）| `field_gte` / `field_lte` | `created_at_gte=2026-04-01` |
| 布尔 | `field=true` / `false` | `is_active=true` |
| 嵌套字段 | 点号 | `author.id=abc` |

> 所有筛选字段必须在 Zod query schema 中显式声明，未声明字段一律忽略。

---

## 六、版本与兼容

- URL 版本前缀：`/api/v1`、`/admin/v1`；不兼容变更才升 `v2`。
- **新增字段**：可随时；前端必须容忍未知字段。
- **删除字段**：必须经历 deprecated → 跨 1 个发布 → 删除。
- 响应所有字段在文档中标注 `since` 与 `deprecated`。

---

## 七、限流与安全

| 维度 | 默认阈值 | 备注 |
|------|---------|------|
| 单 IP | 60 r/min | 入口中间件 |
| 单用户 | 120 r/min | 登录态 |
| 登录/注册/发码 | 5 r/min | 防爆破 |
| 支付下单 | 10 r/min | + 强制 `Idempotency-Key` |
| 上传 | 单次 ≤ 10 MB；图片走 Supabase Storage 直传 |

- 所有 4xx/5xx 响应都包含 `request_id`，便于客服反查日志。
- 凡涉及钱包/支付/兑换的写操作，**必须**返回 `data.balance_after` 字段供客户端核对。

---

## 八、文件上传

- 大文件优先**前端直传 Supabase Storage** + 后端确认；后端兜底走 `multipart/form-data`。
- 上传完成后调用 `POST /api/v1/uploads/confirm` 注册到 DB 并返回 `id`。

---

## 九、Webhook（接收第三方）

- 路径：`/api/v1/webhooks/<provider>`，例：`/api/v1/webhooks/wechat-pay`。
- 必须在 1s 内返回 200；耗时操作丢入 BullMQ。
- 必须验签；缺 Key 时按 `env.md` 走 mock 验签直接放行（仅 dev）。

---

## 十、OpenAPI 文档

- 每个 controller 必须挂 `zod-to-openapi` 注释，`api-app` 启动时输出 `openapi.json` 到 `docs/openapi/`。
- 后台路径独立输出 `openapi.admin.json`。
