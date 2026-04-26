# E03 复盘 · 用户账户体系

> retrospective_date: 2026-04-26
> sprint: S03
> stories_completed: 6 / 6
> deployment: Docker compose, 6/6 容器健康
> validation: tsc -r + curl smoke + MCP Puppeteer 逐页 + 自动代码审查（3 层）

## 1. 交付清单

### 数据层

| 路径 | 内容 |
| - | - |
| `apps/api/drizzle/migrations/0002_e03_user_account.sql` | 8 张表（profiles/user_settings/user_devices/login_attempts/otp_challenges/pending_deletes/data_exports/audit_logs）+ 完整 RLS 策略 + `handle_new_user` SECURITY DEFINER 触发器 + `set_updated_at` |
| `packages/db/src/account.ts` | 8 个 Drizzle 表定义；统一 `bigserial mode:'number'` + `gen_random_uuid()`；命中 `profiles_username_key`、`otp_email_purpose_idx`、`audit_logs_user_idx` |

### 凭证 & 服务端

| 路径 | 内容 |
| - | - |
| `packages/sdk/src/auth/otp.ts` | `validatePassword`（≥10/大写/数字/符号）、`generateOtp`/`hashOtp`/`verifyOtp`（sha256+JWT_SECRET salt + `timingSafeEqual`）；常量 OTP_TTL=10min / cooldown=60s / IP 5/5min / 锁 5/15min |
| `apps/api/src/supa.ts` | `supaAdmin` (createServerClient + service_role)，cookie 名 `zy_at`/`zy_rt`，cookieOpts |
| `apps/api/src/auth-mw.ts` | 原生 cookie 解析/写入（不引入 fastify-cookie），`requireUser` 401 短路 |
| `apps/api/src/routes/auth.ts` | 9 路由：sign-up / verify-otp / sign-in / sign-out / providers / oauth/:provider 重定向 / callback / reset-password (+confirm) / me |
| `apps/api/src/routes/me.ts` | profile GET/PATCH（含 30d 用户名冷却 + 唯一冲突 409）、settings GET/PATCH、avatar/sign（fake fallback） |
| `apps/api/src/routes/me-sessions.ts` | sessions list / revoke-one / revoke-all（global signout + 凭据清理） + GDPR：export 入队 / list / delete 30d 延迟 + cancel + status |

### 异步 & 前端

| 路径 | 内容 |
| - | - |
| `apps/worker/src/gdpr.ts` | `gdpr-export` worker：组装 profile+settings+devices JSON → 上传到 supa storage `exports/` → 24h 签名链接（fake 回退）；`gdpr-purge` 6h 重复任务，扫描到期 pending_deletes 调 `auth.admin.deleteUser` |
| `apps/web/src/lib/api.ts` | `api()` fetch 包装器（credentials:'include'）+ 递归 camelCase→snake_case 标准化；`auth.*` + `me.*` 类型化方法集 |
| `apps/web/src/lib/auth-store.ts` | `useAuth()` + `navigate()`（pushState + popstate） |
| `apps/web/src/pages/auth.tsx` | SignUpPage（2-step）/ SignInPage（lockout 友好）/ ResetPasswordPage（2-step） |
| `apps/web/src/pages/me.tsx` | MeOverview / MeEdit（头像直传） / MeSettings（自动保存） / MeSecurity（设备列表 Tabs） / MeData（GDPR 导出+注销） / AuthCallbackPage（fragment→cookie） |
| `apps/web/src/App.tsx` | 9 条新路由 + Header 增加 登录/注册 入口 |

### 故事完成情况

| Story | 标题 | 状态 | 备注 |
| - | - | - | - |
| ZY-03-01 | profiles + RLS + handle_new_user | done | RLS 公示读 + owner 改；触发器在 auth.users INSERT 时回填 profile + user_settings |
| ZY-03-02 | OTP 注册 + 限频 | done | `checkOtpRate(email,ip,purpose)` 已按 purpose 分桶；fake 邮件适配器在响应里直接回传 dev_code |
| ZY-03-03 | 密码 + OAuth + 重置 + 5 失败 15 分锁 | done | login_attempts 滚动窗口锁定；OAuth 走 supabase /authorize 重定向 + fragment 回调 |
| ZY-03-04 | 资料 / 头像 / 用户名 | done | username 30d 冷却（>30d 后 ZC 计费留为后续 epic）；avatar 走 createSignedUploadUrl，bucket 缺失时回退 data:fake URL |
| ZY-03-05 | user_settings + 会话列表撤销 | done | sessions 端点暴露当前会话（基于 cookie），revoke-all 调 GoTrue admin.signOut(scope=global) |
| ZY-03-06 | GDPR 导出 + 30 日延迟删除 | done | export 1 秒内完成（fake 链接）；purge worker 6h tick；delete_status 暴露 cancel 入口 |

## 2. 验证结果

### 类型 / 构建

```
pnpm -r typecheck   全 12 包通过
docker compose build zhiyu-app-be zhiyu-app-fe zhiyu-worker  ok
docker compose ps   6/6 healthy
```

### 端到端 curl smoke（实跑）

```
sign-up (smoke-e03-1777185442@zhiyu.local)  → 200 challenge_id+dev_code
verify-otp                                   → 200 user+access_token, Set-Cookie zy_at + zy_rt
auth/me                                      → 200 user
GET /me                                      → 200 profile+settings+email
PATCH /me   {bio, hsk, goal:culture}         → 200 ok
PATCH /me/settings {theme:dark,push:false}   → 200 ok
GET /me/sessions                             → 200 [{current:true,ip,ua,...}]
GET /auth/providers                          → 200 {google:false, apple:false}
POST /me/export                              → 200 queued; worker → succeeded <100ms
GET /me/exports                              → 200 [{status:succeeded, downloadUrl:data:fake/...}]
POST /auth/sign-out                          → 200 ok, cookies cleared
```

### MCP 浏览器逐页（Puppeteer）

| Path | 渲染 | 交互验证 |
| - | - | - |
| `/signup` | 200 | 邮箱→拿到 dev_code → 二阶段表单（form 提交因 puppeteer 直接 setValue 未触发 React onChange，改用 `dispatchEvent('input')` 验证；真人浏览器无此问题） |
| `/signin` | 200 | providers 拉取成功；password / OTP 通道齐备 |
| `/reset-password` | 200 | 两步表单 |
| `/auth/callback` | 200 | hash→/api/v1/auth/callback POST → /me |
| `/me` | 200 | 渲染 displayName+username+@email+HSK badge |
| `/me/edit` | 200 | 表单回填昵称 / 用户名 / 语言；文件 input 接 createSignedUploadUrl |
| `/me/settings` | 200 | select & switch 自动保存（debounce on blur for HH:MM） |
| `/me/security` | 200 | sessions 列表 + Tabs + 批量按钮 |
| `/me/data` | 200 | export 入队 / 列表 + delete 三段确认（checkbox + password + confirm） |
| `/__styleguide` | 200 | 既有 E02 页面正常 |

## 3. 关键技术决策

1. **Cookie 自管而非 fastify-cookie** — 自写 `parseCookies` / `setCookie` / `clearCookie`，操作 `Set-Cookie` 头数组（HttpOnly + SameSite=Lax + Path=/）。优点：少一个传递依赖、跨进程 (worker) 不需要插件。
2. **CORS 显式放行 credentials** — `access-control-allow-credentials: true` + 完整方法列表 + 任意 origin 回显（gateway 后会再收紧）。否则 FE→BE 跨端口 fetch 不会带 cookie。
3. **camelCase → snake_case 客户端标准化** — `api()` 在响应路径上递归转换，避免 BE 暴露 Drizzle 内部 camelCase 命名约束 FE。BE 入参仍接受 snake_case（zod 显式声明），保持 PRD 契约一致。
4. **GDPR 导出走 BullMQ 而非同步** — 即使快路径 1s 完成，仍通过队列归一可观察 + 失败重试。
5. **触发器 SECURITY DEFINER + handle_new_user** — 用户在 GoTrue 创建后自动落地 zhiyu.profiles + user_settings；GET /me 仍保留幂等回填（兼容历史用户）。
6. **`admin.signOut(userId, 'global')` 兼容嗅探** — supabase-js 类型未导出，使用受限的 unknown 断言通道并在缺失时降级（pending: cookie 清理保证当前会话立即失效，全设备退出依赖 GoTrue 版本支持）。
7. **OTP purpose 分桶限频** — 防止刚注册的用户立刻请求重置时被同一邮箱 60s 冷却拦下。

## 4. 顺利之处

- 12 个新文件按计划一次到位，类型仅在 cookie 常量重导出和 Avatar 包装上做了一轮微调即过。
- 触发器 + RLS + 前端鉴权在第一次 docker up 后就跑通，未需要回滚迁移。
- MCP 浏览器一遍即覆盖所有 9 个新路由 + 4 个交互入口（注册 / 登录 / 设置切换 / GDPR 导出）。

## 5. 不太顺利之处

1. **首次 SignInPage 用了 `useState(()=>{...})` 当作生命周期** — 静态类型未拦下，靠代码审查发现并修正为 `useEffect(() => ..., [])`。
2. **camelCase/snake_case 不一致** — Drizzle 默认导出 camelCase 与 BE/FE 既有 snake_case 契约冲突，初版 me 页面字段全是 undefined。最终在 FE 网关层统一转换。
3. **Avatar 组件签名** — 假设有 `name`/`src`/`size="xl"`，实际 `@zhiyu/ui` Avatar 是 Radix 透传，需自带壳；改为本地 `AvatarChip`（首字母渐变方块 + 图片回退）。
4. **revokeAll global signout** — supabase-js 类型未公开 `auth.admin.signOut(userId, scope)`，做了运行时 feature-detect + 警告日志。生产建议升级到 GoTrue 2.158+ 直接走原生 API。
5. **storage bucket** — 未自动创建 `avatars` / `exports` bucket，开发链路使用 `data:fake/...` 回退；env.md 待补一节"首次启动需手动建 bucket 或允许匿名上传"。

## 6. 偏离 / 范围调整

- ZY-03-04 中"用户名 30d 后续费 100 ZC"接入 ZC 钱包延后到 E15（信用与变现）。当前实现仅暴露 `retry_after_days`。
- 设备指纹细粒度（ZY-03-05 spec 中提到的 device_id 持久化）仍以 cookie + UA 替代；表 `user_devices` 已就位，等 E13 引入 PWA 推送时填充。

## 7. 后续 follow-up

| 项 | 优先级 | 归属 |
| - | - | - |
| `avatars` / `exports` storage bucket 启动检测 + 自动创建 | P1 | E03 收尾或 E04 |
| 把 admin.signOut 升级为 server-side fetch（直接打 GoTrue admin API） | P2 | E03 |
| device fingerprint + push token 表填充 | P2 | E13 |
| ZC 计费接入用户名修改 | P2 | E15 |
| 注册 / 注销 audit_logs 转发到 telemetry pipeline | P3 | E18 |
