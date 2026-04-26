# Epic E20 · 上线与发布（Launch · Dev Acceptance）

> 阶段：M6 · 优先级：P0 · 估算：2 周
>
> 顶层约束：[planning/00-rules.md](../00-rules.md)
>
> **范围调整**：本 dev 周期不做生产灰度 / 多区域 / 营销站发布。仅做 **dev 环境验收冲刺**：跨设备 + 4 语冒烟、增长接入占位、活动配置就绪、合规文件齐。生产域名 / CDN / 商店上架由用户后续自行处理。

## 摘要
完成 dev 环境上线就绪的全部前置：跨平台 PWA 冒烟、4 语回归、增长 pixel 容器化占位、活动配置、客服培训文档、法律合规清单。

## Stories（按需 6）

### ZY-20-01 · 营销站雏形（dev only）
**AC**
- [ ] 落地 / 定价 / 课程介绍 / 关于 4 页面（4 语）
- [ ] SEO 元数据 + sitemap.xml + robots.txt + hreflang + OG cards
- [ ] 仅在 zhiyu-app-fe 容器内 `/marketing/*` 路由；外网通过 3100 直连
- [ ] Lighthouse ≥ 90（dev 容器内跑）
**估**：L

### ZY-20-02 · 跨平台冒烟测试（MCP Puppeteer 矩阵）
**AC**
- [ ] iPhone Safari / Android Chrome / iPad / Desktop Chrome 主流程脚本
- [ ] 4 语回归
- [ ] 报告以 markdown 输出至 `planning/qa-reports/dev-acceptance.md`
**估**：L

### ZY-20-03 · 增长接入占位（feature flag 包裹）
**AC**
- [ ] `<GrowthPixel id="…" />` 组件，flag 关闭时空 render
- [ ] GA / Meta / TikTok pixel 实现留 stub（用户填 id 后启用）
- [ ] 不预装任何 GTM / SaaS SDK
**估**：S

### ZY-20-04 · 启动活动配置就绪
**AC**
- [ ] 注册赠 100 ZC（economy 规则配置）
- [ ] 邀请 3 人解锁 1 月 VIP（referral 规则配置 + 自动 issue entitlement）
- [ ] 活动月双倍 XP（Flag）
**估**：M

### ZY-20-05 · 客服 + 知识库培训文档
**AC**
- [ ] FAQ 4 语完整（写入 `faq` 表）
- [ ] 客服话术 markdown 在 `planning/runbooks/cs-playbook.md`
- [ ] 上线值班排班模板
**估**：M

### ZY-20-06 · 法律合规清单 + 验收 D-day
**AC**
- [ ] 隐私 / TOS / 退款 / Cookie 4+1 语 占位文档（律师终审由用户自处理）
- [ ] D-day 检查清单 markdown
- [ ] 24/72/168h 监控指标基线（接 E19 仪表板）
- [ ] PIR 模板
**估**：M

## DoD
- [ ] 4 语跨设备主流程冒烟全绿
- [ ] 增长 pixel 默认关闭，flag 开启可生效
- [ ] 活动 / 客服 / 法律占位文档齐
- [ ] 不存在生产域名 / 灰度 / GTM 真实接入逻辑
