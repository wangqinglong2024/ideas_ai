# ZY-04-03 · 字体按语言加载

> Epic：E04 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 语言→字体映射：vi=Be Vietnam Pro、th=Noto Sans Thai、id/en=Inter、zh=LXGW
- [ ] 切换语言时按需 preload 对应字体；卸载非当前语言字体
- [ ] `font-display: swap`；fallback 链路完整
- [ ] 字体来源：本地 `system/assets/fonts/`（与 ZY-02-04 子集联动）

## 测试方法
- DevTools Network：切语言后只下载所需字体
- MCP Puppeteer：4 语首页渲染无方框

## DoD
- [ ] 4 语字体按需加载
- [ ] 不引用 Google Fonts CDN
