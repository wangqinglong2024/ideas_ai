# 9.3 · 分销 · 验收准则

## 功能
- [ ] RF-AC-001：注册自动生成 6 位邀请码（无歧义字符）
- [ ] RF-AC-002：分享链接 + QR 海报 + 多语种文案
- [ ] RF-AC-003：访客通过 /r/:code 注册 → 上级正确绑定
- [ ] RF-AC-004：设备指纹相同 → 拒绑
- [ ] RF-AC-005：30 天 + 5 节 → is_effective=true
- [ ] RF-AC-006：付费触发 L1 / L2 佣金
- [ ] RF-AC-007：14 天确认期；退款扣回
- [ ] RF-AC-008：≥$50 可提现
- [ ] RF-AC-009：转知语币 1 USD = 100 ZC
- [ ] RF-AC-010：仪表板余额准确（pending / confirmed / paid）
- [ ] RF-AC-011：反作弊告警（同 IP 聚集、同设备）

## 非功能
- [ ] 仪表板 P95 < 500ms
- [ ] 退款触发佣金扣回不丢
- [ ] RLS 仅自己可看自己佣金

## 测试用例
1. 用户 A 邀请 B，B 30 天内完 5 节 → is_effective=true
2. B 付 $40 → A pending +$8；14 天后 confirmed
3. B 退款 → A 状态 reversed -$8（已 confirmed 则余额回退）
4. A 再邀 C，C 也付 → A pending +$8
5. B 邀 D，D 付 → A 得 L2 $8，B 得 L1 $8
6. 设备指纹相同（A 自己注册 X）→ 拒
7. 提现 $30 → 拒（< $50）
8. 提现 $60 PayPal → 状态 processing；T+15 后 paid

## 监控
- 日新增有效推荐
- 月佣金发放总额
- 反作弊触发次数
- 提现成功率 / 失败率
