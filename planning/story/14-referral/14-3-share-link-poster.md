# ZY-14-03 · 分享链接 + 海报

> Epic：E14 · 估算：M · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 用户
**I want** 一键生成自带二维码与个人形象的分享海报，复制链接 / 保存图
**So that** 在 IG / WX / X / 朋友圈快速传播。

## 上下文
- 链接：`https://ideas.top/r/<code>?lng=zh`
- 海报：客户端 OffscreenCanvas 合成（背景模板 + 头像 + 二维码 + 文案）
- 二维码：本地库 `qrcode`，不调用 Google Charts
- 4 语模板，每语 3 套

## Acceptance Criteria
- [ ] `/r/:code` SSR 落地（接 ZY-14-04）
- [ ] FE `/me/referral` 海报组件 + 模板切换
- [ ] navigator.share + 复制 / 下载 PNG
- [ ] 4 语 × 3 模板 = 12 套渲染

## 测试方法
- MCP Puppeteer：选模板 → 下载 PNG → 校验非空

## DoD
- [ ] 海报 ≤ 500KB
- [ ] 二维码扫得通

## 依赖
- 上游：ZY-14-02 / ZY-04
