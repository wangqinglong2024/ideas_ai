# ZY-04-05 · 翻译 lint + RTL 准备

> Epic：E04 · 估算：S · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] `pnpm i18n:lint` 脚本：缺失键、长度溢出、占位符不一致检查
- [ ] husky pre-commit 调用 i18n:lint
- [ ] Tailwind logical properties 替换 `ml-*`/`mr-*` → `ms-*`/`me-*`（ESLint 规则警告）
- [ ] 不接外部 CI、不接 Crowdin/Lokalise

## 测试方法
- 故意删除一个键 → lint 报错
- ESLint：`mr-4` 触发警告

## DoD
- [ ] lint 在 zhiyu-app-fe 容器跑通
- [ ] pre-commit 拦截缺失键
