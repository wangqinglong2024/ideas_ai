# Story Index · E20 上线与发布（Launch）

> Epic：[E20](../../epics/20-launch.md) · Sprint：[S20](../../sprint/20-launch.md)
> 阶段：**M6（W35-W38）** · 优先级：P0 · 估算：4 周
> Story 数：10

## Sprint 目标
4 国（VN/TH/ID/SG）灰度上线：营销站、SEO、增长、客服、合规、上线日 + Postmortem 闭环。

## Story 列表

| 序 | Story Key | 标题 | 估 | 周次 |
|:-:|---|---|:-:|:-:|
| 1 | [20-1-marketing-site](./20-1-marketing-site.md) | 营销站 zhiyu.io | L | W35-W36 |
| 2 | [20-2-seo-optimization](./20-2-seo-optimization.md) | SEO 优化 | M | W36 |
| 3 | [20-3-app-store-pwa-twa](./20-3-app-store-pwa-twa.md) | PWA + TWA 准备 | M | W36 |
| 4 | [20-9-legal-compliance-review](./20-9-legal-compliance-review.md) | 法律合规检查 | M | W36 |
| 5 | [20-6-growth-pixels-integration](./20-6-growth-pixels-integration.md) | 增长接入（GTM/Meta/TikTok） | M | W37 |
| 6 | [20-7-launch-campaign](./20-7-launch-campaign.md) | 启动活动准备 | M | W37 |
| 7 | [20-8-cs-knowledge-base-training](./20-8-cs-knowledge-base-training.md) | 客服 + KB 培训 | M | W37 |
| 8 | [20-4-cross-platform-smoke-tests](./20-4-cross-platform-smoke-tests.md) | 跨平台冒烟 | L | W37-W38 |
| 9 | [20-5-canary-release](./20-5-canary-release.md) | 灰度 10→50→100% | M | W38 |
| 10 | [20-10-launch-day-postmortem](./20-10-launch-day-postmortem.md) | 上线日 + PIR | M | W38 |

## 依赖
- E04 i18n：4+1 语翻译资源就绪
- E13 支付：4 国本地支付通道全部 live
- E14 推荐：邀请链路稳定
- E15 客服：FAQ + 知识库 + 工单
- E18 安全 / E19 可观测：完整接入

## 风险
- **流量峰值** → 压测 + Render 自动扩 + Cloudflare cache
- **公关危机** → 危机沟通预案 + 媒体联系人
- **合规漏检** → 4 国清单逐项 + 律师审
- **跨平台兼容** → iOS/Android/iPad/Desktop × 4 语 × 4 国 矩阵

## DoD
- [ ] 4 国可用
- [ ] 灰度无重大故障（P1 = 0，P2 ≤ 3）
- [ ] 营销站 Lighthouse ≥ 95
- [ ] 法律合规 4+1 语
- [ ] 24h 在线支持
- [ ] PIR 完成 + 行动项分配
- [ ] retrospective 完成

## 参考
- [planning/spec/08-deployment.md](../../spec/08-deployment.md)
- [planning/spec/09-security.md](../../spec/09-security.md)
- [planning/prds/](../../prds/)
