# Story 1.2: TypeScript 严格配置

Status: ready-for-dev

## Story

As a 开发者,
I want monorepo 全包启用 TypeScript strict 模式与统一路径别名,
so that 编译期捕获类型错误，跨包导入语义清晰且 IDE 体验一致。

## Acceptance Criteria

1. 根 `tsconfig.base.json` 启用 `strict: true`、`noUncheckedIndexedAccess: true`、`exactOptionalPropertyTypes: true`、`noImplicitOverride: true`、`forceConsistentCasingInFileNames: true`。
2. 全部 4 apps + 5 packages 的 `tsconfig.json` extends 自 `tsconfig.base.json`。
3. 路径别名 `@zhiyu/*` 在根 base 配置（`paths`），并通过 `@zhiyu/types` `@zhiyu/ui` 等真实可解析。
4. 每个包 `tsconfig.json` 配置 `references` 指向其依赖包（incremental build）。
5. 根命令 `pnpm -w typecheck`（即 `turbo run typecheck`）在干净仓库下零错误。
6. 至少演示一个跨包导入：`apps/app` 引用 `@zhiyu/ui` 的导出符号，编译通过。
7. ESLint 之前的纯 tsc 通过，禁用 `// @ts-ignore`，必要时使用 `// @ts-expect-error <reason>` 并加注释。
8. CI（在 1.4 中接入）能调用 `pnpm typecheck` 通过。

## Tasks / Subtasks

- [ ] Task 1: tsconfig base 升级（AC: #1, #3）
  - [ ] 写 `tsconfig.base.json` 的 strict 全套
  - [ ] `compilerOptions.paths` 加 `@zhiyu/*: ["./packages/*/src/index.ts"]`
- [ ] Task 2: 各包/应用 tsconfig（AC: #2, #4）
  - [ ] 9 个 tsconfig.json extends base + 自定义 outDir / rootDir
  - [ ] packages 启用 `composite: true` + `references`
  - [ ] apps 配 `references` 到所依赖包
- [ ] Task 3: 跨包导入演示（AC: #6）
  - [ ] `packages/ui/src/index.ts` 导出 `noop` 占位函数
  - [ ] `apps/app/src/main.tsx` 引用并调用
- [ ] Task 4: typecheck pipeline（AC: #5, #8）
  - [ ] `turbo.json` 的 `typecheck` 任务 dependsOn `^typecheck` 利用 references
  - [ ] 各包 `package.json` 加 `"typecheck": "tsc --noEmit"`
- [ ] Task 5: 风险脚本（AC: #7）
  - [ ] 添加 ESLint rule（在 1.3 中开启）：`@typescript-eslint/ban-ts-comment` 仅允许 `expect-error` 带注释

## Dev Notes

### 关键点
- `noUncheckedIndexedAccess` 会引入大量 `T | undefined` —— 团队需训练使用 narrow 后访问
- `exactOptionalPropertyTypes` 与 React props 兼容：使用 `?:` 时不写 `undefined`
- packages 启 `composite` 后产物落 `dist/`，apps 直接走 Vite（不走 tsc emit）
- 路径别名解析：Vite 通过 `vite-tsconfig-paths` 插件；API 通过 `tsx` + `tsconfig-paths/register`

### Project Structure Notes
路径别名一律为 `@zhiyu/*`，与 spec/03-frontend.md § 4.2 描述一致。

### References

- [Source: planning/epics/01-platform-foundation.md#ZY-01-02](../../epics/01-platform-foundation.md)
- [Source: planning/spec/03-frontend.md#四-packages-ui](../../spec/03-frontend.md)
- [Source: planning/sprint/01-platform-foundation.md#W1](../../sprint/01-platform-foundation.md)

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
