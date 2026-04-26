# ZY-16-02 · 内容工厂后台占位页

> Epic：E16 · 估算：S · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 内容运营
**I want** admin 看到"内容工厂"页：上传 CSV / JSON 触发批量任务、看进度、结果可下载或一键发布
**So that** 不写代码也能批量生成内容。

## 上下文
- 路由 `/admin/factory`
- 上传：drag&drop CSV / JSON（zod 校验列）
- 任务列表：状态 / 进度 / 错误 / 结果预览
- 结果可一键导入对应表（articles / lessons / wordpacks）

## Acceptance Criteria
- [ ] 上传 + 解析 + 创建 jobs
- [ ] 列表 + 进度 polling
- [ ] 结果预览 modal + 导入按钮
- [ ] 4 语界面

## 测试方法
- MCP Puppeteer 上传示例 CSV 触发 fake → 列表出现 done

## DoD
- [ ] fake 闭环

## 依赖
- 上游：ZY-16-01 / ZY-17
