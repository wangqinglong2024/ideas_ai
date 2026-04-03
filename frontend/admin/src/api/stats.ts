import client from './client';

/** 获取 Dashboard 总览统计数据 */
export const getOverview = () =>
  client.get('/admin/stats/overview');

/** 获取近7天收入折线图数据 */
export const getRevenueChart = () =>
  client.get('/admin/stats/revenue-chart');
