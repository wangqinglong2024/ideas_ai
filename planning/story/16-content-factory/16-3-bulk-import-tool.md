# ZY-16-03 · 批量内容导入工具

> Epic：E16 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] CLI：`pnpm content:import <type> <file>`
  - type: article / lesson / novel-chapter / wordpack
- [ ] CSV / JSON 输入校验（zod）
- [ ] 入库 + supabase-storage 上传音频 / 图片
- [ ] 在 `zhiyu-worker` 容器内可跑：`docker compose exec zhiyu-worker pnpm content:import wordpack /seed/hsk1.json`
- [ ] 失败行单独输出错误报告

## 测试方法
- 集成：fixture 数据导入 → DB 行数对比
- 错误样本 → 报告输出

## DoD
- [ ] 4 类型可导
