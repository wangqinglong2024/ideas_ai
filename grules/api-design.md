# API 设计规约 (API Design Standards)

> **版本**: v1.0 | **最后更新**: 2025-07-16
>
> **适用范围**：所有 FastAPI 后端项目的 RESTful API 设计。
> **核心原则**：一致性 > 灵活性。所有 API 必须"长得一样"，前端无需猜测。

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
```python
# app/core/response.py
from typing import Any, Optional
from pydantic import BaseModel

class ApiResponse(BaseModel):
    code: int = 0
    message: str = "success"
    data: Optional[Any] = None

    @classmethod
    def ok(cls, data: Any = None, message: str = "success"):
        return cls(code=0, message=message, data=data)

    @classmethod
    def error(cls, code: int, message: str):
        return cls(code=code, message=message, data=None)

class PageData(BaseModel):
    items: list
    total: int
    page: int
    page_size: int
    has_next: bool
```

### 自定义业务异常
```python
# app/core/exceptions.py
class BizError(Exception):
    """业务异常，会被全局异常处理器捕获并转为标准 JSON 响应"""
    def __init__(self, code: int, message: str, status_code: int = 400):
        self.code = code
        self.message = message
        self.status_code = status_code

# 使用示例
raise BizError(code=40901, message="用户名已被占用")
raise BizError(code=40301, message="无权操作该资源", status_code=403)
```

### 全局异常处理器
```python
# 在 main.py 中注册
from fastapi import Request
from fastapi.responses import JSONResponse

@app.exception_handler(BizError)
async def biz_error_handler(request: Request, exc: BizError):
    return JSONResponse(
        status_code=exc.status_code,
        content={"code": exc.code, "message": exc.message, "data": None},
    )

@app.exception_handler(Exception)
async def global_error_handler(request: Request, exc: Exception):
    # 生产环境不暴露错误详情
    logger.error(f"未处理异常: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"code": 50000, "message": "服务器内部错误", "data": None},
    )
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

### 后端通用分页依赖
```python
from fastapi import Query

class PaginationParams:
    def __init__(
        self,
        page: int = Query(1, ge=1, description="页码"),
        page_size: int = Query(20, ge=1, le=100, description="每页条数"),
        sort_by: str = Query("created_at", description="排序字段"),
        sort_order: str = Query("desc", regex="^(asc|desc)$", description="排序方向"),
    ):
        self.page = page
        self.page_size = page_size
        self.sort_by = sort_by
        self.sort_order = sort_order
        self.offset = (page - 1) * page_size
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

- FastAPI 的 Swagger 文档（`/docs`）是唯一的 API 文档来源
- 每个路由函数必须有完整的中文 docstring
- 每个 Pydantic 模型字段必须有 `Field(description=...)` 中文说明
- Tag 分组必须与业务模块名一致（`tags=["用户管理"]`、`tags=["对话"]`）
- 响应示例必须在 `response_model` 中体现，不手写 OpenAPI JSON
