# Story 6.4: 句子音频播放

Status: ready-for-dev

## Story

作为 **学习者**，
我希望 **点击句子能听标准发音，并能整篇连播且支持变速**，
以便 **训练听力与跟读**。

## Acceptance Criteria

1. 句子点击 → 播放对应 `audio_url`（Howler.js 单实例切换）。
2. 整篇连播按钮：从当前句开始，自动顺序播放至末尾；播放中显示「暂停」。
3. 速度切换：0.75x / 1x / 1.25x，作用于当前播放及后续句。
4. 当前正在播放的句子高亮（背景色 + 左侧条），结束后还原。
5. 中断处理：用户点击其他句 → 立即切换到该句继续连播链。
6. 音频缓存：相同 url 不重复加载（Howler instance map）。
7. 错误兜底：音频 404 / 网络错时 toast 并跳过到下一句。
8. iOS Safari 静音模式与自动播放限制：首次连播必须由用户手势触发。

## Tasks / Subtasks

- [ ] **音频管理器**（AC: 1,5,6,7）
  - [ ] `SentenceAudioController` 单例
  - [ ] Howl 实例缓存 + LRU 淘汰

- [ ] **连播 + 变速**（AC: 2,3,5）
  - [ ] 队列推进逻辑
  - [ ] `rate()` 全局更新

- [ ] **高亮联动**（AC: 4）
  - [ ] 通过 ref / context 把 currentId 同步到 SentenceBlock

- [ ] **错误处理**（AC: 7）
  - [ ] onloaderror / onplayerror → toast + skipNext

- [ ] **iOS 兼容**（AC: 8）
  - [ ] 首次播放必须在 click 事件回调中

## Dev Notes

### 关键约束
- 多句切换可能产生瞬时叠音，需在切换前 stop 旧实例。
- 音频文件由内容运营或 TTS 生成，可能有缺失，UI 需兜底。

### 关联后续 stories
- 6-3 提供 SentenceBlock 渲染层
- 6-7 阅读时长 hook 不受播放影响

### Project Structure Notes
- `apps/app/src/features/reader/sentence-audio-controller.ts`
- `apps/app/src/features/reader/use-sentence-audio.ts`

### References
- `planning/epics/06-discover-china.md` ZY-06-04
- Howler.js docs

### 测试标准
- 单元：队列推进与切换
- E2E：点击句播放；连播；速度切换；错误跳过
- iOS Safari 真机回归

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
