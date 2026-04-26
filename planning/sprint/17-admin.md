# Sprint S17 · 管理后台

> 顶层约束：[planning/00-rules.md](../00-rules.md)
> Epic：[../epics/17-admin.md](../epics/17-admin.md) · 阶段：M3-M5 · 周期：W14-W22 滚动 · 优先级：P0
> Story 数：10 · 状态：[sprint-status.yaml](./sprint-status.yaml)

## 目标
分阶段交付：admin schema + login TOTP + RBAC + 应用骨架 → 用户管理 → 内容（文章 / 课程 / 小说 / 游戏 / 词包）→ 发布控制台 → 财务 / 退款 / 推荐 → 报表 / 风控 / 审计。

## 排期（滚动 9 周）
| 周 | Story | 验收 |
|---|---|---|
| W14-15 | ZY-17-01..04 admin tables/login/rbac/shell | 5 角色登录 + 菜单正确 |
| W16-17 | ZY-17-05 user mgmt | impersonate banner 不可关 |
| W18-19 | ZY-17-06 content articles+courses | 4 语翻译抽屉 |
| W19-20 | ZY-17-07 content novels/games/wordpacks | 三类 CRUD |
| W20-21 | ZY-17-08 publish console | 计划发布到点 |
| W21 | ZY-17-09 orders/refund/referral | 退款撤 entitlement |
| W22 | ZY-17-10 reports/flags/audit | 5 报表 ≤ 500ms |

## 依赖与并行
- 依赖 S01 / S03 / S18
- 配合 S06 / S07 / S08 / S11 / S12 / S13 / S14 / S15 同期上数据

## 退出标准
- 5 角色登录 + 菜单 + 操作 + 审计 全闭环
- 内容→发布→app 端可见
- 财务退款链路通

## 风险
- TOTP 设备遗失：超级管理员可重置流程
- 大富文本性能：分块加载
