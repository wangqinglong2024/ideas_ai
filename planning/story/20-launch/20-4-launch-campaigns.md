# ZY-20-04 · 启动活动

> Epic：E20 · 估算：M · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 运营
**I want** 上线时跑 3 种活动：邀请翻倍 / 首充 50% off / 全员 D7 大礼包
**So that** 启动期产生口碑。

## 上下文
- 复用 ZY-13-04 优惠券 + ZY-12 经济
- 活动配置在 admin（ZY-17-08）：起止时间 + 规则参数
- 强埋点（events）

## Acceptance Criteria
- [ ] 三活动配置可视化
- [ ] 活动到期自动停
- [ ] 报表呈现效果

## 测试方法
- 手动配置 + MCP Puppeteer 触发

## DoD
- [ ] 三活动闭环

## 依赖
- 上游：ZY-12 / ZY-13 / ZY-17 / ZY-19
