import client from './client';

/** 获取用户列表 */
export const listUsers = (params: { page?: number } = {}) =>
  client.get('/admin/users', { params });

/** 获取用户详情（含钱包和订单数） */
export const getUser = (id: string) =>
  client.get(`/admin/users/${id}`);

/** 冻结用户 */
export const freezeUser = (id: string) =>
  client.post(`/admin/users/${id}/freeze`);

/** 解封用户 */
export const unfreezeUser = (id: string) =>
  client.post(`/admin/users/${id}/unfreeze`);
