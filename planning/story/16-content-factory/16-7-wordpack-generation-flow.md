# Story 16.7: 词包生成工作流（wordpack flow）

Status: ready-for-dev

## Story

作为 **课程 / 游戏内容运营**，
我希望 **AI 基于主题或 HSK 等级自动生成完整词包**，
以便 **为 12 款游戏 / 课程提供高质量词汇资源（含拼音 / 翻译 / 例句 / 音频）**。

## Acceptance Criteria

1. LangGraph DAG：`select_words → enrich → translate → audio → eval`。
2. 输入：`{ topic: string, hsk_level?: 1-6, target_count: 10-50, source?: 'theme'|'hsk'|'custom', custom_words?: string[] }`。
3. **select_words**：
   - source=`hsk` 时直接从 HSK 词表过滤目标级别 N 个；
   - source=`theme` 时 Claude 推荐主题相关 N 个，并自动关联 HSK 等级（若可识别）；
   - source=`custom` 直接使用入参，跳过 LLM。
4. **enrich**：每词生成 `pinyin`、`part_of_speech`、`definition_zh`、`example_sentence_zh`、`example_pinyin`，HSK 关联字段（`hsk_level`）。
5. **translate**：每词的 definition / example_sentence 翻译 5 语（调用 16-9）。
6. **audio**：词 + 例句 TTS（调用 16-8），句级 R2。
7. **eval**：抽样 10% 词条 Claude 校验拼音 / 翻译，错误率 > 5% → 回到 enrich。
8. 输出：`wordpacks`（status=`pending_review`）+ `wordpack_words` + `wordpack_word_translations`。
9. 单包成本上限：$0.20。
10. 端到端 P95 ≤ 3 分钟。
11. **去重**：同 wordpack 内禁止重复词；不同包允许重复但 enrich 缓存共享（key=word + locale）。
12. **HSK 关联**：每词如能命中 HSK 表，必须填 hsk_level；否则留空 + warning。
13. 单元 + 集成测试：HSK1 主题"问候"词包 12 词，断言 DB / 翻译 / 音频。

## Tasks / Subtasks

- [ ] **词源策略**（AC: 3）
  - [ ] HSK 词表 import（packages/data/hsk/）
  - [ ] theme select prompt
- [ ] **Enrich 节点**（AC: 4, 11, 12）
  - [ ] enrich 缓存（Redis，key=hash(word+locale)）
- [ ] **DAG 与持久化**（AC: 1, 8）
- [ ] **eval 抽样**（AC: 7）
- [ ] **测试**（AC: 13）

## Dev Notes

### 关键约束
- pinyin 不依赖 LLM 生成（成本与准确性问题），由本地 hanzi-pinyin 库 + jieba 选音；LLM 仅用于例句与翻译。
- `wordpack_words.word` 唯一约束（packid, word），DB 层强制。
- example sentence 长度 < 20 字符（游戏 UI 显示宽度限制）；超长 → 重生。
- HSK 关联使用 `packages/data/hsk/level-{1-6}.json` 词表。
- 缓存命中率目标 ≥ 30%（运营时间越久越高）。

### 关联后续 stories
- 16-9 / 16-8 / 16-10
- 9-8 wordpack-pinyin-renderer（消费方）
- 10-a2 wordpack-selector
- 17-8 admin 词包管理

### Project Structure Notes
- `packages/factory/src/flows/wordpack/`
- `packages/data/hsk/`（HSK 词表静态资源）
- `packages/db/schema/wordpacks.ts`

### References
- `planning/epics/16-content-factory.md` ZY-16-07
- `planning/epics/09-game-engine.md` 9-8

### 测试标准
- 集成：theme="greetings" + hsk=1 → 10 词包
- enrich 缓存命中 / 不命中分支
- eval 错误率 mock 8% → 重跑

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
