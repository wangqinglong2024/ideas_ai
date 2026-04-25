# Story 16.6: 小说章生成工作流（novel chapter flow）

Status: ready-for-dev

## Story

作为 **小说内容运营**，
我希望 **AI 基于前章上下文自动生成 3000 字小说新章**，
以便 **持续更新 12 大题材的章节，维持读者订阅与日活**。

## Acceptance Criteria

1. LangGraph DAG：`load_context → outline → draft → continuity_check → polish → split → translate → audio → eval`。
2. 输入：`{ novel_id, chapter_index, target_chars: 2500-3500, beats?: string[] }`；自动加载该小说前 3 章摘要 + 角色卡 + 设定卡作为 context。
3. **load_context**：从 `novels` / `novel_chapters` / `novel_lore`（角色 / 设定 / 时间线 / 词典）抓取，组装成 system prompt（裁剪到 12k tokens 内）。
4. **outline**：Claude，3-5 个 beat 大纲，承接前章伏笔。
5. **draft**：DeepSeek-chat 或 deepseek-reasoner（题材敏感时切 Claude），3000 字范围。
6. **continuity_check**：Claude 检查角色名 / 时间线 / 设定一致性，输出 `issues[]`；任一致命 issue → 回到 outline 重跑（max 2）。
7. **polish**：Claude，润色对话与节奏。
8. **split**：句级切分（与 16-4 共用）。
9. **translate**：5 语（耗时较大，并发 batch=20）。
10. **audio**：可选；按 novel.has_audio 开关，TTS 句级；本 story 默认 off，开关 on 时启用 16-8。
11. **eval**：16-10 评估器（连贯性 / 文笔 / 节奏 / 设定一致性 4 维度）≥ 0.7。
12. 单章成本上限：$1.50。
13. 端到端 P95 ≤ 12 分钟。
14. 输出：`novel_chapters`（status=`pending_review`）+ `novel_chapter_translations` + 句级表（如启用音频）。
15. **续写记忆**：本章接收成 published 后，由独立 cron（17-x admin 触发）将摘要 / 新角色 / 关键事件回写 `novel_lore`，本 story 含"摘要回写"节点（在 published 后由 trigger 调用，非主 graph）。
16. 单元 + 集成测试：fixture "都市修真" 第 5 章生成 + 连贯性检查触发。

## Tasks / Subtasks

- [ ] **DAG + 节点**（AC: 1-11）
  - [ ] `packages/factory/src/flows/novel/`
  - [ ] context 裁剪策略（按 token 预算优先保留：人物 > 时间线 > 设定 > 摘要）
- [ ] **continuity check**（AC: 6）
  - [ ] issues schema + 致命 / 警告分级
- [ ] **续写记忆回写**（AC: 15）
  - [ ] published trigger → summary write back
- [ ] **持久化与并发**（AC: 9, 14）
- [ ] **成本控制**（AC: 12）
- [ ] **测试**（AC: 16）

## Dev Notes

### 关键约束
- 同一小说连续章节必须强制按 chapter_index 顺序，不允许跳号生成。
- `novel_lore` 是手工 + AI 双写，AI 写入需标 `source='ai'` 字段，人审可修改。
- 题材敏感（doujin / 玄幻擦边）：走专门 prompt 集 + 内容审核节点（v1.5 后续 story，本 story 留 hook）。
- 翻译策略：长章节按段落 batch；缓存 key 含 chapter content hash，重跑不重译。
- 端到端 12min 是 mock TTS 关闭；启用 TTS 后 < 30min（异步队列）。

### 关联后续 stories
- 16-9 / 16-8 / 16-10
- 11-x novels 已存在 schema
- 17-8 admin 小说章节管理
- 12-3 章节解锁（与本 story 解耦）

### Project Structure Notes
- `packages/factory/src/flows/novel/graph.ts`
- `packages/factory/src/flows/novel/nodes/{load-context,continuity-check,...}.ts`
- `packages/db/schema/novels.ts`（确认 novel_lore 字段）

### References
- `planning/epics/16-content-factory.md` ZY-16-06
- `planning/epics/11-novels.md`
- `planning/spec/06-ai-factory.md` § 7

### 测试标准
- 集成：fixture novel + 5 章存量上下文 → 第 6 章生成
- 失败路径：continuity issue 致命 → 重跑大纲
- 成本：超额自动停止
- 质量：mock eval < 0.7 → 转人审

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
