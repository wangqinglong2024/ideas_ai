# Story 2.1: Design Tokens 包

Status: ready-for-dev

## Story

As a 设计系统开发者,
I want 一个 `packages/tokens` 包统一吐出 colors / spacing / radius / shadow / motion / type 令牌（亮 / 暗双套）,
so that app / admin / web 三端 + Storybook 都能共享同一套真理源，避免硬编码与不一致。

## Acceptance Criteria

1. `packages/tokens` 创建并接入 monorepo（`workspace:*` 可被 ui / app / admin / web 引用）。
2. 输出 6 类令牌：`colors / spacing / radius / shadow / motion / type`，全部按 `light` 和 `dark` 双套定义。
3. 三种产物同时生成：
   - **CSS 变量**：`tokens.css` 含 `:root` (light) + `[data-theme="dark"]` 覆盖
   - **TS 常量**：`index.ts` 导出 typed const（具备 IntelliSense）
   - **Tailwind preset**：`tailwind.preset.cjs` 给 v4 `@plugin` 引用
4. Cosmic Refraction 调色板（**禁止使用紫色**）；主色 Rose（`#E63E62` 系），中性灰 Slate。
5. spacing token 4 基准（`0/0.5/1/1.5/2/3/4/6/8/12/16/24` × 4px）。
6. motion token 提供 `duration-{fast,base,slow}` 与 `ease-{in,out,inOut,spring}`。
7. type scale：`xs/sm/base/lg/xl/2xl/3xl/4xl/5xl` 含 line-height 与 letter-spacing。
8. 单元测试：`pnpm --filter=@zhiyu/tokens test` 验证 light / dark 数量一致 + 关键 hex 校验。
9. README 含使用样例：CSS / TS / Tailwind 各一段。

## Tasks / Subtasks

- [ ] Task 1: 包骨架（AC: #1）
  - [ ] `packages/tokens/package.json`（exports: `./css`, `./ts`, `./tailwind`）
  - [ ] tsup 双 ESM/CJS 构建
  - [ ] tsconfig extends 根 base
- [ ] Task 2: 令牌定义（AC: #2, #4, #5, #6, #7）
  - [ ] `src/colors.ts` light + dark Rose+Slate 调色板
  - [ ] `src/spacing.ts`、`src/radius.ts`、`src/shadow.ts`、`src/motion.ts`、`src/type.ts`
  - [ ] `src/index.ts` 聚合导出 typed `tokens` const
- [ ] Task 3: 产物生成（AC: #3）
  - [ ] `scripts/build-css.ts` 生成 `dist/tokens.css`（双主题）
  - [ ] `scripts/build-tailwind.ts` 生成 `dist/tailwind.preset.cjs`
- [ ] Task 4: 测试与文档（AC: #8, #9）
  - [ ] vitest：light/dark key parity；关键 hex 锚点
  - [ ] README 三段示例 + 升级指南

## Dev Notes

### 关键约束
- **无紫色**：调色板按 ux/02 §1 定义；如需 accent 用 Aqua/Teal 而非 Violet。
- **CSS 变量命名**：`--zy-color-bg-base`、`--zy-color-fg-base`、`--zy-radius-md` 等，统一 `--zy-*` 前缀。
- **TS 类型**：`type Tokens = typeof tokens`；导出 `type ColorToken = keyof typeof tokens.colors.light`。
- **Tailwind preset**：使用 v4 `@theme` block 注入；不可用 v3 `theme.extend` 风格。

### 与后续 stories 关系
- 2-2 依赖本 story 的 Tailwind preset
- 2-3 玻璃态系统使用 colors / shadow tokens
- 2-4 主题切换基于 `[data-theme]` CSS 变量切换
- 2-6 / 2-7 / 2-8 组件全部引用 token

### Project Structure Notes

```
packages/tokens/
  package.json
  tsconfig.json
  tsup.config.ts
  scripts/
    build-css.ts
    build-tailwind.ts
  src/
    colors.ts
    spacing.ts
    radius.ts
    shadow.ts
    motion.ts
    type.ts
    index.ts
  __tests__/
    parity.test.ts
  dist/
    tokens.css
    tailwind.preset.cjs
    index.{mjs,cjs,d.ts}
  README.md
```

### Testing Standards
- vitest（与根仓库一致）
- 视觉验证延后到 2-10 Storybook + Chromatic

### References
- [Source: planning/epics/02-design-system.md#ZY-02-01](../../epics/02-design-system.md)
- [Source: planning/sprint/02-design-system.md](../../sprint/02-design-system.md)
- [Source: planning/ux/02-design-tokens.md](../../ux/02-design-tokens.md)
- [Source: planning/spec/03-frontend.md](../../spec/03-frontend.md)

## Dev Agent Record

### Agent Model Used

(Filled by dev agent at execution time)

### Debug Log References

### Completion Notes List

### File List
