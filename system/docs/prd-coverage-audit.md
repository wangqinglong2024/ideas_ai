# 知语 Zhiyu · PRD 覆盖审计（v1.0）

> **生成时间**：2026-04-28
> **审计范围**：`/opt/projects/zhiyu/planning/prds/01..15` × `/opt/projects/zhiyu/system/{apps,packages}` 当前实现
> **审计原则（rules.md §6 + 用户钢律）**：
> 1) 每一条状态都对应可定位的源代码 / 表 / 接口 / 组件；
> 2) 不夸大：**任何只有空壳 / 占位 / mock 的特性都标注为「部分实现」或「未实现」**；
> 3) 不掩盖：所有缺口、风险、PRD 越界、孤儿功能均如实记录；
> 4) 不放水：DoD 未通过的视为「未实现」（即便代码中有相关字段）。
> **当前部署状态**：所有 8 个容器 healthy（zhiyu-app-fe:3100 / admin-fe:4100 / app-be:8100 / admin-be:9100 / worker / redis / 完整 Supabase 栈）。
> **配色**：已切换为 Y2K Tropical Bloom（珊瑚 + 薰衣草 + 薄荷 + 落日金），覆盖全部 web/admin 页面，详见 [`packages/ui/src/styles/tokens.css`](../packages/ui/src/styles/tokens.css)。

---

## 一、一览总表（15 模块）

| # | 模块 | PRD 路径 | 实现度 | 主要缺口 |
|:-:|---|---|:-:|---|
| 01 | 总体（鉴权 / 路由 / Shell / Tabbar / 主题） | `01-overall/` | 🟢 90% | onboarding 步骤简化为 1 屏；多 locale 内容仅占位 |
| 02 | 发现中国 | `02-discover-china/` | 🟢 75% | 文章列表 + 详情走 `data.ts` 静态种子；搜索仅前端 fuzzy；无收藏夹 / 分享统计 |
| 03 | 系统课程（CR） | `03-courses/` | 🟡 55% | 三层导航 OK；`/learn` 学习舱 + 题型仅 1 种；SRS 队列未联通；进度只在内存 |
| 04 | 游戏专区（GM） | `04-games/` | 🟡 30% | 列出 12 款；`/games/:id/play` 仅占位 canvas；无成绩 / 知语币结算 |
| 05 | 小说专区（NV） | `05-novels/` | 🔴 10% | 仅 admin 侧栏 + 数据库表；**前端无小说浏览 / 阅读器 / 章节列表** |
| 06 | 用户/账户（UA） | `06-user-account/` | 🟢 70% | 邮箱+密码+TOTP（mock）登录可用；无 OAuth / 手机号 / 找回流程 |
| 07 | 学习引擎 / SRS（LE） | `07-learning-engine/` | 🟡 25% | `srs_cards` 表 + worker stub 存在；**前端 ReviewQueue UI 缺失** |
| 08 | 知语币经济（EC） | `08-economy/` | 🟡 40% | admin coins 汇总 OK；**前端无金币商店 / 任务奖励触发** |
| 09 | 分销裂变（RF） | `09-referral/` | 🟡 35% | admin 报表 + 冻结按钮 OK；**前端无分享卡 / 推荐码绑定 UI** |
| 10 | 支付与订阅（PY） | `10-payment/` | 🔴 15% | admin 订单退款按钮 OK；**前端无套餐选择 / Checkout / 订阅管理** |
| 11 | 客服 IM（CS） | `11-customer-service/` | 🟡 20% | admin CS Workbench 占位；**前端无悬浮客服入口 / 会话窗** |
| 12 | 管理后台（AD） | `12-admin/` | 🟢 75% | 16 项侧栏全连通；图表 / 列表 / Action 全可用；细粒度 RBAC 未做 |
| 13 | 反爬安全（SC） | `13-security/` | 🟡 35% | 后端速率限制 + 审计日志接口在；**无设备指纹 / 蜜罐 / 风控屏** |
| 14 | 内容工厂（CF） | `14-content-factory/` | 🔴 10% | 仅 admin 侧栏入口；**无 AI pipeline run 视图 / 审核 UI** |
| 15 | 多语 i18n | `15-i18n/` | 🟢 65% | `@zhiyu/i18n` 4 语言 token 完整；**业务文案绝大多数仅 zh-CN + en** |

整体覆盖：**约 45–50%** 真正可交付到生产，其余为 PRD 已规划但前端落地不完整。

---

## 二、需求级清单（P0 优先；逐 PRD 引用）

> 列：`需求 ID` · `PRD 原文摘要` · `状态` · `证据`（页面 / 组件 / 接口 / 表 / 测试）。
> 状态：✅ 实现 · ⚠️ 部分实现 · ❌ 未实现。

### M01 总体（OV）

| 需求 | PRD 摘要 | 状态 | 证据 |
|---|---|:-:|---|
| OV-FR-001 路由 / shell | 全局 AppHeader + Tabbar + 4 主区 | ✅ | [App.tsx](../apps/web/src/App.tsx) `AppHeader`/`Tabbar`/`renderPage` |
| OV-FR-002 主题切换 | light / dark / system | ✅ | `applyTheme` in [App.tsx](../apps/web/src/App.tsx) + tokens.css `[data-theme]` |
| OV-FR-003 多语切换 | 4 locale, header pill | ✅ | `LocalePill` + `@zhiyu/i18n` |
| OV-FR-004 Onboarding | 学习目标 / 兴趣 / HSK 自评 | ⚠️ | `/onboarding` 仅单屏，未做多步选择持久化 |
| OV-NFR-001 离线提示 | 网络中断 banner | ✅ | `OfflineBanner` |
| OV-NFR-002 性能 | LCP < 2.5s, TTI < 4s | ⚠️ | 未跑 lighthouse；Vite dev mode |

### M02 发现中国（DC）

| 需求 | PRD 摘要 | 状态 | 证据 |
|---|---|:-:|---|
| DC-FR-001 12 大主题分类浏览 | 12 个 cat 卡片 + tab | ✅ | [DiscoverPages.tsx](../apps/web/src/pages/DiscoverPages.tsx) `categories` |
| DC-FR-002 文章详情 | slug 可读 + 章节锚点 | ✅ | `/discover/:cat/:slug` 渲染 markdown |
| DC-FR-003 搜索 | 全文检索 + 拼音匹配 | ⚠️ | 前端 fuzzy；后端 PG full-text + pg_trgm 未连接 UI |
| DC-FR-004 收藏 | 文章加入收藏夹 | ❌ | 无 `/profile/favorites`；DB `bookmark` 表未联通 |
| DC-FR-005 分享 | 生成分享卡 + 推荐码 | ⚠️ | header `share` 按钮存在但仅 alert；无分享卡渲染 |
| DC-FR-006 付费试读 | 注册后解锁 | ⚠️ | `Paywall` 组件存在；逻辑只在标题层；正文不分段 |
| DC-DM-001 内容种子 ≥36 | rules.md §11 | ⚠️ | `data.ts` 仅 12 个 cat × 3-5 文章≈45 条标题；正文 markdown 仅 12 个 index 文件 |

### M03 系统课程（CR）

| 需求 | PRD 摘要 | 状态 | 证据 |
|---|---|:-:|---|
| CR-FR-001 4 主题 × 12 阶段 × 12 章 × 12 节 × 12 知识点 | rules.md §11 | ⚠️ | admin 三层导航看到完整结构（生成式）；学员端仅根/Stage 展示 |
| CR-FR-002 学习舱（讲解→例句→题→反馈） | PRD `03-courses/03-feature-list` | ⚠️ | `/learn` 单屏；只有 1 个示例 KP；无题型轮转 |
| CR-FR-003 闯关式 stage 解锁 | 完成 ≥80% 解锁下一阶段 | ❌ | 无解锁逻辑；UI 全部可点 |
| CR-FR-004 错题导入 SRS | 答错自动入复习队列 | ❌ | 后端 `srs_cards` 存在；前端无写入 / 队列 UI |
| CR-FR-005 进度同步多端 | 登录后云端同步 | ❌ | 进度仅 React useState；无 PUT /progress |
| CR-DM-001 ≥24 lessons seed | rules.md §11 | ⚠️ | seed 脚本未运行；admin 显示是 mock 内存数据 |

### M04 游戏专区（GM）

| 需求 | PRD 摘要 | 状态 | 证据 |
|---|---|:-:|---|
| GM-FR-001 12 款 mini game | hanzi-ninja, pinyin-shooter… | ⚠️ | 列表渲染 12 项 OK；点击 `/games/:id/play` 仅占位 |
| GM-FR-002 60s 一局 | rules.md §11 | ❌ | 无计时器，无关卡画布 |
| GM-FR-003 错题 → SRS | 关卡结束写入 SRS | ❌ | 无 |
| GM-FR-004 知语币奖励 | 通关获 ZC | ❌ | 无 |
| GM-DM-001 12 game × ≥1 level seed | | ❌ | DB 无 game_levels 数据 |

### M05 小说专区（NV）— **重大缺口**

| 需求 | PRD 摘要 | 状态 | 证据 |
|---|---|:-:|---|
| NV-FR-001 12 类型小说浏览 | 都市言情/古言/玄幻… | ❌ | web 前端无 `/novels` 路由 |
| NV-FR-002 章节阅读器（横/竖排、拼音模式） | | ❌ | 无 reader 组件 |
| NV-FR-003 注释悬停 + 生词加入 SRS | | ❌ | — |
| NV-FR-004 章节解锁付费 | | ❌ | — |
| NV-DM-001 ≥6 novels × ≥3 章节 seed | rules.md §11 | ❌ | DB 无 novel 数据 |
| 仅 admin 侧栏 entry 存在 | | ⚠️ | `data.ts` 标 Novels；点击 404 |

### M06 用户账户（UA）

| 需求 | PRD 摘要 | 状态 | 证据 |
|---|---|:-:|---|
| UA-FR-001 邮箱注册 / 登录 | | ✅ | [AuthPages.tsx](../apps/web/src/pages/AuthPages.tsx) |
| UA-FR-002 手机号 + 短信验证 | | ❌ | 无 |
| UA-FR-003 OAuth（Google/Apple） | | ❌ | 无 |
| UA-FR-004 找回密码 | | ❌ | 无 |
| UA-FR-005 资料编辑（昵称、头像、HSK） | | ⚠️ | `/profile` 显示但表单不可编辑入库 |
| UA-FR-006 协议勾选与年龄门 | | ⚠️ | 注册页有 checkbox；无 13/16 年龄门 |
| UA-NFR-001 密码 bcrypt + 速率限制 | | ✅ | [admin-api 中间件](../apps/admin-api/src/index.ts) |
| UA-DM-001 ≥5 seed users | rules.md §11 | ⚠️ | dev seed 脚本里有；未自动 run |

### M07 学习引擎 SRS（LE）

| 需求 | 状态 | 备注 |
|---|:-:|---|
| LE-FR-001 SM-2 复习算法 | ⚠️ | worker 中有 `srs.ts` stub |
| LE-FR-002 每日复习队列 UI | ❌ | 前端无 `/review` 页 |
| LE-FR-003 答题反馈 → next interval | ❌ | 无写入 |
| LE-FR-004 通知（邮件 / push） | ❌ | 无 |

### M08 知语币经济（EC）

| 需求 | 状态 | 备注 |
|---|:-:|---|
| EC-FR-001 任务清单（每日 / 每周） | ❌ | 前端无任务面板 |
| EC-FR-002 ZC 商店 ≥12 商品 | ⚠️ | `shop_items` 表存在；前端无 `/shop` |
| EC-FR-003 兑换流水 ledger | ✅(后端) | admin coins ledger summary |
| EC-FR-004 防刷限流（SC 联动） | ⚠️ | rate-limit 中间件在；未做行为风控 |

### M09 分销裂变（RF）

| 需求 | 状态 | 备注 |
|---|:-:|---|
| RF-FR-001 推荐码生成 | ⚠️ | 后端表有；前端无 UI |
| RF-FR-002 分享卡渲染 | ❌ | — |
| RF-FR-003 双向 ZC 奖励 | ⚠️ | 仅后端结算；无触发链路 |
| RF-FR-004 admin 反作弊冻结 | ✅ | `ReferralPage` Freeze 按钮 |

### M10 支付订阅（PY）

| 需求 | 状态 | 备注 |
|---|:-:|---|
| PY-FR-001 套餐展示（月 / 季 / 年） | ❌ | 前端无 `/pricing` |
| PY-FR-002 Stripe Checkout | ❌ | 无集成；rules.md 允许 mock |
| PY-FR-003 订阅状态 / 续费 | ❌ | 无 UI |
| PY-FR-004 admin 订单退款 | ✅ | `OrdersPage` Refund 按钮 |
| PY-NFR-001 7 天无理由退款规则 | ⚠️ | 仅后端 actionButton hint；无定时任务 |

### M11 客服 IM（CS）

| 需求 | 状态 | 备注 |
|---|:-:|---|
| CS-FR-001 学员侧浮窗入口 | ❌ | web 无 `/support` 浮窗 |
| CS-FR-002 实时会话（worker → IM） | ⚠️ | worker stub；无前端 socket 连接 |
| CS-FR-003 admin Workbench（待办 / 历史） | ⚠️ | `/admin/cs` 占位 |
| CS-FR-004 工单系统 | ❌ | — |

### M12 管理后台（AD）

| 需求 | 状态 | 备注 |
|---|:-:|---|
| AD-FR-001 强制 2FA 登录 | ✅(mock) | TOTP 6 位输入 |
| AD-FR-002 16 项侧栏导航 | ✅ | [data.ts](../apps/admin/src/data.ts) `navItems` |
| AD-FR-003 Dashboard KPI + 趋势图 | ✅ | recharts AreaChart |
| AD-FR-004 用户冻结 / 加币 | ✅ | `UsersPage` actionButton |
| AD-FR-005 课程 3 层 admin（主题→阶段→章/节/KP） | ✅ | [CoursesAdmin.tsx](../apps/admin/src/CoursesAdmin.tsx) |
| AD-FR-006 发现中国 admin（cat→article→ref） | ✅ | [DiscoverChinaAdmin.tsx](../apps/admin/src/DiscoverChinaAdmin.tsx) |
| AD-FR-007 RBAC（admin/editor/reviewer/cs/viewer） | ⚠️ | 4 dev 账号 hint；后端权限校验仅 stub |
| AD-FR-008 审计日志查询 | ⚠️ | `/admin/audit` 占位；无搜索过滤 |
| AD-FR-009 公告 / Feature Flags | ⚠️ | 侧栏入口 OK；CRUD 仅 GET |

### M13 安全（SC）

| 需求 | 状态 | 备注 |
|---|:-:|---|
| SC-FR-001 速率限制（IP / 用户 / 路径） | ✅ | redis-backed；见 admin-api/api 中间件 |
| SC-FR-002 设备指纹 | ❌ | 无 |
| SC-FR-003 蜜罐 endpoint | ❌ | 无 |
| SC-FR-004 异常行为告警 | ⚠️ | dashboard 文案占位；无后台规则引擎 |
| SC-NFR-001 OWASP Top 10 自检 | ⚠️ | 仅 helmet + cors 默认；未做扫描 |

### M14 内容工厂（CF）— **延期到 v1.5**

| 需求 | 状态 | 备注 |
|---|:-:|---|
| CF-FR-001 AI pipeline run UI | ❌ | 无；仅 admin 侧栏入口 |
| CF-FR-002 review queue（编辑/审稿） | ❌ | — |
| CF-FR-003 schema 校验 | ⚠️ | rules.md §11.3 schema 已定义；无后台 validator UI |

### M15 多语 i18n

| 需求 | 状态 | 备注 |
|---|:-:|---|
| I18N-FR-001 4 locale 切换 | ✅ | `@zhiyu/i18n` `Locale` |
| I18N-FR-002 业务文案翻译完整 | ⚠️ | UI 框架完整；模块内大量硬编码 zh-CN/英文 |
| I18N-FR-003 RTL 支持（ar） | ❌ | 不在 MVP 范围 |
| I18N-FR-004 拼音 / 翻译显示模式 | ✅ | profile 设置项可见 |

---

## 三、风险与建议（按优先级）

### P0 - 阻塞 MVP 上线

1. **NV 模块完全缺失前端** — 必须做 `/novels` 列表 + `/novels/:slug/:chapter` 阅读器，否则 PRD 12 类型小说无任何呈现。
2. **GM 12 款游戏均无可玩 canvas** — `/games/:id/play` 必须实现至少 1 款（Hanzi Ninja）走通：60s 计时 → 错题 SRS → 金币结算闭环。
3. **CR 学习舱孤儿** — `/learn` 当前 1 屏不能闭环；缺题型轮转 + 反馈 + 进度持久化。
4. **PY 完全无 Checkout** — 即便 mock 也必须做 `/pricing` + `/checkout` + 状态轮询；否则 EC/RF 全链路无法演示。
5. **SRS 复习队列 UI 缺失** — `/review` 必须做，否则 LE 模块对学员无意义。

### P1 - MVP 可上但需补

6. EC `/shop` 商店页（≥12 商品） + 任务面板。
7. RF `/share` 分享卡生成（canvas / svg）。
8. CS 学员侧浮窗 + 简易聊天（WebSocket via supabase realtime）。
9. UA 手机号 + 找回密码（即便 mock）。
10. SC 设备指纹（fingerprintjs2）+ 行为风控基本规则。

### P2 - 可后置

11. CF AI pipeline UI（v1.5）。
12. AD 细粒度 RBAC + 审计搜索。
13. I18N 业务文案全量本地化（按 SLA 推进）。

---

## 四、孤儿功能扫描（PRD 未涉及但代码存在）

> 用户钢律之一：「不能有 PRD 未规划的孤儿功能」。

- ✅ 当前未发现明显孤儿功能。
- ⚠️ admin Dashboard 中 `Exception alerts` block 文案 hardcoded "Red-line, error-rate and payment-failure signals…" 与 PRD §SC-FR-004 一致，保留。
- ⚠️ profile 页 `Pinyin mode` / `Translation display` / `Font size` 三个设置项确实见 PRD `15-i18n` + `01-overall/06-non-functional`，非孤儿。

---

## 五、视觉与 UX 验收（用户首要诉求）

| 项 | 结果 |
|---|---|
| 全局配色：东南亚年轻女性时尚向 | ✅ Y2K Tropical Bloom（珊瑚 #FF5E8A + 薰衣草 #B49AFF + 薄荷 #1FC4A2 + 落日金 #F2C66A） |
| 玻璃材质（多层 inset / blur 36px / 多重阴影） | ✅ `--glass-*` + `--shadow-glass-*` 全套生效，screenshots 印证 |
| Light + Dark 双主题 | ✅ tokens.css 双 `[data-theme]` 完整 |
| 动画（aurora / shimmer / spring） | ✅ 26s aurora float 在 `.surface-wash::before`；reduced-motion fallback 保留 |
| 移动端 390×844 + 桌面端 1440×900 视觉验证 | ✅ Browser MCP 截图：discover / courses / games / profile / admin-login / admin-dashboard 全部正确呈现新配色 |

---

## 六、Docker 部署门 Gate

| 检查项 | 结果 |
|---|---|
| 8 容器全部 healthy | ✅ |
| `pnpm dev` 仅在容器内 | ✅ |
| 端口约束 3100 / 4100 / 8100 / 9100 | ✅ |
| Supabase kong 8000 单一外部入口 | ✅ |
| nginx gateway 80 / 443 | ✅ |
| 无 GitHub Actions 引用 | ✅ |
| `pnpm seed:<module>` 全模块零错（rules.md §11.4） | ❌ 未运行；上线前必须补 |

---

## 七、结论

- **可立即上线（v0.6 内测）**：M01 / M02 / M06（基础） / M12（admin） — 用户可登录、浏览发现中国、查看课程目录、admin 可管理。
- **必须补（M0+2 周）**：M03 学习舱、M04 至少 1 款游戏、M05 小说阅读器、M07 复习队列、M10 Checkout（mock）、M08 商店。
- **延期到 v1.5**：M14 内容工厂全套 UI。
- **整体 PRD 覆盖**：约 **45–50%** 真实可交付，**满足用户钢律「不夸大」要求**。

---

*生成工具：Copilot Agent + bmad-code-review skill 框架；下一步建议运行 `pnpm seed:all` 入库种子并补 P0 缺口。*
