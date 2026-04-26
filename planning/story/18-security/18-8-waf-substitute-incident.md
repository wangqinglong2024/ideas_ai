# ZY-18-08 · WAF 替代 + 应急响应

> Epic：E18 · 估算：M · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 运维
**I want** 在 nginx 层做 WAF 等价能力 + 一份应急响应剧本
**So that** 不依赖 Cloudflare WAF 也能拦截常见攻击。

## 上下文
- nginx 层（`/opt/gateway`）：
  - GeoIP 黑名单（可选）
  - User-Agent 黑名单
  - 高频 IP 临时封禁（fail2ban + log scan）
  - 大请求体 / 慢请求拦截
- 应用层 RateLimiter (ZY-18-02) 配合
- 应急剧本（runbook）：DDoS / 数据泄露 / 失陷账号 / 支付欺诈 共 4 模板

## Acceptance Criteria
- [ ] nginx conf snippet 提供
- [ ] fail2ban 集成
- [ ] runbook md 4 份（在 `system/docs/runbooks/`）
- [ ] 演练记录模板

## 测试方法
- 手动 ab -n 10000 触发限流；检查 fail2ban 日志

## DoD
- [ ] nginx + fail2ban 联动
- [ ] runbook 完整

## 依赖
- 上游：外部 nginx 已就位
