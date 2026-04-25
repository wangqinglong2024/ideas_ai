# Story 4.4: 按语言加载字体

Status: ready-for-dev

## Story

As a 前端 / 性能负责人,
I want 按 `<html lang>` 动态加载子集化字体（越南 Be Vietnam Pro / 泰语 Noto Sans Thai / 印尼 Inter / 英语 Inter / 中文学习内容 LXGW WenKai）,
so that 用户只下载本语言所需的字形子集，首屏字体 ≤ 80KB，移动端 LCP 改善 200ms+。

## Acceptance Criteria

1. 5 套字体按语言子集化打包（unicode-range 切分），每语言 woff2 ≤ 80KB。
2. UI 字体按 `<html lang>` 自动 preload；中文 LXGW 仅在阅读器 / 课程展示中文学习内容时按需加载。
3. CSS 使用 `@font-face` 多 unicode-range 定义；fallback 字体栈 `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`。
4. 切换语言后 200ms 内字体可见，无 FOUT 闪烁（用 `font-display: swap` + `Font Loading API` 主动 await）。
5. 字体放置 R2 / Cloudflare CDN，CDN cache `immutable, max-age=31536000`。
6. 子集生成脚本 `scripts/build-fonts.ts` 基于 `glyphhanger`/`fonttools` 自动跑；CI 缓存。
7. Lighthouse 字体相关 audit 全绿；CLS < 0.05。
8. 字体许可证文件齐全（OFL/SIL）放 `apps/web/public/fonts/LICENSE.md`。

## Tasks / Subtasks

- [ ] Task 1: 字体源采集与许可证（AC: #1, #8）
  - [ ] 下载 5 套字体源；检查 OFL/SIL；写 LICENSE.md
- [ ] Task 2: 子集化构建（AC: #1, #6）
  - [ ] `scripts/build-fonts.ts`：输入 woff/ttf → 输出 woff2 + 多 unicode-range
  - [ ] CI 缓存子集 hash
- [ ] Task 3: CSS 与按需加载（AC: #2, #3, #4）
  - [ ] `packages/ui/src/fonts.css` @font-face 定义
  - [ ] `useFontsForLang(lang)` hook：Font Loading API 主动 await
  - [ ] LXGW 在阅读器组件入口 lazy 触发
- [ ] Task 4: CDN 与验证（AC: #5, #7）
  - [ ] R2 上传 + Cache-Control 头
  - [ ] Lighthouse CI 跑 4 语 + 字体 audit

## Dev Notes

### 关键架构约束
- **禁止全字体加载**：泰语 / 越南语字形数量大，必须 unicode-range 切片。
- **中文字体特别**：LXGW WenKai ≥ 8MB，必须**按需 + 仅 CJK Unified Ideographs U+4E00-9FFF 子集**，不进首屏。
- **不允许 Google Fonts 直接引用**：所有字体走自托管，规避 GDPR / 速度问题。

### 关联后续 stories
- 4-1 提供 `<html lang>` 切换钩子
- 5-1 PWA Service Worker 缓存字体
- 6-3 阅读器（Discover）按需加载 LXGW

### 测试标准
- 视觉：每语言截图 → CI Chromatic 对比
- Lighthouse：FCP / LCP / CLS

### Project Structure Notes

```
apps/web/public/fonts/
  vi/be-vietnam-pro-subset.woff2
  th/noto-sans-thai-subset.woff2
  en/inter-subset.woff2
  id/inter-subset.woff2  # 与 en 同源
  zh/lxgw-wenkai-cjk.woff2
  LICENSE.md
packages/ui/src/fonts.css
packages/ui/src/hooks/useFontsForLang.ts
scripts/build-fonts.ts
```

### References

- [Source: planning/epics/04-i18n.md#ZY-04-04](../../epics/04-i18n.md)
- [Source: planning/spec/03-frontend.md](../../spec/03-frontend.md)
- [Source: planning/story/02-design-system/2-5-fonts-typography.md](../02-design-system/2-5-fonts-typography.md)

## Dev Agent Record

### Agent Model Used

(Filled by dev agent at execution time)

### Debug Log References

### Completion Notes List

### File List
