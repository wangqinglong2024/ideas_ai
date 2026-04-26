# ZY-18-05 · 隐私政策 / 服务条款页

> Epic：E18 · 估算：S · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 用户
**I want** 一键阅读隐私政策 / 用户协议 / Cookie 说明，且首次启动有同意条
**So that** 我清楚自己的数据如何使用。

## 上下文
- 页面：`/legal/privacy`、`/legal/terms`、`/legal/cookies`
- 同意条：首次启动底部 banner，"接受 / 设置"；记 user_settings.consent_at + version
- 文档版本变更需要重新同意

## Acceptance Criteria
- [ ] 4 语 markdown 渲染（CMS 或仓库内 md）
- [ ] consent banner + 持久化
- [ ] 版本号变 → re-prompt

## 测试方法
- MCP Puppeteer：清 storage → 重进 → 同意条出现

## DoD
- [ ] 4 语全 + 持久化正确

## 依赖
- 上游：ZY-04 / ZY-03-05
