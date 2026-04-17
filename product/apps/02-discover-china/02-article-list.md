# 类目文章列表页

> 所属模块：应用端 — 发现中国
> 页面层级：第 2 层（类目首页 → 文章列表）
> 页面情绪：**沉浸、探索、期待**
> 进入方式：类目首页点击类目卡片 → Push 转场（从右侧推入）
> 关联文档：[01-category-homepage.md](01-category-homepage.md) | [03-article-detail.md](03-article-detail.md)

---

## 一、页面布局

```
┌─────────────────────────────────┐
│  顶部安全区                       │
├─────────────────────────────────┤
│  [←] 中国历史            [排序↕] │  ← 顶部导航栏
├─────────────────────────────────┤
│  ┌─────────────────────────────┐│
│  │                             ││
│  │     [类目封面大图]           ││  ← 类目封面区
│  │                             ││
│  │  中国历史：上下五千年的       ││
│  │  朝代更替与传奇故事          ││  ← 类目简介（2-3 行）
│  └─────────────────────────────┘│
├─────────────────────────────────┤
│  ┌──────┬──────────────────────┐│
│  │[缩略图]│ 秦始皇统一六国的传奇 ││  ← 文章卡片 1
│  │      │ The Legend of Qin...  ││
│  │      │ 2026-04-15 · 👁 1.2k ││
│  │      │                  ♡  ││
│  └──────┴──────────────────────┘│
│  ┌──────┬──────────────────────┐│
│  │[缩略图]│ 丝绸之路：东西方的桥梁││  ← 文章卡片 2
│  │      │ Silk Road: Bridge... ││
│  │      │ 2026-04-12 · 👁 986  ││
│  │      │                  ♥  ││
│  └──────┴──────────────────────┘│
│  ...                            │
│  [加载更多指示器]                 │
│                                 │
│  底部安全区（≥ 80px）             │
├─────────────────────────────────┤
│  底部 Tab Bar                    │
└─────────────────────────────────┘
```

---

## 二、顶部导航栏

导航栏固定于顶部（吸顶），高度 56px，毛玻璃背景（`.glass-elevated`）。

| 元素 | 位置 | 样式 | 行为 |
|------|------|------|------|
| 返回按钮 | 左侧 | Lucide `ChevronLeft` 图标（24px），点击热区 ≥ 44×44pt | 点击 → Pop 转场（向右滑出）→ 返回类目首页 |
| 类目名称 | 居中 | H3 字体（20px，Manrope 600），跟随 UI 语言显示对应语言名称 | 纯展示，不可交互 |
| 排序切换按钮 | 右侧 | Lucide `ArrowUpDown` 图标（24px）+ 当前排序文字（Caption，12px），点击热区 ≥ 44×44pt | 点击 → 展开排序选项 |

### 2.1 返回按钮

| 属性 | 说明 |
|------|------|
| 图标 | Lucide `ChevronLeft`（24px） |
| 标签文字 | 无 |
| 可点击条件 | 始终可点击 |
| 点击后行为 | Pop 转场返回类目首页；返回后恢复类目首页的滚动位置 |
| 替代操作 | 支持右滑手势返回（iOS 原生行为，不自定义覆盖） |

### 2.2 排序切换按钮

| 属性 | 说明 |
|------|------|
| 图标 | Lucide `ArrowUpDown`（20px） |
| 当前排序文字 | 「最新」或「最热」（跟随 UI 语言） |
| 多语言 | 最新：汉语="最新"，英语="Latest"，越南语="Mới nhất"；最热：汉语="最热"，英语="Popular"，越南语="Phổ biến nhất" |
| 可点击条件 | 列表有数据时可点击；空状态/加载中时 disabled（opacity 0.45） |
| 点击后行为 | ① 弹出排序选项浮层（Popover，毛玻璃材质） → ② 显示两个选项：「最新」和「最热」 → ③ 当前选中项左侧显示 Lucide `Check` 图标（Rose 色）→ ④ 点击另一选项 → 浮层关闭 → 文章列表刷新 → 顶部加载指示器 → 列表按新排序重新渲染 |
| 默认排序 | 最新（按发布时间倒序） |

排序规则：
- **最新**：按文章发布时间倒序排列
- **最热**：按文章浏览量倒序排列；浏览量相同时按发布时间倒序

---

## 三、类目封面区

| 元素 | 样式说明 |
|------|---------|
| 封面大图 | 宽度 100%，高度 200px（固定），`object-fit: cover`；无圆角（与页面等宽） |
| 封面图底部渐变 | 底部叠加从透明到背景色的渐变遮罩（高度 60px），使图片与下方内容自然过渡 |
| 类目简介文字 | Body 字体（16px，Inter 400），行高 1.6；颜色为次要文字色（中性灰 70%）；距封面图底部 16px；水平 padding 16px |
| 简介行数 | 2-3 行，超出部分截断（`-webkit-line-clamp: 3`） |
| 简介多语言 | 跟随 UI 语言显示对应语言的类目简介 |

12 类目简介文案（跟随 UI 语言）：

| # | 类目 | 中文简介 | 英文简介 | 越南语简介 |
|---|------|---------|---------|-----------|
| 01 | 中国历史 | 上下五千年的朝代更替、历史事件与传奇人物，带你穿越时空感受华夏文明。 | Five thousand years of dynastic changes, historical events, and legendary figures — travel through time to experience Chinese civilization. | Năm nghìn năm thay đổi triều đại, sự kiện lịch sử và nhân vật huyền thoại — du hành thời gian để trải nghiệm nền văn minh Trung Hoa. |
| 02 | 中国美食 | 八大菜系、地方小吃、食材文化与饮食礼仪，一口吃遍中国。 | Eight major cuisines, local snacks, food culture, and dining etiquette — taste all of China in one bite. | Tám đại hệ ẩm thực, đồ ăn vặt địa phương, văn hóa ẩm thực và nghi thức ăn uống — nếm trọn Trung Quốc. |
| 03 | 名胜风光 | 壮丽山川、历史遗迹与城市地标，发现中国最美的角落。 | Majestic landscapes, historical sites, and city landmarks — discover the most beautiful corners of China. | Sơn thủy hùng vĩ, di tích lịch sử và địa danh thành phố — khám phá những góc đẹp nhất của Trung Quốc. |
| 04 | 传统节日 | 春节的烟火、中秋的月饼、端午的龙舟……每个节日都是一个动人故事。 | Spring Festival fireworks, Mid-Autumn mooncakes, Dragon Boat races… every festival tells a moving story. | Pháo hoa Tết, bánh Trung Thu, đua thuyền Đoan Ngọ… mỗi lễ hội đều là một câu chuyện cảm động. |
| 05 | 艺术非遗 | 书法的韵味、剪纸的精巧、陶瓷的绚丽，感受指尖上的中国艺术。 | The charm of calligraphy, the intricacy of paper-cutting, the splendor of ceramics — feel Chinese art at your fingertips. | Vẻ đẹp thư pháp, sự tinh xảo của cắt giấy, sự lộng lẫy của gốm sứ — cảm nhận nghệ thuật Trung Hoa trên đầu ngón tay. |
| 06 | 音乐戏曲 | 古筝悠扬、京剧婉转、民歌质朴，聆听中国千年的声音。 | The elegance of guzheng, the grace of Peking opera, the simplicity of folk songs — listen to China's thousand-year voice. | Tiếng đàn tranh du dương, Kinh kịch uyển chuyển, dân ca mộc mạc — lắng nghe âm thanh ngàn năm của Trung Quốc. |
| 07 | 文学经典 | 四大名著、唐诗宋词、寓言故事，走进中国文字的瑰丽世界。 | The Four Great Novels, Tang poetry, Song lyrics, fables — enter the magnificent world of Chinese literature. | Tứ đại danh tác, thơ Đường, từ Tống, ngụ ngôn — bước vào thế giới tuyệt vời của văn học Trung Quốc. |
| 08 | 成语典故 | 每个成语背后都有一个精彩故事，学成语就是学中国智慧。 | Every idiom hides a brilliant story — learning idioms means learning Chinese wisdom. | Mỗi thành ngữ đều ẩn chứa một câu chuyện tuyệt vời — học thành ngữ là học trí tuệ Trung Hoa. |
| 09 | 哲学思想 | 儒释道的智慧、诸子百家的思辨，探索中国人的精神世界。 | Wisdom of Confucianism, Buddhism, and Taoism — explore the spiritual world of the Chinese people. | Trí tuệ Nho Phật Đạo, tư biện bách gia — khám phá thế giới tinh thần của người Trung Quốc. |
| 10 | 当代中国 | 高铁飞驰、科技创新、网络潮流，看看今天的中国什么样。 | High-speed rails, tech innovation, internet trends — see what China looks like today. | Tàu cao tốc, đổi mới công nghệ, xu hướng mạng — xem Trung Quốc ngày nay như thế nào. |
| 11 | 趣味汉字 | 从甲骨文到表情包，汉字的演变充满了惊喜和乐趣。 | From oracle bones to emojis — the evolution of Chinese characters is full of surprises and fun. | Từ chữ giáp cốt đến emoji — sự phát triển của chữ Hán đầy bất ngờ và thú vị. |
| 12 | 中国神话传说 | 盘古开天、女娲补天、嫦娥奔月……走进中国最奇幻的想象世界。 | Pangu creating the world, Nüwa mending the sky, Chang'e flying to the moon… enter China's most fantastical realm. | Bàn Cổ khai thiên, Nữ Oa vá trời, Hằng Nga bay lên mặt trăng… bước vào thế giới tưởng tượng kỳ ảo nhất của Trung Quốc. |

---

## 四、排序切换

详见第二节「排序切换按钮」。补充切换后的列表刷新行为：

| 步骤 | 行为 |
|------|------|
| 1 | 用户在 Popover 中点击新排序选项 |
| 2 | Popover 关闭（200ms 淡出） |
| 3 | 文章列表区域显示骨架屏（Skeleton），替换当前列表内容 |
| 4 | 请求按新排序方式获取第一页数据 |
| 5a | 请求成功 → 骨架屏消失 → 文章卡片以 Stagger 动画依次渐入 |
| 5b | 请求失败 → 骨架屏消失 → 列表区域显示错误提示 + 重试按钮；排序恢复为上一次成功的排序 |

---

## 五、文章卡片设计

### 5.1 卡片布局

每张文章卡片为毛玻璃卡片样式（`.glass-card`，圆角 24px），内部采用横向布局。

```
┌──────────────────────────────────────────┐
│  ┌──────────┐                            │
│  │          │  秦始皇统一六国的传奇          │  ← 中文标题（H3，20px，Manrope 600）
│  │  封面    │  The Legend of Emperor Qin's  │  ← 解释语言标题（Body S，14px）
│  │  缩略图   │  Unification of Six States    │
│  │          │                              │
│  │  (4:3)   │  2026-04-15 · 👁 1.2k    ♡  │  ← 元信息行 + 收藏图标
│  └──────────┘                              │
└──────────────────────────────────────────┘
```

| 元素 | 样式说明 |
|------|---------|
| 卡片 padding | 12px |
| 卡片间距 | 垂直 16px |
| 卡片水平外边距 | 16px（距屏幕两侧） |
| 封面缩略图 | 宽 100px，高 75px（4:3），圆角 12px，`object-fit: cover`；无封面图时显示类目默认封面 |
| 文字区 | 左侧缩略图右边 12px 间距，flex 布局纵向排列 |
| 中文标题 | H3 字体（20px，Manrope 600），最多 2 行，超出截断（`-webkit-line-clamp: 2`） |
| 解释语言标题 | Body S 字体（14px，Inter 400），次要文字色，最多 1 行截断；UI 语言=汉语时隐藏 |
| 元信息行 | Caption 字体（12px，Inter 500），次要文字色 |
| 发布时间 | 格式：YYYY-MM-DD；超过 7 天显示完整日期，7 天内显示「X 天前」「X 小时前」 |
| 浏览量 | Lucide `Eye` 图标（14px）+ 数字；≥1000 显示为 1.2k 格式 |
| 分隔符 | 发布时间与浏览量之间用「·」分隔 |

### 5.2 收藏图标

| 属性 | 说明 |
|------|------|
| 位置 | 文章卡片右下角，元信息行右侧 |
| 图标 | Lucide `Heart`（20px） |
| 未收藏状态 | 空心心形，颜色继承次要文字色 |
| 已收藏状态 | 实心心形，颜色 Rose（`#e11d48`） |
| 点击热区 | ≥ 44×44pt |
| 可点击条件 | 始终可点击（未登录点击将触发登录） |

**收藏图标点击行为**：

| 场景 | 操作 | 行为链 |
|------|------|--------|
| 未登录 + 点击收藏 | 点击空心心形 | ① 触发全局登录弹窗（Bottom Sheet）→ ② 登录成功后自动执行收藏操作 → ③ 心形变实心 + 弹跳动画 + Toast「已收藏」→ ④ 登录失败/取消 → 心形保持空心 |
| 已登录 + 未收藏 → 收藏 | 点击空心心形 | ① 心形立即变为实心 Rose 色 + 弹跳动画（Spring 缓动，300ms） → ② 同时发送收藏请求 → ③ 成功：Toast「已收藏」（绿色，2s 自动消失） → ④ 失败：心形回退为空心 + Toast「收藏失败，请重试」（红色，需手动关闭） |
| 已登录 + 已收藏 → 取消 | 点击实心心形 | ① 心形立即变为空心 + 缩小动画（100ms） → ② 同时发送取消收藏请求 → ③ 成功：Toast「已取消收藏」（绿色，2s 自动消失） → ④ 失败：心形回退为实心 + Toast「操作失败，请重试」（红色，需手动关闭） |

### 5.3 卡片点击行为

点击卡片任意区域（收藏图标点击热区除外）：

| 步骤 | 行为 |
|------|------|
| 1 | 卡片 active 态：`scale(0.97)` + 100ms |
| 2 | Push 转场（从右侧推入） |
| 3 | 进入文章详情页（[03-article-detail.md](03-article-detail.md)） |

---

## 六、分页加载

| 属性 | 说明 |
|------|------|
| 每页加载数量 | 10 篇文章 |
| 触发条件 | 列表滚动至距底部 200px 时自动触发 |
| 加载指示器 | 列表底部居中显示加载动画（3 个 Rose 色圆点依次跳动），高度 48px |
| 加载指示器文案 | 无文字，仅动画 |
| 加载成功 | 新文章卡片以 Stagger 动画追加到列表底部 |
| 加载失败 | 加载指示器替换为错误提示：「加载失败，点击重试」（Body S，14px）+ 点击后重新请求 |
| 无更多数据 | 加载指示器替换为提示文案：「— 已经到底了 —」（Caption，12px，次要文字色） |
| 无更多数据多语言 | 汉语="已经到底了"；英语="You've reached the end"；越南语="Bạn đã xem hết rồi" |

---

## 七、下拉刷新

| 属性 | 说明 |
|------|------|
| 触发条件 | 列表在顶部时下拉 > 60px |
| 刷新动画 | 自定义 Loading 动画（品牌 Logo 旋转，Rose 色） |
| 刷新行为 | 重新请求第一页数据 + 刷新当前排序下的列表 |
| 刷新成功 | 动画消失 → 列表更新为最新数据 → 如有新文章，Toast「已更新 X 篇新文章」（蓝色信息 Toast，3s 自动消失） |
| 刷新失败 | 动画消失 → Toast「刷新失败，请检查网络」（红色，需手动关闭） → 保留当前列表数据不变 |
| 无新内容 | 动画消失 → Toast「已是最新内容」（蓝色信息 Toast，3s 自动消失） |

---

## 八、状态矩阵

| 状态 | 表现 | 设计要求 |
|------|------|---------|
| **空状态 (Empty)** | 该类目暂无文章 | 类目封面区正常展示。列表区域显示：品牌插画（对应类目主题，如历史类=古风卷轴插画）+ 文案「该类目的精彩内容正在准备中，敬请期待」+ 3~4 个 `.glass-decor` 浮动方块。空状态文案多语言：英语="Amazing content is on the way, stay tuned!"；越南语="Nội dung thú vị đang được chuẩn bị, hãy chờ đón nhé!" |
| **加载中 (Loading)** | 首次进入页面 | 封面区：图片区域的骨架屏（200px 高灰色块）+ 简介文字骨架屏（2 行灰色条）。列表区：3-4 个文章卡片骨架屏（缩略图灰色块+文字灰色条） |
| **首次加载 (First Load)** | 页面首次渲染 | 同加载中状态，导航栏即时渲染（类目名称已知） |
| **成功 (Success)** | 数据加载完成 | 封面图淡入（300ms）→ 简介文字出现 → 文章卡片以 Stagger 动画依次渐入 |
| **错误 (Error)** | 整页数据请求失败 | 导航栏正常显示。内容区：错误插画 + 文案「网络不给力，点击重试」+ 「重试」按钮（Rose 色药丸形） |
| **部分加载 (Partial)** | 触底加载更多时 | 已加载的文章正常展示 + 底部加载指示器；加载失败时指示器变为重试提示 |
| **离线 (Offline)** | 无网络连接 | 顶部离线 Banner（Amber 色）。若有缓存 → 展示缓存的文章列表；若无缓存 → 显示离线空状态+「连接网络后自动加载」文案 |
