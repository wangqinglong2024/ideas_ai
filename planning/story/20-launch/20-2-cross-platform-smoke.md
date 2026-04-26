# ZY-20-02 · 跨平台冒烟

> Epic：E20 · 估算：M · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** QA
**I want** 一键脚本跑 5 浏览器 × 3 视口 × 4 语 关键路径冒烟
**So that** 上线前快速回归。

## 上下文
- 工具：playwright + MCP Puppeteer 双轨；不接 BrowserStack / Sauce Labs
- 关键路径：登录 / 注册 / 浏览课程 / 完成 1 lesson / 阅读 1 章 / 玩 1 游戏 / 下单 fake
- 输出 HTML 报告 + 截图

## Acceptance Criteria
- [ ] playwright 项目 + 配置 5 × 3 × 4 = 60 矩阵（合并复用）
- [ ] script `pnpm smoke`
- [ ] 报告产出
- [ ] CI（dev 环境本地）一键跑

## 测试方法
```bash
cd /opt/projects/zhiyu/system
pnpm smoke
```

## DoD
- [ ] 关键路径 100% 通过

## 依赖
- 上游：所有 app + admin 已就绪
