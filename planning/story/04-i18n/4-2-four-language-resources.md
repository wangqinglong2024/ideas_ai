# Story 4.2: 4 语资源 + namespace 拆分

Status: ready-for-dev

## Story

As a 前端 / 翻译协作者,
I want 在 `packages/i18n/locales/` 下按 4 语 × N namespace 拆分 JSON 资源, 并支持懒加载与 fallback,
so that UI 字符串集中维护、按路由按需加载，新增模块只需追加对应 namespace 文件即可。

## Acceptance Criteria

1. 4 个语言目录创建：`locales/en/`、`locales/vi/`、`locales/th/`、`locales/id/`。
2. 8 个首批 namespace 文件齐全：`common.json / auth.json / courses.json / games.json / discover.json / novels.json / shop.json / errors.json`，每个文件 4 语全有（不缺失）。
3. JSON 键结构遵循约定：扁平 + 点号分组（`auth.login.title`），最大嵌套 2 层；不允许动态拼 key。
4. fallback 行为：`vi → en`、`th → en`、`id → en`，缺失键运行时不抛错而走 fallback。
5. `packages/i18n/src/namespaces.ts` 登记表与文件系统保持一致（CI 校验，缺失即红）。
6. 命名空间懒加载：路由代码 `i18n.loadNamespaces(['games'])` 后才请求 `/locales/{lng}/games.json`，首屏只加载 `common`。
7. 资源版本化：构建时把每个 JSON 计算 hash 写入 `manifest.json`，前端按 `?v=hash` 取，避免 CDN 脏缓存。
8. 至少 80 个 key 实际填充（覆盖登录 / 注册 / 错误提示 / 通用按钮 / 导航 5 项 / 课程入口 / 游戏入口 / 商店入口）。

## Tasks / Subtasks

- [ ] Task 1: 目录与基础键（AC: #1, #2, #8）
  - [ ] 4 语 × 8 ns 共 32 个 JSON 文件
  - [ ] 写入约 80 个 baseline key
- [ ] Task 2: 注册表与 CI 校验（AC: #3, #5）
  - [ ] `namespaces.ts` 列出所有 ns
  - [ ] `scripts/check-namespaces.ts`：fs ↔ 注册表比对，CI 任务调用
- [ ] Task 3: fallback 与懒加载（AC: #4, #6）
  - [ ] `createI18n` 配置 `fallbackLng` 多对一映射
  - [ ] `LazyNamespace.tsx` 包装组件：未加载时显示 skeleton
- [ ] Task 4: 资源版本化（AC: #7）
  - [ ] `scripts/build-locales.ts` 生成 hash + manifest.json
  - [ ] 前端 backend.loadPath 拼 `?v=`

## Dev Notes

### 关键架构约束
- **键命名规范**：`<feature>.<area>.<element>`，如 `games.hub.empty.title`；review 中不通过即打回。
- **占位符统一用 ICU**：`{name}` / `{count, plural, ...}`，禁止 `%s` 风格。
- **不在 JSON 中放 HTML**：富文本走组件 `<Trans>` 拼装。
- **缺失即可见**：dev 环境 `missingKeyHandler` 直接打印红色警告 + 上报 PostHog。

### 关联后续 stories
- 4-1 完成后才能开干本 story
- 4-3 ICU 解析器接入后才能使用复数语法
- 4-10 CI 缺失键检测会 import 本 story 的注册表
- 所有功能 epic（5-*、6-*、8-* 等）新增 ns 需回到本 story 的注册表登记

### 测试标准
- vitest：fallback 链；缺失 key 走 en；懒加载完成 emits `loaded` 事件
- 手动：dev 删除某语言文件后页面 fallback 正常

### Project Structure Notes

```
packages/i18n/
  locales/
    en/{common,auth,courses,games,discover,novels,shop,errors}.json
    vi/{...}.json
    th/{...}.json
    id/{...}.json
  src/namespaces.ts
  scripts/
    check-namespaces.ts
    build-locales.ts
  dist/manifest.json
```

### References

- [Source: planning/epics/04-i18n.md#ZY-04-02](../../epics/04-i18n.md)
- [Source: planning/sprint/04-i18n.md](../../sprint/04-i18n.md)
- [Source: planning/story/04-i18n/4-1-i18next-integration.md](./4-1-i18next-integration.md)

## Dev Agent Record

### Agent Model Used

(Filled by dev agent at execution time)

### Debug Log References

### Completion Notes List

### File List
