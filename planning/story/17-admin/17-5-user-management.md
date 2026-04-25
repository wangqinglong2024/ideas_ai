# Story 17.5: 用户管理（列表 / 详情 / 操作 / 审计）

Status: ready-for-dev

## Story

作为 **运营 / 客服**，
我希望 **管理 C 端用户：搜索、查看详情、执行高危操作（封禁 / 重置密码 / 调整知语币）**，
以便 **支持运营决策与客服响应，所有写操作具备审计与权限边界**。

## Acceptance Criteria

1. 路由 `/admin/users`：列表分页 50/页；筛选 status / country / lang / 注册日期 / VIP / 是否 paid。
2. 列表列：avatar / email / phone / created_at / last_login / status / VIP / paid_total / coins。
3. 全局搜索：email / phone / user_id 精确匹配；ILIKE email 前缀。
4. 用户详情 tabs：
   - **概览**：基本资料 / 账号信息 / 设备 / IP 地理（最近 5 个）
   - **学习**：进度 / streak / vocabulary / mistakes 数量
   - **订单**：订单列表（来自 E13）
   - **分销**：邀请关系 / 佣金（来自 E14；只读）
   - **客服**：会话列表（来自 E15）
   - **审计**：本用户被操作历史
5. **操作**：
   - 封禁 / 解封：status `disabled` ↔ `active`，需输入原因 ≥ 10 字。
   - 重置密码：发送重置邮件，记录但不直接改密。
   - 重置 TOTP（如该用户为后台 admin 不在此处，仅在 17-12）。
   - 调整知语币（增 / 减）：调用 12-x ledger API（reason 必填，超过 ±1000 ZC 需二次确认）。
   - 强制下线（撤销所有 sessions）。
6. **危险操作二次确认**：modal 输入用户 email 全字符串验证。
7. **批量**：列表多选 → 批量封禁 / 解封 / 强制下线（最多 100 行）。
8. **导出**：当前筛选结果 CSV 导出（不含敏感字段如手机号 / 密码）。
9. **权限**：`users:read` / `users:write` / `users:bulk` 细分；普通编辑无 bulk。
10. **审计**：每个写操作 audit_logs（actor / target / before / after / reason）。
11. **隐私**：详情页电话号码默认遮蔽（中间 4 位 *），点击 + 二次密码确认才显示。
12. e2e 测试：搜索 / 筛选 / 封禁 / 知语币调整 / 审计可见。

## Tasks / Subtasks

- [ ] **API**（AC: 1-5, 7-9）
  - [ ] `apps/api/src/routes/admin/users/*.ts`
  - [ ] Zod 输入校验
- [ ] **UI 列表**（AC: 1-3, 7, 8）
- [ ] **UI 详情 tabs**（AC: 4, 11）
- [ ] **操作 + 二次确认**（AC: 5, 6, 10）
- [ ] **批量**（AC: 7）
- [ ] **测试**（AC: 12）

## Dev Notes

### 关键约束
- 详情页跨 epic 数据：通过聚合 API（`GET /api/admin/users/:id/overview`），各域负责实现自己的 sub-handler，本 story 拼装。
- 调整知语币：必须走 12-3 ledger API，禁止直接 UPDATE balances；reason 写入 ledger.note 与 audit_logs。
- 重置密码邮件：调用 user-account 模块的 send-reset，admin 不接收 token。
- 批量上限 100：避免长事务；超出分批执行。
- 隐私：电话脱敏正则 `/^(.{3}).+(.{4})$/` → `$1****$2`。

### 关联后续 stories
- 17-1 ~ 17-4
- E03 user-account schema
- E12 ledger
- 18-5 audit
- 17-9 CMS / 17-10 orders

### Project Structure Notes
- `apps/admin/src/pages/users/`
  - `List.tsx` / `Detail.tsx` / `tabs/*.tsx` / `actions/*.tsx`
- `apps/api/src/routes/admin/users/*.ts`

### References
- `planning/epics/17-admin.md` ZY-17-05
- `planning/spec/05-data-model.md`

### 测试标准
- e2e：完整路径
- 安全：无 `users:write` 试图操作 → 403
- 审计：每操作 1 行 audit_logs

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
