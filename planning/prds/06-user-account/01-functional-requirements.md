# 6.1 · 用户账号 · 功能需求

## 用户故事
- US-UA-01：注册新账号（邮箱 / Google）
- US-UA-02：邮箱验证
- US-UA-03：登录
- US-UA-04：忘记密码 / 重置
- US-UA-05：完善个人资料（昵称 / 头像 / 母语）
- US-UA-06：设置学习偏好
- US-UA-07：销户 + 数据导出
- US-UA-08：多设备登录与会话管理

## 功能需求

### UA-FR-001：注册（邮箱）
- 字段：邮箱、密码、母语（默认 UI 语言）、隐私同意
- Turnstile 验证
- 注册立即送 100 知语币（详见 EC）
- 邮箱验证邮件触发

### UA-FR-002：注册（Google OAuth）
- Supabase Auth Google provider
- 首次登录后弹引导填母语 + 隐私同意
- 同样送 100 币

### UA-FR-003：邮箱验证
- 6 位数字 OTP，15min 有效
- 重发限流：60s/次，5 次 / 小时
- 未验证：可登录但功能受限（不能付费 / 不能 1v1 客服）

### UA-FR-004：登录
- 邮箱 + 密码 或 Google
- 失败 5 次锁 15min（锁定 IP + 邮箱）
- 记住设备：30 天

### UA-FR-005：忘记密码
- 输入邮箱 → 收链接（10min 有效）
- 链接含一次性 token
- 重置密码 + 让所有现有 session 登出

### UA-FR-006：个人资料
- 昵称（≤ 30 字）
- 头像（上传 / 默认头像生成 / Gravatar）
- 母语（en / vi / th / id）
- 时区
- 学习目标（覆盖 onboarding 选择）
- 当前 HSK 等级（自评 + 系统推算）

### UA-FR-007：偏好设置
- UI 语言
- 拼音模式：字母 / 数字声调 / 隐藏
- 翻译显示：实时 / 折叠 / 隐藏
- 字号：S / M / L / XL
- TTS 语速：0.5x / 0.75x / 1x / 1.25x / 1.5x
- TTS 音色：男 / 女 / 童声（v1.5 上儿童音色）
- 邮件订阅：营销邮件 / 学习提醒（默认开 / 关）

### UA-FR-008：会话管理
- `/me/sessions` 列出所有活跃设备
- 显示：设备名 / IP / 最近活跃
- 可强制下线单个会话或全部

### UA-FR-009：账户安全
- 修改密码（需当前密码）
- 修改邮箱（验证新邮箱）
- 启用 2FA（v1.5）

### UA-FR-010：数据导出
- 一键导出 JSON / CSV
- 包含：profile / progress / wrong_set / favorites / notes / orders / coin_ledger
- 邮件链接（24h 有效）
- 限频：每月 1 次

### UA-FR-011：销户
- "销毁账户"按钮
- 二次确认 + 输入密码
- 软删：90 天可恢复（联系客服）
- 90 天后硬删（GDPR 兼容）
- 销户后：无法登录、订阅不退款（按 ToS）、知语币清零

### UA-FR-012：欢迎流程（onboarding）
- Step 1：母语选择
- Step 2：UI 语言确认
- Step 3：学习目标 / Persona 标签
- Step 4：当前水平
- Step 5：推荐轨道（详见 CR）
- Step 6：拼音入门提示
- 可跳过任意步骤

### UA-FR-013：未登录功能（匿名访问）
- 浏览：DC 前 3 篇 / NV 首章
- 设备指纹累计计数
- 注册转化埋点

## 性能 / 安全
- 注册 / 登录 P95 < 800ms
- 密码哈希 bcrypt rounds=12
- 暴力破解防护（Cloudflare WAF + Turnstile）
- session token：HttpOnly / Secure / SameSite=Lax
- JWT：HS256，secret 100% 服务端
