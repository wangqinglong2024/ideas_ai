# ZY-20-06 · 法务清单 + D-Day 检查

> Epic：E20 · 估算：M · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 项目经理
**I want** 上线前 D-7 / D-1 / D-Day 三个检查清单 + 法务文件归档
**So that** 没有遗漏发布。

## 上下文
- D-7：监控 / 备份演练 / 安全扫 / 性能基线 / 跨平台冒烟
- D-1：客服培训 / 文案二审 / 备灾路径
- D-Day：发布开关 / 实时大盘 / on-call 值班
- 法务：4 语隐私 / TOS / cookie / 公司主体声明（dev 用占位）

## Acceptance Criteria
- [ ] 三 checklist md 在 `system/docs/launch/`
- [ ] 法务 md 4 语
- [ ] sprint 标记完成才允许发布

## 测试方法
- 人工核对 ✅ 全部勾选

## DoD
- [ ] 三 checklist 完成

## 依赖
- 上游：所有 epic
