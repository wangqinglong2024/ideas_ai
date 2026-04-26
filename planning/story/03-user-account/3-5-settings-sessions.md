# ZY-03-05 · 设置中心 + 设备/会话管理

> Epic：E03 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 设置页：主题 / 通知偏好 / 学习提醒时间 / HSK 自评入口
- [ ] `/api/v1/me/sessions` 列出 supabase auth admin sessions
- [ ] DELETE `/api/v1/me/sessions/:id` + `/api/v1/me/sessions/all`（远程登出）
- [ ] 当前会话标识；最后活跃时间、设备 UA 解析

## 测试方法
- MCP Puppeteer：A 浏览器登录 / B 浏览器登录 → A 远程登出 B → B 刷新被踢
- 单元：UA 解析正确

## DoD
- [ ] 远程登出可用
- [ ] 设置项写入 `user_preferences`
