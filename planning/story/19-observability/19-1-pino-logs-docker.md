# ZY-19-01 · pino 日志 + Docker 落盘

> Epic：E19 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] zhiyu-app-be / zhiyu-worker / zhiyu-admin-be 三服务统一 pino 配置
- [ ] 结构化 JSON；脱敏中间件（password / token / phone）
- [ ] docker volume 挂载到宿主 `/var/log/zhiyu/<svc>/`
- [ ] `logrotate` 配置模板（用户后续启用）
- [ ] traceId 贯穿（asyncLocalStorage）

## 测试方法
- 集成：日志格式 + 脱敏 grep 验证
- volume 文件存在

## DoD
- [ ] 三服务统一格式
