# 游戏纹理 & 道具素材 — 详细规格与 Flux 提示词

> **关联文档**: [迷你游戏 PRD](../04-mini-games.md) | [关卡系统 PRD](../03-level-system.md) | [响应式布局 PRD](../10-responsive-layout.md)

---

## 总体说明

游戏纹理和道具素材用于 **Phaser 3 游戏引擎内的横屏 16:9 画面**。这些是精灵图（Sprite）和 UI 元素，需要透明背景、精确像素控制。

### 尺寸与适配

| 属性 | 值 |
|------|-----|
| 格式 | PNG（需透明背景 + 精确像素边缘）|
| 打包方式 | 同类素材使用 **Sprite Sheet（精灵图集）**，由 TexturePacker 自动生成 atlas |
| 缩放 | 基于 16:9 画布设计稿 1280 × 720 逻辑分辨率 @2x 出图 |
| H5 与 PC | 共用同一套纹理，Phaser 引擎自动缩放 |

### 风格统一要求

```
Style Prefix（所有游戏纹理共用）:
Game asset sprite illustration, clean cel-shaded style, vibrant saturated 
colors, transparent background. Bold outlines (2px dark stroke), slight 
3D-ish shading for depth. Trendy modern mobile game aesthetic. 
Consistent warm lighting from top-left.

Negative Prefix:
realistic photo, dark gloomy, blurry, low quality, complex background, 
text, watermark, shadow on transparent area
```

---

## 一、声调狙击手（Tone Sniper）纹理

### TEX-TS-01: 声调方块（4 种）

| 属性 | 值 |
|------|-----|
| 文件名 | `tone-block-1.png` ~ `tone-block-4.png` |
| 单个尺寸 | 128 × 128 px |
| 数量 | 4 个（对应四声） |
| 使用位置 | 声调狙击手游戏——从上方下落的方块目标 |

| 方块 | 声调符号 | 配色 |
|------|----------|------|
| 一声 ˉ | 平直箭头 | 🔵 宝石蓝底 + 白色符号 |
| 二声 ˊ | 上升箭头 | 🟢 翡翠绿底 + 白色符号 |
| 三声 ˇ | V 形箭头 | 🟡 琥珀金底 + 白色符号 |
| 四声 ˋ | 下降箭头 | 🔴 宝石红底 + 白色符号 |

```
{Style Prefix}
A set of 4 game tile blocks for a tone-shooting game. Each block is a 
rounded square (128x128px) with a bold colored background and a white tone 
mark symbol in the center:
Block 1: Sapphire blue with flat horizontal arrow (First tone ˉ)
Block 2: Emerald green with rising arrow pointing up-right (Second tone ˊ)
Block 3: Amber gold with V-shaped/checkmark arrow (Third tone ˇ)
Block 4: Ruby red with falling arrow pointing down-right (Fourth tone ˋ)
Each block has a subtle glossy highlight in top-left corner, soft shadow 
on bottom edge, and a thin dark outline. Clean, readable at small sizes.
Transparent background around each block.

{Negative Prefix}
```

### TEX-TS-02: 准星 / 瞄准器

| 属性 | 值 |
|------|-----|
| 文件名 | `tone-crosshair.png` |
| 尺寸 | 96 × 96 px |
| 使用位置 | 声调狙击手——玩家瞄准的十字准星 |

```
{Style Prefix}
A stylized game crosshair/reticle icon, 96x96px. Circular design with 
four pointed markers at top, bottom, left, right positions, and a small 
dot in the center. Neon cyan-blue color with a soft glow/bloom effect. 
Futuristic but friendly style. Thin clean lines.
Transparent background.

{Negative Prefix}
```

### TEX-TS-03: 命中特效（Sprite Sheet）

| 属性 | 值 |
|------|-----|
| 文件名 | `tone-hit-effect.png` |
| 尺寸 | 640 × 128 px（5 帧 × 128 × 128）|
| 使用位置 | 声调狙击手——击中方块后的爆炸特效 |

```
{Style Prefix}
A sprite sheet with 5 animation frames side by side (640x128 total, each 
frame 128x128). Showing a hit/burst effect animation:
Frame 1: Small bright flash point
Frame 2: Expanding starburst with sparkle particles  
Frame 3: Maximum size burst with colorful confetti fragments
Frame 4: Dissipating sparkles, fading outward
Frame 5: Final fading particles, nearly gone
Colors: bright warm gold center transitioning to neon cyan particles.
Transparent background.

{Negative Prefix}
```

---

## 二、部首大爆炸（Radical Blitz）纹理

### TEX-RB-01: 部首碎片

| 属性 | 值 |
|------|-----|
| 文件名 | `radical-piece-template.png` |
| 尺寸 | 96 × 96 px（单个碎片）|
| 数量 | 约 30 个常用部首，每个单独出图 |
| 使用位置 | 部首大爆炸——散落在画面上需要玩家拖放组合的部首碎片 |

```
{Style Prefix}
A single Chinese radical character piece for a drag-and-drop puzzle game. 
The radical is written in bold, stylized brush calligraphy on a small 
stone tablet piece (96x96px). The stone piece has an irregular organic 
shape (like a broken pottery shard or puzzle piece), warm cream/beige 
stone color with subtle crack texture. The Chinese radical character is 
painted in dark ink with slight brush texture. A faint golden glow around 
the edges of the stone. Example radical: "氵" (water radical).
Transparent background around the stone piece.

{Negative Prefix}
```

> **实际制作**：上述 prompt 中的 "氵" 替换为具体部首（亻、口、木、火、土、心、手/扌、日、月 等），生成 30 张独立碎片。

### TEX-RB-02: 组合目标框

| 属性 | 值 |
|------|-----|
| 文件名 | `radical-target-frame.png` |
| 尺寸 | 192 × 192 px |
| 使用位置 | 部首大爆炸——碎片拖放的目标组合区域 |

```
{Style Prefix}
A game target frame/slot for placing puzzle pieces, 192x192px. A golden 
ornate square frame with rounded inner corners, styled like an ancient 
Chinese seal/stamp frame. Thick golden border with subtle dragon-scale 
pattern engraving. The inner area is semi-transparent with a faint 
pulsing glow effect (shown as a soft radial gradient from center). 
Small decorative knot patterns at each corner. Inviting "place here" 
visual cue.
Transparent background outside the frame.

{Negative Prefix}
```

### TEX-RB-03: 炸弹道具

| 属性 | 值 |
|------|-----|
| 文件名 | `radical-bomb.png` |
| 尺寸 | 96 × 96 px |
| 使用位置 | 部首大爆炸——干扰道具，需要玩家在倒计时前回避 |

```
{Style Prefix}
A cute cartoon bomb game prop, 96x96px. Classic round black bomb shape 
with a lit fuse sparking at the top, but styled in a fun non-scary way. 
The bomb has a small Chinese character "爆" (explode) in red on its surface. 
Tiny sparkle and smoke effects around the fuse. Warm orange fuse glow. 
Playful game item aesthetic.
Transparent background.

{Negative Prefix}, scary, realistic explosive
```

---

## 三、拼音漂移（Pinyin Drift）纹理

### TEX-PD-01: 赛车

| 属性 | 值 |
|------|-----|
| 文件名 | `drift-car.png` |
| 尺寸 | 160 × 80 px（俯视 / 侧视按需调整）|
| 使用位置 | 拼音漂移——玩家控制的赛车，在赛道上收集拼音字母 |

```
{Style Prefix}
A cute stylized racing car game sprite, top-down view, 160x80px. Compact 
sporty design, bright neon turquoise body color with a golden racing 
stripe down the center. Small golden star decal on hood. Round headlights 
visible as bright dots. Slightly cartoonish proportions — slightly wider 
and stubbier than realistic. Clean aerodynamic shape. Subtle motion lines 
behind to suggest speed.
Transparent background.

{Negative Prefix}, realistic car
```

### TEX-PD-02: 拼音字母收集物

| 属性 | 值 |
|------|-----|
| 文件名 | `drift-pinyin-pickup.png` |
| 尺寸 | 64 × 64 px |
| 数量 | 基础模板 1 个，字母由 Phaser 运行时渲染在上面 |
| 使用位置 | 拼音漂移——赛道上散落的可收集拼音字母气泡 |

```
{Style Prefix}
A shiny collectible bubble/orb game item, 64x64px. A translucent glowing 
sphere with a soft golden-yellow glow. Glass-like material with highlight 
reflection at top-left and subtle rim glow. Inside the sphere is a faint 
swirling energy. The actual letter content will be rendered by the game 
engine on top, so the sphere should have a clear center area.
Transparent background.

{Negative Prefix}
```

### TEX-PD-03: 障碍物

| 属性 | 值 |
|------|-----|
| 文件名 | `drift-obstacle.png` |
| 尺寸 | 80 × 80 px |
| 使用位置 | 拼音漂移——赛道上需要回避的障碍物 |

```
{Style Prefix}
A game obstacle item, top-down view, 80x80px. A red warning cone/barrier 
with yellow stripes, styled as a cute miniature road obstacle. Small 
flashing red light on top. Clean bold outlines. Immediately readable 
as "avoid this" at high speed.
Transparent background.

{Negative Prefix}
```

### TEX-PD-04: 加速道具

| 属性 | 值 |
|------|-----|
| 文件名 | `drift-powerup-speed.png` |
| 尺寸 | 64 × 64 px |
| 使用位置 | 拼音漂移——加速 buff 道具 |

```
{Style Prefix}
A speed boost power-up game item, 64x64px. A floating neon-blue lightning 
bolt icon inside a glowing hexagonal capsule. Electric sparkle effects 
around it. Bright and eye-catching, immediately communicates "speed up".
Transparent background.

{Negative Prefix}
```

---

## 四、通用游戏 UI 纹理

### TEX-UI-01: 生命值爱心（3 种状态）

| 属性 | 值 |
|------|-----|
| 文件名 | `heart-full.png`, `heart-half.png`, `heart-empty.png` |
| 尺寸 | 48 × 48 px |
| 使用位置 | 关卡答题 + 迷你游戏——左上角生命值显示 |

```
{Style Prefix}
Three game heart/life icons, each 48x48px:
1. Full heart: Bright ruby red, glossy 3D-style with white highlight, 
   warm glow, full and plump.
2. Half heart: Left half ruby red and glossy, right half desaturated 
   gray with crack line down the middle.
3. Empty heart: Fully desaturated gray outline only, thin stroke, 
   hollow inside with subtle shadow.
Clean bold style, consistent game UI aesthetic.
Transparent background.

{Negative Prefix}
```

### TEX-UI-02: 星级评价（3 种状态）

| 属性 | 值 |
|------|-----|
| 文件名 | `star-full.png`, `star-half.png`, `star-empty.png` |
| 尺寸 | 64 × 64 px |
| 使用位置 | 关卡结算——星级评价（1-3 星）|

```
{Style Prefix}
Three game star rating icons, each 64x64px:
1. Full star: Bright golden yellow, five-pointed, glossy 3D metallic 
   shine, warm golden glow effect, sparkle highlight at top point.
2. Half star: Left half golden and shiny, right half desaturated silver-gray.
3. Empty star: Silver-gray outline only, thin dark stroke, slight 
   inner shadow, no fill.
Clean bold game UI style.
Transparent background.

{Negative Prefix}
```

### TEX-UI-03: 连击火焰特效

| 属性 | 值 |
|------|-----|
| 文件名 | `combo-fire.png` |
| 尺寸 | 128 × 128 px |
| 使用位置 | 关卡答题 + 迷你游戏——连击 ≥3 时右侧显示的火焰 |

```
{Style Prefix}
A stylized combo fire/flame effect icon, 128x128px. Not realistic fire — 
a stylized, energetic flame shape with gradient from bright golden-yellow 
at base through orange to vivid red at the tips. Sparkle particles and 
small star icons mixed into the flame. Dynamic upward motion feel with 
flowing curves. A small ember trail at the bottom. Exciting, energetic, 
rewards the player's combo streak.
Transparent background.

{Negative Prefix}
```

### TEX-UI-04: Boss 血条框

| 属性 | 值 |
|------|-----|
| 文件名 | `boss-hp-frame.png` |
| 尺寸 | 480 × 48 px |
| 使用位置 | Boss 关卡——画面顶部 Boss 血条外框 |

```
{Style Prefix}
A wide game boss health bar frame/border, 480x48px. Ornate metallic frame 
with Chinese-inspired design: golden border with subtle dragon-scale 
engravings, small flame decorations at both ends, a tiny skull/boss icon 
socket on the left side. The interior is transparent (HP fill bar rendered 
by engine). Polished gold and dark metal color scheme. Imposing but clean.
Transparent background, transparent interior.

{Negative Prefix}
```

### TEX-UI-05: 经验值 / 进度条框

| 属性 | 值 |
|------|-----|
| 文件名 | `progress-bar-frame.png` |
| 尺寸 | 320 × 32 px |
| 使用位置 | 关卡内——经验值 / 进度条外框 |

```
{Style Prefix}
A clean game progress bar frame, 320x32px. Simple rounded rectangle shape 
with a thin dark border (2px), subtle inner bevel/shadow for depth. Small 
decorative jade ornament at the right end. Neutral warm cream/gold border 
color. Interior is transparent for the fill bar. Sleek and modern.
Transparent background, transparent interior.

{Negative Prefix}
```
