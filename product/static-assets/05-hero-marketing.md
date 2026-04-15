# 落地页 & 营销素材 — 详细规格与 Flux 提示词

> **关联文档**: [用户系统 PRD](../01-user-system.md) | [推荐返佣 PRD](../08-referral-commission.md)

---

## 总体说明

此类素材用于**非游戏模式**的网页展示和社交分享，不在 Phaser 游戏引擎内使用。

---

## HERO-01: 落地页主画面

### 基本信息

| 属性 | 值 |
|------|-----|
| 文件名 | `hero-landing.webp` |
| 尺寸 | 1920 × 800 px（PC 横幅比例）|
| 格式 | WebP 质量 85 |
| 使用位置 | 落地页 `/` 顶部 Hero Section |

### 响应式适配策略

| 平台 | 处理方式 |
|------|---------|
| PC（≥1024px）| 完整显示 1920 × 800，`object-fit: cover` |
| H5 竖屏（<768px）| 使用 `object-position: center 30%`，上方裁剪较多、保留中下方核心内容 |
| 备选方案 | 若中心裁剪效果不佳，可单独制作 H5 版 `hero-landing-mobile.webp`（750 × 600） |

### 安全区说明
- **核心内容区域**：中央 1200 × 600 px，所有主要角色和 Logo 必须在此范围内
- **边缘区域**：可被裁剪的装饰性背景

### 使用场景
用户首次访问 PlayLingo 看到的第一画面。需要在 3 秒内传达：
1. 这是一个中文学习游戏
2. 很有趣、很时尚
3. 面向年轻越南用户

画面正中是 PlayLingo Logo + 标语（文字由前端叠加，不烧录到图中），两侧是主角阿明和小龙。背景是游戏世界的缩影——拼音岛、汉字谷、词汇集市的远景混合。

### Flux 提示词

```
Digital illustration wide banner, 1920x800 pixels, vibrant game promotional 
art. Center composition: a magical portal/gateway made of swirling Chinese 
characters and Pinyin letters, glowing with neon blue and gold energy. 
On the left side: a cheerful Vietnamese young man (Minh character) in 
trendy streetwear (white tee, blue jacket) striking a confident pose. 
On the right side: a cute chibi blue Chinese dragon mascot flying 
excitedly. Behind the portal: a fantastical landscape showing glimpses 
of different game zones — tropical beach with Pinyin letter rocks, ancient 
canyon with glowing Chinese characters, bustling market with colorful signs. 
Background: gradient sky from warm sunset orange to deep starry blue. 
Floating particles, neon glow accents, sparkle effects throughout. 
Gen-Z trendy aesthetic — bold colors, dynamic energy, inviting adventure.
Open clear space in the exact center-top area for logo/text overlay.
Art style: modern game illustration, semi-anime, vibrant saturated colors.

Negative: realistic photo, dark gloomy, text/letters burned into image, 
watermark, low quality, blurry, horror, scary
```

---

## HERO-02: 分享海报模板

### 基本信息

| 属性 | 值 |
|------|-----|
| 文件名 | `share-poster-template.webp` |
| 尺寸 | 1080 × 1920 px（9:16 竖版，适合手机壁纸/Story/朋友圈）|
| 格式 | WebP 质量 85 |
| 使用位置 | 推荐分享功能，用户将此海报保存/分享给好友 |

### 动态信息区域
海报模板只生成背景图，以下信息由前端动态叠加（居前端渲染，不在图中）：
- 用户头像 + 昵称
- 推荐码 / 二维码
- 邀请文案（跟随用户当前 UI 语言，4 种语言版本）
- PlayLingo Logo

### 安全区说明
- **上方 1/3**（y: 0-640px）：留白区域，用于用户信息和文案叠加
- **中间 1/3**（y: 640-1280px）：核心装饰画面
- **下方 1/3**（y: 1280-1920px）：留白区域，用于二维码和按钮叠加

### Flux 提示词

```
Vertical mobile poster background template, 1080x1920 pixels (9:16 portrait).
Decorative background illustration with open spaces at top and bottom for 
text overlay. Center section shows a compact magical scene: a cute chibi 
blue dragon flying through a swirl of colorful Chinese characters and 
Pinyin letters, surrounded by sparkle effects and neon glow. Small game 
elements scattered around: tiny treasure chests, golden stars, musical 
notes, achievement badges. Background: smooth gradient from warm coral-pink 
at top through purple in the middle to deep indigo-blue at bottom. 
Subtle pattern of faint Chinese characters as watermark texture. 
Bokeh light circles and floating particles throughout. 
Gen-Z trendy aesthetic — glassmorphism elements, subtle grid overlay, 
holographic rainbow accents.
Art style: clean vector-like illustration, vibrant colors, modern social 
media aesthetic.

Negative: realistic photo, text, numbers, QR code, human faces, dark gloomy, 
low quality, blurry, watermark, complex cluttered scene
```

---

## HERO-03: OG 社交分享图

### 基本信息

| 属性 | 值 |
|------|-----|
| 文件名 | `og-share-image.webp` |
| 尺寸 | 1200 × 630 px（Open Graph 标准比例）|
| 格式 | WebP 质量 85 |
| 使用位置 | 网页 `<meta property="og:image">` 标签 |

### 使用场景
当用户在 Facebook、Zalo、Line、Twitter 等社交平台分享 PlayLingo 链接时自动显示的预览图。需要在小尺寸预览（约 300 × 157px）中仍然清晰可辨。

### Flux 提示词

```
A game promotional social share image, 1200x630 pixels, simple bold 
composition. Left half: the cute chibi blue Chinese dragon mascot with 
sparkly eyes and a happy wave, surrounded by floating Chinese characters 
"你好" and Pinyin "nǐ hǎo" in stylized neon-glow font. Right half: 
clean open space with subtle gradient (warm coral to gold) for text overlay. 
Bottom edge: a simplified miniature game world landscape silhouette 
(islands, mountains, castle). Top left corner: subtle sparkle/star 
decoration. Overall: bright, clean, immediately readable at small sizes.
Art style: bold flat illustration with slight gradient shading, vibrant 
colors, modern app promotional style.

Negative: realistic photo, complex detailed scene, cluttered, text burned in, 
dark, low quality, blurry, watermark
```
