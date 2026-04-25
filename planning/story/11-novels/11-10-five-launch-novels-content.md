# Story 11.10: 5 部启动小说内容

Status: ready-for-dev

## Story

作为 **内容运营**，
我希望 **首发 5 部精品长篇小说，每部 ≥ 30 章，4 语翻译完成，可选音频生成**，
以便 **v1 上线即有充足可读内容**。

## Acceptance Criteria

1. 5 部启动小说定稿入库（具体选题见 `planning/prds/05-novels/04-v1-launch-titles.md`）。
2. 每部 ≥ 30 章，每章 800-1500 字，按句切分，4 语翻译（en/vi/th/id）完整。
3. 拼音字段为标准 5 调；专有名词保留并标注。
4. 句子音频：至少 3 部生成 MVP 音频（TTS via E16 内容工厂）；其余可后置。
5. 翻译质量门槛：母语审稿 ≥ 抽检 10% 章节；不合格回稿。
6. 内容审核：敏感词扫描 + 人工抽查；通过后 `published`。
7. 元数据：每部含封面 / 简介 / 作者 / 分类标签 / HSK 等级。
8. 数据回归：列表 / 详情 / 阅读全链路在 5 部内容上跑通无错。

## Tasks / Subtasks

- [ ] 选题确认 + 大纲（AC: 1）
- [ ] 章节内容入库（AC: 2,7）
- [ ] 4 语翻译（AC: 2,5）
- [ ] TTS 音频生成（AC: 4）
- [ ] 审核 + 上架（AC: 5,6）
- [ ] 回归（AC: 8）

## Dev Notes

### 关键约束
- 翻译走 E16 / DeepL Pro + 母语审稿；不允许机器翻译直发。
- 此 story 主要是内容工程任务，与 11-1 / 11-2 / 11-3 / 11-6 并行交付。
- 上架前后端 e2e 走通。

### Project Structure Notes
- 内容入库走 admin 后台（E17）或 import 脚本：`scripts/import-novels.ts`
- 翻译流水：E16 工厂

### References
- [Source: planning/epics/11-novels.md#ZY-11-10]
- [Source: planning/prds/05-novels/04-v1-launch-titles.md]
- [Source: novels/00-index.md]

### 测试标准
- 内容回归：5 部 × 抽样 3 章 × 4 语
- 性能：阅读器加载

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
