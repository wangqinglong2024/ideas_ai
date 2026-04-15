# 成就徽章 — 详细规格与 Flux 提示词

> **关联文档**: [成就荣誉 PRD](../09-achievement-honor.md)

---

## 总体说明

成就徽章用于**非游戏模式**的成就/荣誉展示页面，以及解锁弹窗动画。每个徽章是一个独立的圆形奖牌。

### 尺寸与适配

| 属性 | 值 |
|------|-----|
| 原始尺寸 | 256 × 256 px（@2x，显示为 128 × 128 逻辑像素） |
| 格式 | WebP（质量 90，透明背景） |
| 显示方式 | 圆形展示，已完成的全彩，未完成的显示为灰度加锁 |
| H5 与 PC | 共用同一套，按组件大小缩放 |

### 风格统一要求

所有徽章共享"圆形奖牌"基础造型，不同等级用不同边框颜色区分：

| 等级 | 边框 | 说明 |
|------|------|------|
| 铜 | 铜棕色金属边框 | 基础成就 |
| 银 | 亮银色金属边框 | 进阶成就 |
| 金 | 璀璨金色金属边框 + 微发光 | 高级成就 |

```
Style Prefix（所有徽章共用）:
A circular game achievement medal/badge icon, 256x256px. Round metallic 
frame border, centered icon illustration inside. Clean cel-shaded style 
with slight metallic sheen on the border. Vibrant colors, clear readable 
icon at small sizes. Transparent background outside the circle.
Trendy modern game achievement aesthetic.

Negative Prefix:
realistic photo, dark gloomy, blurry, low quality, text, watermark, 
non-circular shape, complex background, multiple icons
```

---

## 一、学习进度类（6 枚）

### BADGE-01: 初出茅庐

| 属性 | 值 |
|------|-----|
| 文件名 | `badge-first-lesson.webp` |
| 等级 | 铜 |
| 解锁条件 | 完成第一个关卡 |
| 图标描述 | 一只小脚印踏出第一步，背景是一条发光的路 |

```
{Style Prefix}
Bronze metallic circular frame. Inside: a single small footprint stepping 
onto a glowing golden path that extends into the distance. The footprint 
has a cute sparkle effect. Warm sunrise colors in the background (orange 
to yellow gradient). Symbolizes "first step on the journey".

{Negative Prefix}
```

### BADGE-02: 拼音入门

| 属性 | 值 |
|------|-----|
| 文件名 | `badge-pinyin-start.webp` |
| 等级 | 铜 |
| 解锁条件 | 完成拼音群岛第 1 章 |
| 图标描述 | 字母 "a" 在海浪上冲浪 |

```
{Style Prefix}
Bronze metallic circular frame. Inside: a stylized Pinyin letter "a" 
character surfing on a tropical wave, the letter has a cute face with 
determined expression. Ocean spray and sparkle effects. Turquoise and 
gold color scheme. Fun and dynamic.

{Negative Prefix}
```

### BADGE-03: 声调达人

| 属性 | 值 |
|------|-----|
| 文件名 | `badge-tone-master.webp` |
| 等级 | 银 |
| 解锁条件 | 四声识别准确率 ≥ 90% |
| 图标描述 | 四个声调符号环绕一个音叉 |

```
{Style Prefix}
Silver metallic circular frame with polished shine. Inside: a golden tuning 
fork in the center, vibrating with energy waves. Four tone marks (ˉ ˊ ˇ ˋ) 
orbiting around it in blue, green, gold, and red respectively, leaving 
small trail effects. Musical note particles scattered.

{Negative Prefix}
```

### BADGE-04: 汉字学者

| 属性 | 值 |
|------|-----|
| 文件名 | `badge-hanzi-scholar.webp` |
| 等级 | 银 |
| 解锁条件 | 累计学习 100 个汉字 |
| 图标描述 | 一支毛笔在金色墨水中写字 |

```
{Style Prefix}
Silver metallic circular frame. Inside: an elegant Chinese calligraphy 
brush writing a Chinese character in luminous golden ink, the character 
partially formed with flowing golden strokes. Ink splatter sparkle effects. 
Dark navy background contrasting with golden calligraphy. Scholarly and 
elegant.

{Negative Prefix}
```

### BADGE-05: 词汇宝库

| 属性 | 值 |
|------|-----|
| 文件名 | `badge-vocab-vault.webp` |
| 等级 | 金 |
| 解锁条件 | 累计学习 500 个词汇 |
| 图标描述 | 装满发光汉字的宝箱 |

```
{Style Prefix}
Gold metallic circular frame with soft golden glow. Inside: an open ornate 
treasure chest overflowing with glowing Chinese characters floating upward 
from inside. Characters in various warm colors (gold, amber, coral). 
Sparkle and light ray effects emanating from the chest. Rich and rewarding.

{Negative Prefix}
```

### BADGE-06: 毕业典礼

| 属性 | 值 |
|------|-----|
| 文件名 | `badge-graduation.webp` |
| 等级 | 金 |
| 解锁条件 | 完成所有 4 个区域 |
| 图标描述 | 学士帽 + 卷轴 + 四区域小图标 |

```
{Style Prefix}
Gold metallic circular frame with golden sparkle glow. Inside: a graduation 
cap (mortarboard) floating above a rolled diploma scroll tied with red 
ribbon. Around the cap: four tiny icons representing the game zones — a 
wave (Pinyin), a mountain (Hanzi), a market stall (Vocab), a castle tower 
(Grammar). Confetti and star particles celebrating. Warm golden light.

{Negative Prefix}
```

---

## 二、连续学习类（4 枚）

### BADGE-07: 三日打卡

| 属性 | 值 |
|------|-----|
| 文件名 | `badge-streak-3.webp` |
| 等级 | 铜 |
| 解锁条件 | 连续学习 3 天 |
| 图标描述 | 3 颗小火焰排成一排 |

```
{Style Prefix}
Bronze metallic circular frame. Inside: three small stylized flame icons 
in a row, each slightly different size (growing left to right), warm 
orange-gold gradient. Small "3" number subtly integrated. Warm ember 
particles around flames.

{Negative Prefix}
```

### BADGE-08: 周打卡

| 属性 | 值 |
|------|-----|
| 文件名 | `badge-streak-7.webp` |
| 等级 | 银 |
| 解锁条件 | 连续学习 7 天 |
| 图标描述 | 一周日历图标，每天都有火焰标记 |

```
{Style Prefix}
Silver metallic circular frame. Inside: a stylized calendar/week view with 
7 columns, each topped with a burning flame icon forming a continuous fire 
streak across all 7 days. Calendar in warm cream, flames in orange-gold 
gradient. Dynamic upward energy.

{Negative Prefix}
```

### BADGE-09: 月打卡

| 属性 | 值 |
|------|-----|
| 文件名 | `badge-streak-30.webp` |
| 等级 | 金 |
| 解锁条件 | 连续学习 30 天 |
| 图标描述 | 巨大的火焰变成了凤凰形状 |

```
{Style Prefix}
Gold metallic circular frame with golden aura glow. Inside: a magnificent 
stylized flame that has transformed into a phoenix shape, wings spread 
wide, flaming tail feathers. Golden-orange-red fire gradient. Sparkle 
particle trail. Majestic and impressive, symbolizing sustained dedication.

{Negative Prefix}
```

### BADGE-10: 百日之约

| 属性 | 值 |
|------|-----|
| 文件名 | `badge-streak-100.webp` |
| 等级 | 金（特殊动画） |
| 解锁条件 | 连续学习 100 天 |
| 图标描述 | 金龙环绕的 "100" |

```
{Style Prefix}
Gold metallic circular frame with elaborate ornate engravings and glowing 
rim. Inside: the number "100" in bold golden 3D metallic text, with a 
small cute golden Chinese dragon coiled around the numbers. Dragon's eyes 
sparkle with stars. Firework-like particle effects in background. Premium 
and celebratory feel.

{Negative Prefix}
```

---

## 三、迷你游戏类（5 枚）

### BADGE-11: 声调神射手

| 属性 | 值 |
|------|-----|
| 文件名 | `badge-tone-sniper.webp` |
| 等级 | 银 |
| 解锁条件 | 声调狙击手单局满分 |
| 图标描述 | 准星中心命中声调符号 |

```
{Style Prefix}
Silver metallic circular frame. Inside: a cyan-blue neon crosshair/reticle 
with a golden tone mark "ˇ" in the exact center, hit effect burst radiating 
outward. Small score "100%" in tiny text. Precise and satisfying.

{Negative Prefix}
```

### BADGE-12: 部首拆解王

| 属性 | 值 |
|------|-----|
| 文件名 | `badge-radical-king.webp` |
| 等级 | 银 |
| 解锁条件 | 部首大爆炸单局完美通关 |
| 图标描述 | 汉字从碎片完美组合 + 皇冠 |

```
{Style Prefix}
Silver metallic circular frame. Inside: a Chinese character "字" assembled 
from glowing puzzle pieces clicking into place, with a small golden crown 
floating above it. Assembly completion sparkle effect. Jade green and gold 
color scheme.

{Negative Prefix}
```

### BADGE-13: 拼音飞车手

| 属性 | 值 |
|------|-----|
| 文件名 | `badge-drift-racer.webp` |
| 等级 | 银 |
| 解锁条件 | 拼音漂移单局时间记录前 10% |
| 图标描述 | 赛车拖着拼音字母尾迹 |

```
{Style Prefix}
Silver metallic circular frame. Inside: a small turquoise racing car 
speeding from left to right, leaving a trail of glowing Pinyin letters 
(a, o, e, i, u) in its wake like exhaust trail. Motion blur lines. 
Dynamic speed feeling. Neon cyan and gold.

{Negative Prefix}
```

### BADGE-14: 全能玩家

| 属性 | 值 |
|------|-----|
| 文件名 | `badge-all-rounder.webp` |
| 等级 | 金 |
| 解锁条件 | 三个迷你游戏各获得 ≥ 3 星 |
| 图标描述 | 三个迷你游戏图标组合 + 三颗星 |

```
{Style Prefix}
Gold metallic circular frame with golden glow. Inside: three small game 
icons arranged in a triangle — a crosshair (Tone Sniper), a puzzle piece 
(Radical Blitz), a car (Pinyin Drift). Three golden stars floating above. 
A ribbon banner wrapping around the bottom. Premium all-around achievement.

{Negative Prefix}
```

### BADGE-15: Boss 克星

| 属性 | 值 |
|------|-----|
| 文件名 | `badge-boss-slayer.webp` |
| 等级 | 金 |
| 解锁条件 | 击败所有 4 个 Boss |
| 图标描述 | 四把交叉的武器 + 碎裂盾牌 |

```
{Style Prefix}
Gold metallic circular frame with fiery glow. Inside: four stylized game 
weapons arranged in an X-cross pattern — a sword, a brush, an abacus, 
and a book. In the center: a cracked dark shield/emblem breaking apart. 
Behind: dramatic red and gold burst effect. Powerful and triumphant.

{Negative Prefix}
```

---

## 四、社交类（5 枚）

### BADGE-16: 初次邀请

| 属性 | 值 |
|------|-----|
| 文件名 | `badge-first-referral.webp` |
| 等级 | 铜 |
| 解锁条件 | 成功邀请 1 位好友 |
| 图标描述 | 两个手拉手的小人 |

```
{Style Prefix}
Bronze metallic circular frame. Inside: two cute simplified character 
silhouettes holding hands, one slightly taller. A small glowing link/chain 
icon connecting them. Warm friendly colors (turquoise and gold). Heart 
sparkle above their joined hands.

{Negative Prefix}
```

### BADGE-17: 推荐达人

| 属性 | 值 |
|------|-----|
| 文件名 | `badge-referral-pro.webp` |
| 等级 | 银 |
| 解锁条件 | 成功邀请 10 位好友 |
| 图标描述 | 一群小人围在一起 + 扩音器 |

```
{Style Prefix}
Silver metallic circular frame. Inside: a small megaphone/loudspeaker 
icon emitting sound waves, and multiple tiny character silhouettes 
gathering around in a semi-circle. Numbers "10+" subtly shown. Community 
and influence feeling. Warm coral and gold.

{Negative Prefix}
```

### BADGE-18: 超级推荐官

| 属性 | 值 |
|------|-----|
| 文件名 | `badge-referral-super.webp` |
| 等级 | 金 |
| 解锁条件 | 推荐收益累计达到 $100 |
| 图标描述 | 金色皇冠 + 人群 + 钻石 |

```
{Style Prefix}
Gold metallic circular frame with premium sparkle. Inside: a golden crown 
at the top, below it a glowing diamond/gem, surrounded by a network graph 
of connected dots (representing a referral network). Golden light rays. 
VIP and prestigious feeling. Rich gold and royal purple accents.

{Negative Prefix}
```

### BADGE-19: 会员先锋

| 属性 | 值 |
|------|-----|
| 文件名 | `badge-first-member.webp` |
| 等级 | 银 |
| 解锁条件 | 首次开通会员 |
| 图标描述 | 闪亮的会员卡 |

```
{Style Prefix}
Silver metallic circular frame. Inside: a stylized premium membership card 
floating at a slight angle, golden/holographic surface with star pattern, 
small crown icon on the card. Subtle rainbow holographic sheen effect. 
Light rays emanating from behind the card. Premium and exclusive.

{Negative Prefix}
```

### BADGE-20: 年度会员

| 属性 | 值 |
|------|-----|
| 文件名 | `badge-annual-member.webp` |
| 等级 | 金 |
| 解锁条件 | 开通年度会员 |
| 图标描述 | 钻石镶嵌的 VIP 徽章 |

```
{Style Prefix}
Gold metallic circular frame with diamond-encrusted border effect. Inside: 
a shield-shaped VIP emblem with a large sparkling diamond at center, 
"VIP" letters in metallic gold below. Laurel wreath decoration on sides. 
Royal purple velvet background inside the shield. Luxurious and exclusive.

{Negative Prefix}
```

---

## 五、特殊/隐藏类（5 枚）

### BADGE-21: 夜猫子

| 属性 | 值 |
|------|-----|
| 文件名 | `badge-night-owl.webp` |
| 等级 | 铜（隐藏） |
| 解锁条件 | 凌晨 0:00-5:00 期间完成关卡 |
| 图标描述 | 可爱的猫头鹰 + 月亮 |

```
{Style Prefix}
Bronze metallic circular frame. Inside: a cute little owl with large round 
glowing yellow eyes, perched on a branch. A crescent moon behind it. Night 
sky with stars. The owl holds a tiny book. Cozy midnight blue and golden 
moon colors.

{Negative Prefix}
```

### BADGE-22: 闪电学习

| 属性 | 值 |
|------|-----|
| 文件名 | `badge-speed-learner.webp` |
| 等级 | 银（隐藏） |
| 解锁条件 | 30 分钟内完成一整章关卡 |
| 图标描述 | 闪电 + 书本翻页特效 |

```
{Style Prefix}
Silver metallic circular frame. Inside: a bold neon-yellow lightning bolt 
striking through an open book that's rapidly flipping pages, pages flying 
outward. Speed lines and electric sparkle effects. Dynamic and energetic. 
Cyan and gold color accents.

{Negative Prefix}
```

### BADGE-23: 完美主义者

| 属性 | 值 |
|------|-----|
| 文件名 | `badge-perfectionist.webp` |
| 等级 | 金（隐藏） |
| 解锁条件 | 任意章节所有关卡全部 3 星通关 |
| 图标描述 | 三颗发光星 + 钻石棱镜 |

```
{Style Prefix}
Gold metallic circular frame with radiant glow. Inside: three large 
brilliant golden stars arranged in a triangle formation, a sparkling 
diamond prism in the center refracting rainbow light. Lens flare and 
starburst effects. Perfect, brilliant, dazzling achievement.

{Negative Prefix}
```

### BADGE-24: 语言桥梁

| 属性 | 值 |
|------|-----|
| 文件名 | `badge-language-bridge.webp` |
| 等级 | 金（隐藏） |
| 解锁条件 | 使用全部 4 种 UI 语言各完成至少 1 个关卡 |
| 图标描述 | 四面小旗帜组成的桥 |

```
{Style Prefix}
Gold metallic circular frame with rainbow-shimmer border. Inside: a small 
ornate bridge spanning across, with four tiny flags planted on it — 
Vietnamese flag, Chinese flag, US/UK flag, and Indonesian flag. Below the 
bridge: a flowing river of glowing characters from all four languages. 
Multicultural celebration. Warm and inclusive.

{Negative Prefix}
```

### BADGE-25: 龙的传人

| 属性 | 值 |
|------|-----|
| 文件名 | `badge-dragon-heir.webp` |
| 等级 | 金（终极/隐藏） |
| 解锁条件 | 解锁所有其他成就 |
| 图标描述 | 小龙进化为金色巨龙 + 所有区域缩影 |

```
{Style Prefix}
Gold metallic circular frame with animated glow effect (elaborate golden 
filigree border). Inside: a majestic golden Chinese dragon (evolved form 
of the mascot Xiao Long), coiled in a spiral with its body forming a 
frame around the center. In the center: a glowing orb containing miniature 
representations of all four game zones. The dragon's eyes are brilliant 
sapphire blue with star catchlights. Golden light and particle effects 
throughout. The ultimate achievement badge — prestigious and awe-inspiring.

{Negative Prefix}
```
