# UI 图标 — 详细规格

> **关联文档**: [用户系统 PRD](../01-user-system.md) | [关卡系统 PRD](../03-level-system.md)

---

## 总体说明

UI 图标用于**非游戏模式**的网页 UI（导航、按钮、状态提示等）和**游戏模式**内的 HUD 元素。

### 图标体系方案

| 类别 | 方案 | 说明 |
|------|------|------|
| 通用 UI 图标 | **Lucide Icons**（开源 SVG 图标库） | 导航、操作、状态等通用图标，直接使用 `lucide-react` 组件 |
| 自定义品牌图标 | **手绘 SVG** | PlayLingo 特有的图标，需单独设计 |
| 游戏内 HUD 图标 | **PNG 精灵图** | 在 Phaser 引擎内使用，见 [06-game-textures.md](./06-game-textures.md) |

### 尺寸规范

| 属性 | 值 |
|------|-----|
| 基准尺寸 | 24 × 24 px |
| 描边粗细 | 2px（与 Lucide 默认一致）|
| 可用尺寸 | 16 / 20 / 24 / 32 / 40 px（通过 `size` prop 控制）|
| 颜色 | 继承 `currentColor`，由 Tailwind CSS 类控制 |
| 格式 | SVG（内联组件），不生成独立图片文件 |

---

## 一、Lucide 通用图标清单

以下图标直接使用 `lucide-react` 库，无需额外设计或生成图片。

### 导航图标

| 图标名 | Lucide 组件 | 使用位置 |
|--------|------------|---------|
| 首页 | `<Home />` | 底部导航栏 |
| 地图 | `<Map />` | 底部导航栏——世界地图 |
| 背包/复习 | `<BookOpen />` | 底部导航栏——词汇复习 |
| 个人中心 | `<User />` | 底部导航栏 |
| 排行榜 | `<Trophy />` | 底部导航栏 / 排行页面 |
| 设置 | `<Settings />` | 个人中心——设置入口 |
| 返回 | `<ArrowLeft />` | 页面顶部导航返回 |
| 关闭 | `<X />` | 弹窗关闭按钮 |
| 菜单 | `<Menu />` | H5 端汉堡菜单 |

### 游戏状态图标

| 图标名 | Lucide 组件 | 使用位置 |
|--------|------------|---------|
| 星（已获得）| `<Star />` (`fill`) | 关卡评价、成就 |
| 星（未获得）| `<Star />` | 关卡评价占位 |
| 锁定 | `<Lock />` | 未解锁关卡 |
| 解锁 | `<Unlock />` | 已解锁关卡 |
| 勾选 | `<Check />` | 已完成关卡 |
| 火焰 | `<Flame />` | 连续学习天数 |
| 闪电 | `<Zap />` | 经验值 / 能量 |
| 时钟 | `<Clock />` | 计时器 |
| 心 | `<Heart />` | 生命值（网页端显示时）|

### 关卡操作图标

| 图标名 | Lucide 组件 | 使用位置 |
|--------|------------|---------|
| 播放 | `<Play />` | 开始关卡 / 播放音频 |
| 暂停 | `<Pause />` | 游戏暂停 |
| 刷新 | `<RotateCcw />` | 重新开始 |
| 音量 | `<Volume2 />` | 音频播放 / TTS |
| 静音 | `<VolumeX />` | 关闭声音 |
| 麦克风 | `<Mic />` | 语音输入（未来功能） |
| 提示 | `<Lightbulb />` | 关卡提示 |
| 跳过 | `<SkipForward />` | 跳过过场动画 |

### 操作反馈图标

| 图标名 | Lucide 组件 | 使用位置 |
|--------|------------|---------|
| 正确 | `<CheckCircle />` | 答题正确反馈 |
| 错误 | `<XCircle />` | 答题错误反馈 |
| 信息 | `<Info />` | 提示信息 |
| 警告 | `<AlertTriangle />` | 警告提示 |

### 支付 & 社交图标

| 图标名 | Lucide 组件 | 使用位置 |
|--------|------------|---------|
| 皇冠 | `<Crown />` | 会员标识 |
| 信用卡 | `<CreditCard />` | 支付方式 |
| 礼物 | `<Gift />` | 推荐奖励 |
| 分享 | `<Share2 />` | 分享按钮 |
| 链接 | `<Link />` | 复制推荐链接 |
| 下载 | `<Download />` | 保存海报 |
| 复制 | `<Copy />` | 复制推荐码 |

---

## 二、自定义品牌图标（需设计）

以下图标是 PlayLingo 品牌特有的，Lucide 库中没有对应组件，需要**手绘 SVG 设计**。

### ICON-01: PlayLingo Logo 图标

| 属性 | 值 |
|------|-----|
| 文件名 | `logo-icon.svg` |
| 尺寸 | 40 × 40 px 基准 |
| 使用位置 | Favicon、PWA 图标、导航栏 Logo、加载动画 |

**设计说明**：
- 字母 "P" 和 "L" 组合，"P" 的圆弧部分变形为龙尾巴形状
- 主色：`#06B6D4`（cyan-500）+ `#F59E0B`（amber-500）
- 需要提供多个变体：
  - `logo-icon.svg`（40×40 单图标）
  - `logo-full.svg`（带文字 "PlayLingo" 横版）
  - `logo-pwa-192.png`（192×192 PWA 图标）
  - `logo-pwa-512.png`（512×512 PWA 图标）
  - `favicon.ico`（32×32 + 16×16 多尺寸）

### ICON-02: 区域图标（4 个）

| 文件名 | 区域 | 设计说明 |
|--------|------|---------|
| `zone-pinyin.svg` | 拼音群岛 | 海浪中的字母 "ā"，蓝绿色调 |
| `zone-hanzi.svg` | 汉字谷地 | 发光的汉字 "字" 在山谷剪影中，翡翠金色调 |
| `zone-vocab.svg` | 词汇平原 | 市场灯笼 + 对话气泡，暖红金色调 |
| `zone-grammar.svg` | 语法要塞 | 城堡塔楼 + 齿轮，钢蓝金色调 |

**用途**：世界地图中的区域入口图标、成就页面区域分类、导航面包屑

### ICON-03: 语言国旗图标（4 个）

| 文件名 | 语言 | 说明 |
|--------|------|------|
| `flag-vi.svg` | 越南语 | 越南国旗简化版（红底黄星）|
| `flag-zh.svg` | 中文 | 中国国旗简化版（红底五星）|
| `flag-en.svg` | 英语 | 圆形英语图标（简化美/英旗组合）|
| `flag-id.svg` | 印尼语 | 印尼国旗简化版（红白二色）|

**用途**：落地页 Footer 语言切换、设置页语言列表、分享海报语言标记

**设计说明**：
- 圆形裁剪，24×24 基准
- 简化处理，不追求100%还原国旗细节，保证小尺寸辨识度
- 可使用开源的 `flag-icons` 或 `circle-flags` 库替代手绘

### ICON-04: 声调可视化图标（4 个）

| 文件名 | 声调 | 设计说明 |
|--------|------|---------|
| `tone-1.svg` | 第一声（阴平）| 水平直线，蓝色 |
| `tone-2.svg` | 第二声（阳平）| 上升斜线，绿色 |
| `tone-3.svg` | 第三声（上声）| V 形折线，金色 |
| `tone-4.svg` | 第四声（去声）| 下降斜线，红色 |

**用途**：拼音教学界面、声调狙击手规则说明、词汇卡片声调标记

---

## 三、安装与使用指南

### Lucide Icons 安装

```bash
npm install lucide-react
```

### 使用示例

```tsx
import { Home, Map, BookOpen, User, Trophy } from 'lucide-react';

// 底部导航栏
<nav className="flex justify-around py-2 bg-white/80 backdrop-blur">
  <Home size={24} className="text-gray-600" />
  <Map size={24} className="text-gray-600" />
  <BookOpen size={24} className="text-gray-600" />
  <User size={24} className="text-gray-600" />
  <Trophy size={24} className="text-cyan-500" />
</nav>
```

### 自定义图标规范

所有自定义 SVG 图标需遵循：
- `viewBox="0 0 24 24"` 统一画布
- `stroke="currentColor"` 继承颜色
- `stroke-width="2"` 统一描边
- `stroke-linecap="round"` + `stroke-linejoin="round"` 圆角端点
- 不使用 `fill` 除非明确需要实心
