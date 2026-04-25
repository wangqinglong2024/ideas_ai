# Story Index · E17 管理后台（Admin）

> Epic：[E17](../../epics/17-admin.md) · Sprint：[S17](../../sprint/17-admin.md)
> 阶段：M3-M5 贯穿（3 阶段交付） · 优先级：P0 · 估算：8 周
> Story 数：12

## Story 列表（按交付阶段）

### Phase A · M3 · v1（W15-W20）
| 序 | Story Key | 标题 | 估 |
|:-:|---|---|:-:|
| 1 | [17-1-admin-users-roles-permissions](./17-1-admin-users-roles-permissions.md) | admin_users / roles / permissions 表 | M |
| 2 | [17-2-admin-login-totp](./17-2-admin-login-totp.md) | 后台登录 + TOTP | L |
| 3 | [17-3-rbac-middleware](./17-3-rbac-middleware.md) | RBAC 中间件 | M |
| 4 | [17-4-admin-app-shell](./17-4-admin-app-shell.md) | 后台 App Shell | L |
| 5 | [17-5-user-management](./17-5-user-management.md) | 用户管理 | L |
| 6 | [17-6-content-mgmt-articles](./17-6-content-mgmt-articles.md) | 内容管理 - 文章 | L |
| 7 | [17-7-content-mgmt-courses](./17-7-content-mgmt-courses.md) | 内容管理 - 课程 | L |

### Phase B · M4 · v2（W21-W26）
| 序 | Story Key | 标题 | 估 |
|:-:|---|---|:-:|
| 8 | [17-8-content-mgmt-novels-games-wordpacks](./17-8-content-mgmt-novels-games-wordpacks.md) | 小说 + 游戏 + 词包 | L |
| 9 | [17-9-cms-publish-console-factory-placeholder](./17-9-cms-publish-console-factory-placeholder.md) | CMS 控制台 + 工厂占位 | L |

### Phase C · M5 · v3（W27-W32）
| 序 | Story Key | 标题 | 估 |
|:-:|---|---|:-:|
| 10 | [17-10-orders-refunds-referral](./17-10-orders-refunds-referral.md) | 订单 / 退款 / 分销 | L |
| 11 | [17-11-reports-bi](./17-11-reports-bi.md) | 报表 / BI | L |
| 12 | [17-12-feature-flags-system-settings](./17-12-feature-flags-system-settings.md) | Feature Flags + 系统设置 | M |

## 依赖
- E03（用户）/ E04（i18n）/ E12（经济）/ E13（支付）/ E14（分销）/ E15（客服）schema 已稳定
- E18-5 audit logs（贯穿）

## DoD
- 后台全功能可用
- RBAC 100% 覆盖路由 + UI
- 审计日志完整 append-only
- 报表可信
- 退款触发 commission_reversed（联通 S14）
- retrospective 完成
