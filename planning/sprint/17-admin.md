# Sprint S17 · 管理后台（Admin）

> Epic：[E17](../epics/17-admin.md) · 阶段：M3-M5 贯穿（3 阶段交付） · 优先级：P0
> Story 数：12 · 状态：[sprint-status.yaml](./sprint-status.yaml#epic-17)

## Sprint 目标
admin.zhiyu.io 全功能后台：用户 / 内容 / CMS / 订单 / 客服 / 报表 / RBAC / 审计 / Flags。

## 三阶段交付

### Phase A · M3 · v1（W15-W20）
基础登录 + RBAC + Shell + 用户 / 文章 / 课程管理。

| 序 | Story Key | 估 |
|:-:|---|:-:|
| 1 | 17-1-admin-users-roles-permissions | M |
| 2 | 17-2-admin-login-totp | L |
| 3 | 17-3-rbac-middleware | M |
| 4 | 17-4-admin-app-shell | L |
| 5 | 17-5-user-management | L |
| 6 | 17-6-content-mgmt-articles | L |
| 7 | 17-7-content-mgmt-courses | L |

### Phase B · M4 · v2（W21-W26）
小说 / 游戏 / 词包 / CMS 控制台 + 工厂占位。

| 序 | Story Key | 估 |
|:-:|---|:-:|
| 8 | 17-8-content-mgmt-novels-games-wordpacks | L |
| 9 | 17-9-cms-publish-console-factory-placeholder | L |

### Phase C · M5 · v3（W27-W32）
订单 / 退款 / 分销 / 报表 / Flags / 设置。

| 序 | Story Key | 估 |
|:-:|---|:-:|
| 10 | 17-10-orders-refunds-referral | L |
| 11 | 17-11-reports-bi | L |
| 12 | 17-12-feature-flags-system-settings | M |

## 风险
- 后台权限错配 → 灰盒测试 + RBAC 矩阵单元测试
- 管理员误操作 → 二次确认 + 完整审计

## DoD
- [ ] 后台全功能可用
- [ ] RBAC 100% 覆盖路由 + UI
- [ ] 审计日志完整 append-only
- [ ] 报表可信
- [ ] 退款触发 commission_reversed（联通 S14）
- [ ] retrospective 完成
