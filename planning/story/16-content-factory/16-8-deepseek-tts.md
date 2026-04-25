# Story 16.8: DeepSeek TTS 集成（句级音频）

Status: ready-for-dev

## Story

作为 **AI 工程师**，
我希望 **封装 DeepSeek TTS（或等价中文 TTS API）为可复用的句级音频生成节点**，
以便 **所有内容工作流（文章 / 课程 / 小说 / 词包）一键生成中文音频，并存储到 R2 + CDN 分发**。

## Acceptance Criteria

1. 模块 `packages/factory/src/flows/audio/`：导出 `synthesizeSentence(text, opts)` 与 `synthesizeBatch(texts[], opts)`。
2. opts：`{ voice: 'female-pro'|'male-pro'|'female-soft'|... , speed: 0.8-1.2, format: 'mp3'|'opus' }`，默认 female-pro / 1.0 / mp3。
3. **存储**：R2 路径 `tts/{sha256(text+voice+speed)[:16]}.mp3`；命中已有对象则跳过上传，直接返回 URL。
4. **CDN**：URL 通过 Cloudflare CDN（`cdn.zhiyu.io/tts/...`）；HEAD 缓存 30d。
5. **失败重试**：5xx / network → 0.5/1/2/4s 指数退避 max 3 次；4xx 立即失败。
6. **批量**：`synthesizeBatch` 内部并发 max 10，统一进度回调。
7. **质量底线**：每条音频时长 > 0.3s 且 < 30s，否则视为 invalid 并重试。
8. **多供应商抽象**：默认 DeepSeek TTS；env `TTS_VENDOR=azure|elevenlabs|...` 可切换；本 story 至少实现 DeepSeek 与 mock。
9. **成本上报**：每次合成写 `tts_call_logs`（vendor / chars / cost_usd / latency_ms / cache_hit）。
10. **失败 fallback**：如供应商不可用，自动降级到 azure（若配置），再失败 → 抛错由上游处理。
11. 单元 + 集成测试：缓存命中率、并发限制、失败重试、空文本 / 超长文本边界。

## Tasks / Subtasks

- [ ] **接口与实现**（AC: 1, 2, 8）
  - [ ] `TTSProvider` 接口
  - [ ] DeepSeek 实现 + mock 实现
- [ ] **R2 + CDN**（AC: 3, 4）
  - [ ] `packages/storage/r2.ts` 复用上传
  - [ ] HEAD 检查跳过重传
- [ ] **重试 / 并发 / 质量**（AC: 5-7）
  - [ ] 并发限制（p-limit）
- [ ] **日志与计费**（AC: 9）
  - [ ] tts_call_logs schema + 写入
- [ ] **降级**（AC: 10）
- [ ] **测试**（AC: 11）

## Dev Notes

### 关键约束
- 文本预处理：去除控制字符 / Markdown / 多余空格；保留中文标点。
- 句子切割由调用方提供，本节点不再切句。
- DeepSeek TTS 单次请求最大 1000 字符，超出 → 调用方应先切句。
- R2 对象 key 含 hash 即为不可变，部署期切 CDN 缓存自动失效。
- 监控：单日 chars 配额 1M，超阈值 PostHog `factory_tts_quota_alert`。

### 关联后续 stories
- 16-4 / 16-5 / 16-6 / 16-7 都依赖
- 6-4 sentence-audio-player（前端消费）
- 19-x observability：tts_call_logs 入库与告警

### Project Structure Notes
- `packages/factory/src/flows/audio/index.ts`
- `packages/factory/src/flows/audio/providers/{deepseek,azure,mock}.ts`
- `packages/storage/r2.ts`
- `packages/db/schema/factory.ts` (tts_call_logs)

### References
- `planning/epics/16-content-factory.md` ZY-16-08
- `planning/spec/07-integrations.md`

### 测试标准
- 单元：缓存命中、并发限制、文本边界
- 集成：mock 5xx → 重试成功；批量 50 条 → 进度回调
- 性能：缓存命中 < 50ms

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
