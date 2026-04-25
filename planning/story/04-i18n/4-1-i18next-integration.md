# Story 4.1: i18next + react-i18next 集成

Status: ready-for-dev

## Story

As a 前端开发者,
I want 在 monorepo 中创建 `packages/i18n` 并完成 i18next + react-i18next 的统一集成,
so that 4 端（app / admin / web / 邮件）都能用同一套国际化基础设施加载语言、检测 locale、热更新。

## Acceptance Criteria

1. 新建 `packages/i18n`（`workspace:*` 可被 apps/* 引用），导出 `createI18n()` 工厂与 `<I18nProvider>`、`useT()` Hook。
2. 内置 i18next + react-i18next + i18next-browser-languagedetector + i18next-http-backend，依赖锁定到当前最新稳定版（i18next ≥ 23）。
3. 语言检测顺序：`querystring → cookie → localStorage → navigator → htmlTag`；命中后写回 `localStorage` 与 `<html lang>`。
4. 默认语言 `en`；fallback 链 `vi → en`、`th → en`、`id → en`、`zh → en`。
5. namespace 懒加载：默认仅加载 `common`，路由级按需 `i18n.loadNamespaces()`。
6. HMR 友好：dev 环境修改 `locales/**` JSON 自动 reload，无需刷新整页。
7. SSR 安全：`createI18n()` 同一进程多实例隔离，不污染全局。
8. 单元测试覆盖：检测顺序 / fallback / namespace 懒加载 / 语言切换事件。
9. README 含 `apps/app`、`apps/admin` 接入示例（5 行内即可启用）。

## Tasks / Subtasks

- [ ] Task 1: 包骨架（AC: #1, #2）
  - [ ] `packages/i18n/package.json` exports `./client`、`./react`、`./detector`
  - [ ] tsup 双 ESM/CJS 构建；peer deps 仅 react ≥ 19
  - [ ] tsconfig extends 根 base
- [ ] Task 2: 核心工厂（AC: #1, #3, #4, #7）
  - [ ] `createI18n({ resources, ns, defaultNS, fallbackLng })`
  - [ ] 注入 detector（顺序 querystring → cookie → localStorage → navigator → htmlTag）
  - [ ] `<I18nProvider>` 包装 react-i18next 的 `I18nextProvider`
  - [ ] `useT(ns?: string)` 薄封装
- [ ] Task 3: 懒加载与 HMR（AC: #5, #6）
  - [ ] http-backend 路径约定 `/locales/{{lng}}/{{ns}}.json`
  - [ ] vite 插件钩子：监听 `packages/i18n/locales/**`，触发 `i18n.reloadResources`
- [ ] Task 4: 测试与接入文档（AC: #8, #9）
  - [ ] vitest：检测优先级 / fallback / loadNamespaces / changeLanguage 事件
  - [ ] README + `apps/app/main.tsx` 示例

## Dev Notes

### 关键架构约束
- **唯一真理源**：所有 UI 字符串必须来自 `packages/i18n/locales/{lng}/{ns}.json`，禁止任何组件硬编码可见文案。
- **Namespace 规划（首批）**：`common / auth / courses / games / discover / novels / shop / errors`，新增 ns 必须在 `packages/i18n/src/namespaces.ts` 中登记。
- **Locale 标识**：`en / vi / th / id / zh`，遵循 BCP-47；`zh` 仅用于学习内容显示，不作为 UI 语言。
- **持久化**：`localStorage.zy_lang` + cookie `zy_lang`（SameSite=Lax）。
- **`<html lang>`**：切换语言时同步更新，便于 SEO 与辅助技术。

### 关联后续 stories
- 4-2 在本 story 完成后铺设 namespace 资源结构
- 4-3 在 4-2 后接入 ICU MessageFormat 解析器
- 4-4 字体按 `<html lang>` 动态加载
- 4-5 Intl 工具复用本 story 暴露的 `getLocale()`
- 5-* App Shell 通过 `<I18nProvider>` 包裹路由

### 测试标准
- vitest + jsdom（与根仓库一致）
- 关键场景：浏览器无 cookie → 命中 navigator → fallback 到 en；切换语言后 `useT` 重新渲染
- 不在本 story 做 e2e（留到 4-10 CI 缺失键检测）

### Project Structure Notes

```
packages/i18n/
  package.json
  tsup.config.ts
  src/
    client.ts          # createI18n
    react.tsx          # I18nProvider, useT
    detector.ts        # 顺序与持久化
    namespaces.ts      # ns 注册表
  locales/             # 4-2 story 落地
  __tests__/
  README.md
```

### References

- [Source: planning/epics/04-i18n.md#ZY-04-01](../../epics/04-i18n.md)
- [Source: planning/sprint/04-i18n.md](../../sprint/04-i18n.md)
- [Source: planning/spec/03-frontend.md](../../spec/03-frontend.md)
- [Source: planning/spec/02-tech-stack.md](../../spec/02-tech-stack.md)

## Dev Agent Record

### Agent Model Used

(Filled by dev agent at execution time)

### Debug Log References

### Completion Notes List

### File List
