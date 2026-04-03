import client from './client';

/** 订单列表查询参数 */
export interface OrderListParams {
  page?: number;
  page_size?: number;
  status?: string;
}

/** 获取订单列表 */
export const listOrders = (params: OrderListParams = {}) =>
  client.get('/admin/orders', { params });

/** 获取订单详情 */
export const getOrder = (id: string) =>
  client.get(`/admin/orders/${id}`);

/** 标记订单退款 */
export const refundOrder = (id: string) =>
  client.post(`/admin/orders/${id}/refund`);
