import client from './client';

/** 获取系统配置 */
export const getSettings = () =>
  client.get('/admin/settings');

/** 更新系统配置 */
export const updateSettings = (data: {
  order_price?: number;
  commission_ratio?: number;
  min_withdraw_amount?: number;
  ai_cost_per_call?: number;
  announcement?: string;
}) => client.put('/admin/settings', data);
