# ZY-02-04 · 字体子集 + 排版

> Epic：E02 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 字体集：Inter（拉丁）/ LXGW（中文）/ Noto Sans Thai / Be Vietnam Pro
- [ ] 子集化脚本 `pnpm fonts:subset`（fonttools 在 zhiyu-worker 容器内可跑）
- [ ] CSS @font-face + preload 关键字重 + `font-display: swap`
- [ ] 字符缺失 fallback 链路完整
- [ ] 子集后体积：中文 ≤ 800KB（HSK1-6 + 常用 5000）

## 测试方法
```bash
docker compose exec zhiyu-worker pnpm fonts:subset
ls system/assets/fonts/  # 子集文件存在
```
- DevTools Network：访问首页只下载当前 UI 语言所需字体

## DoD
- [ ] 体积达标
- [ ] 4 语 UI 渲染无方框 / 缺字
