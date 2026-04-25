# Story 4.10: 翻译质量监控（CI）

Status: ready-for-dev

## Story

As a 平台 / 翻译负责人,
I want CI 阶段自动校验缺失键 / 长度溢出 / 占位符差异,
so that 缺翻、错占位等问题在 PR 阶段就被拦截，不会泄漏到生产。

## Acceptance Criteria

1. 新增脚本 `pnpm i18n:check`，扫描 `packages/i18n/locales/**` 与代码中 `t('xxx')` / `<Trans i18nKey="xxx">` 的实际使用。
2. 缺失键检测：源代码引用了 key 但任一语言缺失 → 红。
3. 多余键检测（warn）：locale 文件存在但代码无引用 → 警告。
4. ICU 占位符一致性：4 语 vs 源 zh / en 占位符集合相同 → 不一致即红。
5. 长度溢出：按 `field-rules.ts` 上限校验（按钮 30 / 标题 60 / 描述 200）→ 不一致即红。
6. JSON schema 校验：键路径深度 ≤ 2、值不含 HTML、不含半角换行 `\n`。
7. CI workflow `.github/workflows/i18n.yml` PR 触发；失败展示具体行号与 key。
8. 报告同时输出 markdown 评论到 PR（github-actions/comment）。

## Tasks / Subtasks

- [ ] Task 1: 扫描器（AC: #1, #2, #3）
  - [ ] AST 扫描 `packages/**/src/**/*.{ts,tsx}` 提取 t() 与 <Trans> key
  - [ ] 与 namespaces.ts + locale 文件比对
- [ ] Task 2: 占位符与长度规则（AC: #4, #5, #6）
  - [ ] 复用 `packages/i18n/src/icu-lint.ts`
  - [ ] `field-rules.ts` 集中长度上限
  - [ ] AJV JSON schema 校验
- [ ] Task 3: CI 集成（AC: #7, #8）
  - [ ] GitHub Action workflow
  - [ ] 失败评论 PR

## Dev Notes

### 关键架构约束
- **AST 而非正则**：用 `@babel/parser` 找 `t('...')` 调用，避免漏扫动态 key。
- **动态 key 白名单**：`packages/i18n/dynamic-keys.json`，必须 PR 评审登记。
- **长度规则**：可用 `applyTo` 指定 key glob（如 `auth.button.*` → 30）。

### 关联后续 stories
- 依赖 4-2 namespace 注册表
- 依赖 4-3 ICU lint
- 4-7 / 4-8 同源 field-rules.ts

### 测试标准
- vitest：fixture 包含故意缺失 / 错占位 / 超长，CI 输出 stable

### Project Structure Notes

```
packages/i18n/scripts/
  check-missing-keys.ts
  check-unused-keys.ts
  check-icu.ts
  check-length.ts
  check-schema.ts
  index.ts            # pnpm i18n:check 入口
packages/i18n/dynamic-keys.json
.github/workflows/i18n.yml
```

### References

- [Source: planning/epics/04-i18n.md#ZY-04-10](../../epics/04-i18n.md)
- [Source: planning/story/04-i18n/4-2-four-language-resources.md](./4-2-four-language-resources.md)
- [Source: planning/story/04-i18n/4-3-icu-message-format.md](./4-3-icu-message-format.md)
- [Source: planning/spec/03-frontend.md](../../spec/03-frontend.md)

## Dev Agent Record

### Agent Model Used

(Filled by dev agent at execution time)

### Debug Log References

### Completion Notes List

### File List
