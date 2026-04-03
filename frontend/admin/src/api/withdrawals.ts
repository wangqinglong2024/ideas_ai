import client from './client';

/** 提现列表查询参数 */
export interface WithdrawalListParams {
  page?: number;
  page_size?: number;
  status?: string;
}

/** 获取提现列表 */
export const listWithdrawals = (params: WithdrawalListParams = {}) =>
  client.get('/admin/withdrawals', { params });

/** 审核通过 */
export const approveWithdrawal = (id: string, admin_note?: string) =>
  client.post(`/admin/withdrawals/${id}/approve`, { admin_note });

/** 审核拒绝 */
export const rejectWithdrawal = (id: string, admin_note?: string) =>
  client.post(`/admin/withdrawals/${id}/reject`, { admin_note });

/** 确认打款 */
export const confirmPaid = (id: string) =>
  client.post(`/admin/withdrawals/${id}/confirm-paid`);
