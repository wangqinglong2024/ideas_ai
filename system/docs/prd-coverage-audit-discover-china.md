# PRD 覆盖审计：Discover China / Admin / I18N Preferences

日期：2026-04-27

审计口径：只把本地 Docker 可验证的 dev-only 能力记为“已实现”。凡仍依赖 in-memory/Redis runtime snapshot、seed 占位资源、fake adapter、手工 smoke 或未接生产级 Postgres/RLS/FTS/Storage/TTS/SEO 的能力，一律标为“部分”或“未实现”。

## PRD 来源

| 范围 | 原文来源 |
| --- | --- |
| Discover China 功能 | `planning/prds/02-discover-china/01-functional-requirements.md`：DC-FR-001~016 |
| Discover China 验收 | `planning/prds/02-discover-china/03-acceptance-criteria.md`：DC-AC-001~014、NFR、W0 内容门槛 |
| Admin 内容后台 | `planning/prds/12-admin/01-functional-requirements.md`：AD-FR-006、AD-FR-008、AD-FR-012 |
| i18n | `planning/prds/15-i18n/01-functional-requirements.md`：I18N-FR-003、I18N-FR-004 |
| 用户偏好/匿名访问 | `planning/prds/06-user-account/01-functional-requirements.md`：UA-FR-007、UA-FR-013 |
| 内容边界 | `content/china/00-index.md` 与 12 个 `content/china/*.md` 类目文件 |

## 本次验证证据

| 验证项 | 结果 |
| --- | --- |
| Docker backend typecheck | 通过：`docker compose -f docker/docker-compose.yml run --rm --build -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 zhiyu-app-be sh -c "corepack enable && pnpm --filter @zhiyu/backend typecheck"`，`tsc -p tsconfig.json --noEmit` exit 0 |
| Docker backend tests | 通过：`vitest run --reporter=dot`，`Test Files 2 passed (2)`，`Tests 4 passed (4)` |
| Redis runtime state reset | 执行 `redis-cli DEL zhiyu:runtime:discover:v1 zhiyu:runtime:discover:v1:version`，返回 `0`，随后重建 App/Admin backend |
| Compose 服务健康 | `zhiyu-app-be`、`zhiyu-admin-be`、`zhiyu-redis` 均 `healthy` |
| Docker 跨服务 smoke | 通过：ready、12 active categories、匿名前 3 类目、匿名第 4 类目 401、登录解锁、Admin 类目/文章读取、Admin PATCH draft、App draft 404、Admin republish、App published 200、missing publish 404、empty import 400、invalid progress 400 |
| MCP Browser smoke | 已截图：`post-redis-discover-home`、`post-redis-discover-locked-festivals`、`post-redis-discover-unlocked-festivals-token`、`post-redis-profile-preferences`、`post-redis-admin-discover-workbench-articles` |

## 关键修复记录

| 问题 | 修复 | 验证 |
| --- | --- | --- |
| App/Admin Docker 多进程各自持有 in-memory Discover state，导致 Admin 改 draft 后 App 仍返回 published | 在 `packages/backend/src/runtime/state.ts` 增加 Redis-backed Discover runtime snapshot；Admin 内容写入后 persist，App Discover 读取前 refresh | 跨服务 smoke 中 `admin PATCH persists draft status`、`draft article hidden from public app API`、`admin PATCH restores published status`、`published article visible again` 全 PASS |
| 公开 API 可能读取非 published 或非 active category 数据 | App API 增加 active category、published article、readability gate | 跨服务 smoke 覆盖 categories active、draft 404、匿名 gated 401 |
| Admin 内容动作对不存在文章返回成功 | Admin publish/withdraw/copy/version 增加 missing resource 404 | 跨服务 smoke：`missing article publish returns 404` PASS |
| Admin PATCH status 与后端契约不一致 | Admin article PATCH 支持并校验 `status` | 跨服务 smoke：draft/published 往返 PASS |
| import 语义 overclaim | import 返回 validated/recorded，而非声称真实生产导入完成 | smoke：empty import 400 PASS；真实 upsert 仍为差距 |
| reduced-motion 仍有背景动画 | CSS reduced-motion 下禁用动态 ink-flow/surface animation | 已纳入 UI CSS；未做自动无障碍报告 |

## PRD 覆盖矩阵

| PRD | 原文要求摘要 | 当前实现证据 | 验证证据 | 状态 | 差距/风险 |
| --- | --- | --- | --- | --- | --- |
| DC-FR-001 / DC-AC-001 类目首页 | `/discover` 展示 12 类目、母语名、文章数、最近 3 篇；前 3 开放、后 9 登录引导；缓存/预取 1h | `apps/web/src/pages/DiscoverPages.tsx`、`packages/backend/src/modules/app-api.ts`、seed blueprint；首页卡片与锁定 badge | API smoke 12 categories；MCP `post-redis-discover-home` | 部分 | 核心 UI/data/gate 可用；cache header/SW 预取与文章总数生产聚合未完整验证 |
| DC-FR-002 / DC-AC-002 类目列表页 | 文章列表 20/页，HSK、长度、排序，空状态 | CategoryPage 提供 HSK/Length/Sort 控件；App API 支持筛选参数；空状态存在 | MCP 解锁类目截图显示筛选与文章列表；API smoke public list | 部分 | 20/页分页、完整排序语义、移动/桌面矩阵未自动化验证 |
| DC-FR-003 / DC-AC-003 单篇阅读页 | 标题、元信息、句子列表中文+拼音+母语+音频、关键点、CTA | ArticlePage + SentenceCard；sentences 包含 translations/audio/keyPoint seed | 早前 MCP reader 截图；API smoke 能读取 published article | 部分 | 音频为 `seed://audio` 占位；未验证真实播放器/进度条和所有 CTA 跳转 |
| DC-FR-004 句子级交互 | 点击播放 TTS、长按菜单、收藏/笔记/复制、拼音模式和字号偏好 | SentenceCard 有 play/save/copy/note 控件；Profile 保存 pinyin/font/ttsSpeed | Profile 偏好截图；reader 曾完成浏览器 smoke | 部分 | TTS 是 toast/占位 URL；长按手势菜单未完整；拼音行高随偏好未做自动视觉断言 |
| DC-FR-005 / DC-AC-004 阅读进度 | 5s debounce 保存，未登录 localStorage，登录写表，返回恢复，末尾+30s 完读 | ArticlePage 5s timeout 保存 localStorage/API；App API progress endpoint | smoke：invalid progress 400；未做恢复流程自动测试 | 部分 | 未证明自动滚回上次句子；完读 30s 语义不完整；runtime 非生产 DB |
| DC-FR-006 收藏 | 文章收藏/取消，个人中心查看 | ArticlePage favorite API/UI；backend favorites state；Profile 显示收藏/笔记入口 | reader 曾 smoke；未做本次收藏往返 smoke | 部分 | 个人中心完整收藏列表未实现；持久化为 runtime state |
| DC-FR-007 笔记 | 句子笔记 500 字、多设备同步、个人中心查看 | SentenceCard note editor；App API note endpoint 限制；Profile 显示 notes count | reader 曾 smoke；代码限制存在 | 部分 | 个人中心笔记列表、多设备真实同步、生产持久化未完成 |
| DC-FR-008 评分 | 文章 5 星，每用户每文章 1 票，平均值 | ArticlePage rating row；App API rating endpoint；migration 含 `content_ratings` RLS | 后端 typecheck/test；未做本次 rating smoke | 部分 | 平均值生产一致性、真实 DB/RLS 未在 runtime 接入 |
| DC-FR-009 / DC-AC-009 分享卡片 | 1080x1920 图卡、QR 分销码、Storage 90 天、navigator.share/复制 | ArticlePage share 调用 API；backend 返回 share-card placeholder | reader 曾 smoke | 部分 | `seed://share/...` 占位；无真实图卡、QR、Storage 缓存、分销码闭环 |
| DC-FR-010 / DC-AC-006 未登录限制 | 未登录仅前 3 类目；第 4-12 弹注册解锁；登录后全部解锁；转化/风控记录 | App API gate + UI Paywall；UA-FR-013 对齐；Redis state 修复跨服务一致性 | smoke：匿名 festivals 401、登录 festivals 200；MCP 锁定/解锁截图 | 部分 | 核心访问模型已验证；anon_id/device_id/ip_hash、nginx 限流、CaptchaAdapter 记录未完整实现 |
| DC-FR-011 / DC-AC-007 搜索 | 中文/母语关键词、标题/正文/关键点、PG FTS/pg_trgm、高亮、分页 | DiscoverSearchPage + App API in-memory search | 早前搜索截图；未做本次搜索 smoke | 部分 | UI 上仍出现 `Postgres FTS` 文案但当前不是 PG FTS；高亮与分页不完整 |
| DC-FR-012 / DC-AC-010 推荐 | 文末 4 篇同类目/相近 HSK/高评分 | ArticlePage 请求同类目 popular 列表并排除当前文章 | reader 曾 smoke | 部分 | 算法为 seed/in-memory 简化；未保证 4 篇或 HSK 接近 |
| DC-FR-013 / I18N-FR-004 母语切换 | UI 切语后文章/句子翻译实时切换，缺失回退 en | `@zhiyu/i18n` localizedText；App locale prefix；Profile language control；article translations JSON | MCP Profile 显示 Language；早前多语阅读 smoke | 部分 | UI 文案未全部 i18next key 化；缺失翻译回退未完整自动测试 |
| DC-FR-014 / DC-AC-012 HSK 难度 | 自动计算 HSK，列表筛选，单篇展示 | seed article hskLevel；列表筛选；单篇 HSK badge | MCP 解锁类目截图显示 HSK filter；API list smoke | 部分 | HSK 是 seed 标注，不是词频/覆盖率自动计算 |
| DC-FR-015 / DC-AC-013 阅读统计 | `/me/stats` 已读数、累计字数、收藏数 | Profile stats card；`/api/v1/me/discover-summary` runtime summary | MCP Profile 截图显示 stats | 部分 | 统计非生产 DB；累计字数/收藏列表准确性未完整测试 |
| DC-FR-016 / DC-AC-014 内容预热 | 发布即推、本地 nginx/cache header/SW 预取，热门阈值 | 无完整实现 | 未验证 | 未实现 | 需后续接入本地 cache/prewarm 策略和发布触发 |
| AD-FR-006 Admin 内容管理 | DC 类目/文章/句子 CRUD，批量发布/撤回/复制/版本历史/预览 | Admin Discover workbench；Admin API category/article/sentence CRUD、publish/withdraw/copy/version/preview；Redis snapshot persist | smoke：Admin categories、article table/detail、PATCH、missing publish；MCP Admin workbench 截图 | 部分 | 批量操作、生产 DB、完整版本 diff/预览隔离仍不足 |
| AD-FR-008 审校工作台 | to_review/in_review/approved/rejected/requested_changes，原文/AI译/人工编辑、母语审校、历史版本对比 | Review queue API/UI seed；redline check；Admin card 指向 review | 早前 BMAD review；Admin workbench 显示 review queue | 部分 | 审校流程为 seed/简化；字段对比和历史版本 UI 未完整 |
| AD-FR-012 操作审计 | 所有写操作 audit_logs，actor/action/resource/before/after/ip/ua/timestamp，7 年保留 | Admin write routes 调用 audit 记录；基础 audit 页面 | 后端 admin tests 覆盖 audit 写入；本次 Docker tests PASS | 部分 | 不是全局审计中间件；7 年保留与生产持久化未实现 |
| I18N-FR-003 用户语言偏好 | 已登录 preferences.ui_lang 覆盖浏览器，切换 POST preferences | Profile Language select；preferences API/localStorage；types 包含 uiLang | MCP Profile 偏好截图 | 部分 | 未证明所有已登录语言切换都 POST 成功并覆盖浏览器；i18n key coverage 不完整 |
| UA-FR-007 偏好设置 | UI 语言、拼音模式、翻译显示、字号、TTS 语速/音色、订阅 | Profile Settings 覆盖语言/拼音/翻译/字号/主题/TTS speed | MCP Profile 截图 | 部分 | TTS 音色、邮件订阅未完整；偏好持久化为 localStorage/runtime |
| UA-FR-013 匿名访问 | 匿名 DC 前 3、登录全部 DC | App gate + API gate | smoke 和 MCP 锁定/解锁截图 | 部分 | 其他模块匿名范围不在本次实现；设备指纹/风控埋点未完整 |

## 内容覆盖

| 项目 | 当前状态 | 差距 |
| --- | --- | --- |
| 12 类目 | 已按 `content/china/00-index.md` 顺序生成 12 类目，前 3 public，后 9 login gated | 封面仍为 `seed://images/...` 占位 |
| 文章量 | dev seed 为 36 篇，12 类目各 3 篇 | W0 门槛要求 600 篇、每类目不少于 50 篇，未达成 |
| 句子数据 | 每篇含句子、拼音、tone pinyin、4 语翻译、keyPoint、audio placeholder | 翻译为 seed/demo 质量，不等于母语审校通过；TTS 不是真实音频 |
| 红线 | contentBoundary 与 redline scan 已纳入 Admin/API 简化流程 | 不能声明红线词 0 触发或母语审校 100% |

## 结论

当前交付满足 Discover China / Admin Discover China 的本地 Docker dev slice：12 类目、匿名/登录访问模型、句子级阅读骨架、Profile 偏好、Admin 内容工作台、核心 CRUD/status 行为、跨 App/Admin 服务状态一致性均已验证。不能宣称完整生产级 PRD 完成；真实 Postgres/RLS/FTS、真实 TTS/音频、分享图卡/QR/Storage、W0 600 篇内容、SEO/cache/prewarm、完整审校工作流和自动化性能/无障碍门禁仍是后续必须补齐的差距。