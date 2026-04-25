# Story 9.8: WordPack 与拼音渲染器（pinyin-pro）

Status: ready-for-dev

## Story

作为 **游戏开发者**，
我希望 **统一的 WordPack 提供词题源数据、PinyinRenderer 把汉字一键渲染为「拼音 + 汉字」组合**，
以便 **12 款游戏共用同一套拼音排版与音调标注**。

## Acceptance Criteria

1. `WordPack.load({ source: 'hsk1' | 'hsk2' | 'current_track' | 'wrong_set' })` 返回数组 `{ word, pinyin, tone, translation_jsonb, audio_url }`。
2. MVP 仅支持 `hsk1` + `current_track`（其他源在后续）。
3. 数据来源：构建期从课程内容生成 JSON，CDN 加载；缺失走 API fallback。
4. `PinyinRenderer` 输入 `(text, opts)`，返回 PixiJS Container（拼音上方 + 汉字下方），字号 / 颜色 / 音调色（4 调 + 轻声）可配。
5. 自动调用 `pinyin-pro` 的 `pinyin(text, { toneType: 'symbol' })`。
6. 性能：10 字渲染 < 5ms。
7. 单元测试：四声调 + 多字符串。
8. 提供 `RenderInline(text)` 便捷方法（默认参数）。

## Tasks / Subtasks

- [ ] **WordPack**（AC: 1,2,3）
  - [ ] `src/data/WordPack.ts`
- [ ] **PinyinRenderer**（AC: 4,5,8）
  - [ ] `src/render/PinyinRenderer.ts`
- [ ] **音调色映射**
  - [ ] tone 1-4 + 轻声
- [ ] **测试**（AC: 7）

## Dev Notes

### 关键约束
- pinyin-pro v3 API；不要 hard-code 拼音映射。
- 拼音字号默认为汉字字号 0.5x。

### 关联后续 stories
- 9-1 包骨架前置
- 10-* 几乎所有游戏使用

### Project Structure Notes
- `packages/game-engine/src/data/WordPack.ts`
- `packages/game-engine/src/render/PinyinRenderer.ts`

### References
- `planning/epics/09-game-engine.md` ZY-09-08

### 测试标准
- 单元：pinyin / tone / 多字符
- 性能：10 字 < 5ms

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
