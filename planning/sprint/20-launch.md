# Sprint S20 · 上线与发布（Launch）

> Epic：[E20](../epics/20-launch.md) · 阶段：M6 · 周期：W35-W38 · 优先级：P0
> Story 数：10 · 状态：[sprint-status.yaml](./sprint-status.yaml#epic-20)

## Sprint 目标
4 国（VN/TH/ID/SG）灰度上线，营销站、SEO、增长、客服、合规、上线日 + Postmortem。

## Story 列表

| 序 | Story Key | 标题 | 估 | 周次 |
|:-:|---|---|:-:|:-:|
| 1 | 20-1-marketing-site | 营销站 zhiyu.io | L | W35-W36 |
| 2 | 20-2-seo-optimization | SEO 优化 | M | W36 |
| 3 | 20-3-app-store-pwa-twa | PWA + TWA 准备 | M | W36 |
| 4 | 20-9-legal-compliance-review | 法律合规检查 | M | W36 |
| 5 | 20-6-growth-pixels-integration | 增长接入（GTM/Meta/TikTok） | M | W37 |
| 6 | 20-7-launch-campaign | 启动活动准备 | M | W37 |
| 7 | 20-8-cs-knowledge-base-training | 客服 + KB 培训 | M | W37 |
| 8 | 20-4-cross-platform-smoke-tests | 跨平台冒烟 | L | W37-W38 |
| 9 | 20-5-canary-release | 灰度 10→50→100% | M | W38 |
| 10 | 20-10-launch-day-postmortem | 上线日 + PIR | M | W38 |

## 风险
- 流量峰值 → 压测 + Render 自动扩
- 公关危机 → 预案 + 媒体联系人 + 危机沟通模板
- 合规漏检 → 4 国清单逐项 + 律师审

## DoD
- [ ] 4 国可用
- [ ] 灰度无重大故障（P1 = 0，P2 ≤ 3）
- [ ] 营销站 Lighthouse ≥ 95
- [ ] 法律合规 4+1 语
- [ ] 24h 在线支持
- [ ] PIR 完成 + 行动项分配
- [ ] retrospective 完成
