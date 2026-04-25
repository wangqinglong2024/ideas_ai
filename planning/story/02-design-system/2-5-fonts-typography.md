# Story 2.5: 字体子集 + 排版

Status: ready-for-dev

## Story

As a 多语言用户,
I want 应用按当前 locale 自动加载子集化字体（拉丁 / 中文 / 越南 / 泰 / 印地）,
so that 首屏加载快（≤ 50KB above-the-fold），CJK 字形清晰，越泰印展示正确。

## Acceptance Criteria

1. 选定字体并自托管：
   - 拉丁：**Inter** v4（VF）
   - 中文（简繁）：**LXGW WenKai Screen** v1.420（开源风格 + 屏显优化）
   - 越南拉丁扩展：Inter VF（含 vi 子集）
   - 泰文：**Noto Sans Thai** VF
   - 印地（天城文）：**Noto Sans Devanagari** VF
2. 子集化脚本（`scripts/subset-fonts.ts`）按 unicode-range 切分，输出 `.woff2` 到 `apps/*/public/fonts/`。
3. CSS `@font-face` 用 `unicode-range` 实现按需下载（浏览器自动选择子集）。
4. 关键子集（拉丁 + Latin Extended + 当前 locale 主子集）使用 `<link rel="preload" as="font">`。
5. type scale 应用于 `body / h1-h6 / .text-xs ... .text-5xl`，与 2-1 tokens 一致。
6. `font-display: swap`；fallback stack 完整（system-ui + 各语言 fallback）。
7. 中文 LXGW：CJK Common 子集 ≤ 800 KB；按 HSK 1-3 高频字优先 preload 60 KB。
8. 性能预算：首屏（above the fold）字体下载 ≤ 50 KB（gzip 计算）。
9. 4 个 locale 各跑一遍 Lighthouse → CLS = 0、FCP < 1.5s（中端机 4G）。

## Tasks / Subtasks

- [ ] Task 1: 字体许可与下载（AC: #1）
  - [ ] 验证 Inter / LXGW / Noto SIL OFL 合规
  - [ ] 下载源文件到 `tools/fonts-source/`
- [ ] Task 2: 子集化脚本（AC: #2, #3, #7）
  - [ ] `scripts/subset-fonts.ts` 用 `subset-font` npm 包
  - [ ] LXGW 按 unicode-range 切片：CJK Common / HSK1-3 高频 / HSK4-6 / 其他
- [ ] Task 3: 全局 CSS（AC: #3, #5, #6）
  - [ ] `packages/ui/src/styles/typography.css`
  - [ ] `@font-face` 全 locale 声明
- [ ] Task 4: preload 注入（AC: #4, #8）
  - [ ] vite plugin 按当前 locale 注入 preload
- [ ] Task 5: 性能验证（AC: #9）
  - [ ] CI Lighthouse 4 locale × 移动 / 桌面

## Dev Notes

### 关键约束
- LXGW 是开源风格手写，符合 ux/01 设计原则的"温暖友好"
- 切忌全字体加载（CJK 全集 6MB+）
- preload 数量 ≤ 4，否则浪费带宽

### Project Structure Notes
```
tools/fonts-source/      # gitignored, 放原始 ttf
scripts/subset-fonts.ts
packages/ui/src/styles/typography.css
apps/{app,admin,web}/public/fonts/
```

### 依赖链
- 依赖：2-1（type scale tokens）、2-2（PurgeCSS 不影响 @font-face）
- 被依赖：2-6 核心组件；E04 i18n

### Testing Standards
- Lighthouse CI（在 1-4 GH Actions 接入）
- 视觉回归 typography stories（2-10）

### References
- [Source: planning/epics/02-design-system.md#ZY-02-05](../../epics/02-design-system.md)
- [Source: planning/ux/14-i18n-fonts.md](../../ux/14-i18n-fonts.md)
- [Source: planning/ux/16-performance-quality.md](../../ux/16-performance-quality.md)

## Dev Agent Record

### Agent Model Used

(Filled by dev agent at execution time)

### Debug Log References

### Completion Notes List

### File List
