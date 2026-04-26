# Epic E15 · 客服 IM 与工单（Customer Service）

> 阶段：M6 · 优先级：P0 · 估算：3 周
>
> 顶层约束：[planning/00-rules.md](../00-rules.md)；**实时通道走 Supabase Realtime**，禁用 Socket.io 网关与第三方 IM SaaS。

## 摘要
内嵌 IM 客服 + 工单 + FAQ；多客服派单；离线兜底（EmailAdapter）。

## 范围
- `conversations` / `messages` / `tickets` / `faq` 表（schema `zhiyu`）
- supabase-realtime broadcast 频道：`conv:<id>`
- 自动派单
- 用户端 IM UI + 客服后台 IM 工作台
- 工单流 + FAQ + AI 辅助（v1 简）+ SLA 仪表板

## 非范围
- Socket.io / Pusher / Ably / Intercom / Zendesk
- 真实 LLM 智能回复（用 `LLMAdapter` fake，回最相近 FAQ 文案）

## Stories（按需 7）

### ZY-15-01 · conversations / messages / tickets / faq 表 + RLS
**AC**
- [ ] 四表 + 索引 + RLS（user 仅看自己；客服角色可看全部）
**估**：M

### ZY-15-02 · Realtime 通道 + 派单服务
**AC**
- [ ] 用户开会话 → BE 创建 conversation；客服在线时 broadcast 派单到客服端 `agent:<aid>` 频道
- [ ] 全部客服离线 → 转工单 + 走 EmailAdapter（fake）
- [ ] 转接 / 升级 actions 写库 + emit
- [ ] 不引入 Socket.io / Redis adapter（Redis 仍由 supabase 内置或本期 redis 容器使用）
**估**：L

### ZY-15-03 · 用户端 IM UI
**AC**
- [ ] 浮动按钮 / drawer
- [ ] 文 / 图 / 表情；图走 supabase-storage `chat/<conv>/`
- [ ] 历史滚动（分页）
- [ ] subscribe `conv:<id>` 频道
**估**：L

### ZY-15-04 · 客服后台 IM 工作台
**AC**
- [ ] 多会话切换 + 排队列表
- [ ] 用户上下文（订单 / 学习摘要 SQL）
- [ ] 快捷回复模板；转工单按钮
**估**：L

### ZY-15-05 · 工单流
**AC**
- [ ] 提交 / 分类 / 派单；状态机
- [ ] EmailAdapter（fake）通知
**估**：M

### ZY-15-06 · FAQ 自助 + AI 辅助（fake）
**AC**
- [ ] FAQ 多语 + 搜索 + 帮助度评分
- [ ] LLMAdapter fake：返回最相近 FAQ 标题作为建议（cosine 用 pgvector，向量列由后台 admin 手动 seed 或留空）
**估**：M

### ZY-15-07 · SLA 仪表板 + 离线兜底
**AC**
- [ ] 平均响应时间 / 会话时长 / 满意度
- [ ] 用户离线 → 写 `pending_messages`，下次上线 supabase-realtime 推
**估**：M

## DoD
- [ ] IM 实时通；派单 / 转接 OK
- [ ] FAQ 命中率指标可看
- [ ] MCP Puppeteer：用户端开会话 + 后台收到 + 回复 + 用户收到
- [ ] 不引用任何客服 SaaS
