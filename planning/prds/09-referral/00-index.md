# 09 · 分销系统（Referral · RF）

> **代号**：RF | **优先级**：P0 | **核心**：永久 2 级 20% + 20% 分销

## 文件
- [01-functional-requirements.md](./01-functional-requirements.md)
- [02-data-model-api.md](./02-data-model-api.md)
- [03-acceptance-criteria.md](./03-acceptance-criteria.md)

## 关键决策
- 2 级永久分销
  - L1（直推）：被推荐人首次付费及后续付费 20% 永久回佣
  - L2（间推）：被 L1 推荐的用户付费 20% 永久回佣
- 有效推荐定义：
  - 注册后 30 天内完成 ≥ 5 节学习
  - 设备指纹与上级不同（防自推）
- 邀请码：6 位字母数字（用户唯一）
- 邀请落地页：`/r/:code`
- 提现：≥ $50，T+15 工作日 PayPal / Wise / 银行转账
- 分销关系永久（不会因不活跃失效）
- 反作弊：FingerprintJS 设备指纹 + IP 段 + 行为分析
- 收益币 vs 现金：v1 默认现金（USD），用户可选转知语币（1 USD = 100 ZC）
