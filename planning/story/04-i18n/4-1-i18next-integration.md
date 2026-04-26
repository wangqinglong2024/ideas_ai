# ZY-04-01 · i18next + 资源结构

> Epic：E04 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] `packages/i18n`：i18next + react-i18next + LanguageDetector
- [ ] 4 语 namespace：common / auth / courses / games / novels / economy / discover
- [ ] 命名空间懒加载（HTTP backend，资源路径 `/locales/{lng}/{ns}.json`）
- [ ] localStorage 持久化键 `zhiyu.lang`
- [ ] dev 模式：缺失键 console.warn + UI 高亮显示

## 测试方法
- 单元：切换语言后 hook 返回值更新
- MCP Puppeteer：切换 4 语并截图首页

## DoD
- [ ] 4 语 UI 顺利切换
- [ ] HMR 正常
