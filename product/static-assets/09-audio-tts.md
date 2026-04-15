# 音频 & TTS 资源 — 详细规格

> **关联文档**: [关卡系统 PRD](../03-level-system.md) | [迷你游戏 PRD](../04-mini-games.md) | [词汇 SRS PRD](../06-vocabulary-srs.md)

---

## 总体说明

音频资源分为两类：**音效（SFX）** 和 **TTS 语音合成**。音效是预录音频文件，TTS 由 Azure Neural TTS 服务实时或预生成。

---

## 一、音效（SFX）规格

### 格式要求

| 属性 | 值 |
|------|-----|
| 主格式 | MP3（128kbps CBR，44.1kHz，单声道）|
| 备用格式 | OGG Vorbis（质量 5，44.1kHz，单声道）|
| 响度标准 | -14 LUFS（统一响度，避免跳跃感） |
| 文件命名 | `sfx-{类别}-{描述}.mp3` |
| 加载策略 | 关键音效预加载，非关键音效懒加载 |

### SFX-01 ~ SFX-15: 完整音效清单

| 编号 | 文件名 | 时长 | 使用场景 | 音效描述 |
|------|--------|------|---------|---------|
| SFX-01 | `sfx-ui-tap.mp3` | ≤0.1s | UI 按钮点击 | 清脆短促的 "嗒" 声，高频 |
| SFX-02 | `sfx-quiz-correct.mp3` | ≤0.5s | 答题正确 | 上升音阶 ding-ding，明亮欢快 |
| SFX-03 | `sfx-quiz-wrong.mp3` | ≤0.5s | 答题错误 | 低沉短促的 "嗡" 声，不刺耳 |
| SFX-04 | `sfx-combo-hit.mp3` | ≤0.3s | 连击计数 +1 | 金属撞击 + 升调，每次连击音高递增 |
| SFX-05 | `sfx-combo-break.mp3` | ≤0.3s | 连击中断 | 玻璃碎裂轻声 |
| SFX-06 | `sfx-star-earn.mp3` | ≤0.8s | 获得星星 | 魔法星尘音效 + 小铃铛，有回响 |
| SFX-07 | `sfx-level-complete.mp3` | ≤2.0s | 关卡通关 | 胜利号角短乐句 + 掌声 |
| SFX-08 | `sfx-level-fail.mp3` | ≤1.5s | 关卡失败 | 下行小调乐句，不沉重，鼓励重试 |
| SFX-09 | `sfx-achievement-unlock.mp3` | ≤1.5s | 成就解锁 | 魔法音效 + 铜锣声 + 星星绽放 |
| SFX-10 | `sfx-coin-collect.mp3` | ≤0.2s | 获得金币/积分 | 硬币落入存钱罐 "叮" |
| SFX-11 | `sfx-boss-appear.mp3` | ≤2.0s | Boss 出场 | 低沉鼓点 + 紧张弦乐短句 |
| SFX-12 | `sfx-boss-defeat.mp3` | ≤2.5s | Boss 被击败 | 史诗号角 + 群众欢呼 |
| SFX-13 | `sfx-countdown-tick.mp3` | ≤0.1s | 倒计时滴答 | 秒表 tick 声 |
| SFX-14 | `sfx-countdown-end.mp3` | ≤0.5s | 倒计时归零 | 闹钟铃声短响 |
| SFX-15 | `sfx-page-transition.mp3` | ≤0.3s | 页面/场景切换 | 柔和的 "唰" 风声 |

### 音效来源建议

| 来源 | 说明 |
|------|------|
| **Freesound.org** | 开源音效库，CC0 / CC-BY 授权 |
| **Mixkit.co** | 免费音效，可商用 |
| **JSFXR / ChipTone** | 在线 8-bit 音效生成器，适合 UI 音效 |
| **自制** | 使用 GarageBand / Audacity 录制和调整 |

---

## 二、TTS 语音合成规格

### 服务配置

| 属性 | 值 |
|------|-----|
| 服务商 | **Azure Cognitive Services — Speech** |
| 语音角色 | `zh-CN-XiaoxiaoNeural`（女声，自然活泼，适合教学）|
| 备选语音 | `zh-CN-YunxiNeural`（男声，适合 Boss 对话配音）|
| 输出格式 | MP3（128kbps）|
| 采样率 | 24kHz（Neural TTS 推荐采样率）|
| 语速 | `rate="-20%"`（比默认慢 20%，便于学习者听清）|

### TTS 内容范围

| 类别 | 预估数量 | 说明 |
|------|---------|------|
| 拼音发音 | ~60 条 | 所有声母、韵母、整体认读音节 |
| 汉字读音 | ~200 条 | 教学范围内的单字发音 |
| 词汇读音 | ~180 条 | 教学范围内的词语发音 |
| 例句朗读 | ~50 条 | 语法教学中的示范句子 |
| **合计** | **~490 条** | |

### TTS 生成策略

```
策略：预生成 + 缓存

1. 开发阶段：使用 Azure TTS API 批量预生成所有音频文件
2. 存储位置：CDN 静态资源（/audio/tts/）
3. 文件命名：tts-{类型}-{内容拼音}.mp3
   例：tts-char-ni.mp3, tts-word-nihao.mp3, tts-sentence-001.mp3
4. 缓存策略：Service Worker 预缓存高频词汇音频
5. 降级方案：CDN 不可用时实时调用 Azure TTS API
```

### TTS 文件命名规则

| 类型 | 命名格式 | 示例 |
|------|---------|------|
| 声母 | `tts-initial-{声母}.mp3` | `tts-initial-b.mp3` |
| 韵母 | `tts-final-{韵母}.mp3` | `tts-final-ao.mp3` |
| 声调示范 | `tts-tone-{音节}{声调}.mp3` | `tts-tone-ma1.mp3` ~ `tts-tone-ma4.mp3` |
| 单字 | `tts-char-{拼音}.mp3` | `tts-char-shan.mp3` |
| 词汇 | `tts-word-{拼音缩写}.mp3` | `tts-word-nihao.mp3` |
| 例句 | `tts-sentence-{编号}.mp3` | `tts-sentence-001.mp3` |

### Azure TTS SSML 示例

```xml
<!-- 单字发音（慢速教学） -->
<speak version="1.0" xmlns="http://www.w3.org/2001/synthesis"
       xmlns:mstts="http://www.w3.org/2001/mstts" xml:lang="zh-CN">
  <voice name="zh-CN-XiaoxiaoNeural">
    <prosody rate="-20%" pitch="+0%">
      你好
    </prosody>
  </voice>
</speak>

<!-- 例句朗读（正常语速） -->
<speak version="1.0" xmlns="http://www.w3.org/2001/synthesis"
       xmlns:mstts="http://www.w3.org/2001/mstts" xml:lang="zh-CN">
  <voice name="zh-CN-XiaoxiaoNeural">
    <prosody rate="-10%">
      <mstts:express-as style="chat">
        我想去图书馆看书。
      </mstts:express-as>
    </prosody>
  </voice>
</speak>

<!-- Boss 对话（男声 + 威严风格） -->
<speak version="1.0" xmlns="http://www.w3.org/2001/synthesis"
       xmlns:mstts="http://www.w3.org/2001/mstts" xml:lang="zh-CN">
  <voice name="zh-CN-YunxiNeural">
    <prosody rate="-10%" pitch="-5%">
      <mstts:express-as style="serious">
        你以为你能通过这里吗？
      </mstts:express-as>
    </prosody>
  </voice>
</speak>
```

---

## 三、背景音乐（BGM）

### BGM 规格

| 属性 | 值 |
|------|-----|
| 格式 | MP3（192kbps CBR，44.1kHz，立体声）|
| 循环 | 所有 BGM 需要**无缝循环**（Loop Point 精确剪辑）|
| 响度 | -18 LUFS（比音效低 4 LUFS，作为背景层）|
| 淡入淡出 | 场景切换时 500ms crossfade |

### BGM-01 ~ BGM-06: 完整 BGM 清单

| 编号 | 文件名 | 时长 | 使用场景 | 风格描述 |
|------|--------|------|---------|---------|
| BGM-01 | `bgm-menu.mp3` | 60-90s 循环 | 主菜单 / 世界地图 | 轻快活泼，越南竹笛 + 中国古筝融合，电子节拍底层 |
| BGM-02 | `bgm-pinyin-zone.mp3` | 60-90s 循环 | 拼音群岛关卡 | 热带海洋风，ukulele + 轻快鼓点 + 偶尔的中国风铃 |
| BGM-03 | `bgm-hanzi-zone.mp3` | 60-90s 循环 | 汉字谷地关卡 | 神秘空灵，古琴 + 环境音垫 + 水滴回声 |
| BGM-04 | `bgm-vocab-zone.mp3` | 60-90s 循环 | 词汇平原关卡 | 热闹市集风，越南二胡 + 轻快打击乐 + 铜铃 |
| BGM-05 | `bgm-grammar-zone.mp3` | 60-90s 循环 | 语法要塞关卡 | 紧凑科技风，电子合成器 + 中国鼓 + 弦乐 tension |
| BGM-06 | `bgm-boss-battle.mp3` | 90-120s 循环 | Boss 战 | 史诗战斗风，管弦乐团 + 电子鼓 + 中国大鼓 + 紧张和弦进行 |

### BGM 来源建议

| 来源 | 说明 |
|------|------|
| **Suno AI** | AI 音乐生成，可精确控制风格，需确认商用授权 |
| **Uppbeat / Epidemic Sound** | 订阅制版权音乐库 |
| **自制** | 使用 GarageBand + 中国乐器采样包合成 |

---

## 四、音频加载与管理

### Phaser 音频加载配置

```javascript
// 预加载关键音效
this.load.audio('sfx-correct', ['audio/sfx/sfx-quiz-correct.mp3', 'audio/sfx/sfx-quiz-correct.ogg']);
this.load.audio('sfx-wrong', ['audio/sfx/sfx-quiz-wrong.mp3', 'audio/sfx/sfx-quiz-wrong.ogg']);

// BGM 使用流式加载
this.load.audio('bgm-pinyin', 'audio/bgm/bgm-pinyin-zone.mp3');
```

### Service Worker 缓存策略

```javascript
// sw.js — 音频缓存策略
const AUDIO_CACHE = 'playlingo-audio-v1';
const PRECACHE_AUDIO = [
  '/audio/sfx/sfx-ui-tap.mp3',
  '/audio/sfx/sfx-quiz-correct.mp3',
  '/audio/sfx/sfx-quiz-wrong.mp3',
  // 高频 TTS
  '/audio/tts/tts-tone-ma1.mp3',
  '/audio/tts/tts-tone-ma2.mp3',
  '/audio/tts/tts-tone-ma3.mp3',
  '/audio/tts/tts-tone-ma4.mp3',
];

// 其余音频使用 Cache-First + 网络回退策略
```

### 音量控制

| 通道 | 默认音量 | 用户可调 |
|------|---------|---------|
| BGM | 0.3（30%）| ✅ 设置页滑块 |
| SFX | 0.7（70%）| ✅ 设置页滑块 |
| TTS | 1.0（100%）| ✅ 设置页滑块 |
| 全局 | 1.0 | ✅ 主音量 / 静音开关 |
