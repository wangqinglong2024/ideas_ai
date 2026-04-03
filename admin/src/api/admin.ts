import client from './client'

// 登录
export const adminLogin = (username: string, password: string) =>
  client.post('/auth/admin/login', { username, password })

// Dashboard
export const getStatsOverview = () => client.get('/admin/stats/overview')
export const getRevenueChart = () => client.get('/admin/stats/revenue-chart')

// 订单
export const getOrders = (page = 1, status = '') =>
  client.get('/admin/orders', { params: { page, status } })
export const getOrderDetail = (id: string) => client.get(`/admin/orders/${id}`)
export const refundOrder = (id: string) => client.post(`/admin/orders/${id}/refund`)

// 提现
export const getWithdrawals = (page = 1, status = 'pending') =>
  client.get('/admin/withdrawals', { params: { page, status } })
export const approveWithdrawal = (id: string, admin_note?: string) =>
  client.post(`/admin/withdrawals/${id}/approve`, { admin_note })
export const rejectWithdrawal = (id: string, admin_note?: string) =>
  client.post(`/admin/withdrawals/${id}/reject`, { admin_note })
export const confirmPaid = (id: string) =>
  client.post(`/admin/withdrawals/${id}/confirm-paid`)

// 用户
export const getUsers = (page = 1) => client.get('/admin/users', { params: { page } })
export const getUserDetail = (id: string) => client.get(`/admin/users/${id}`)
export const freezeUser = (id: string) => client.post(`/admin/users/${id}/freeze`)
export const unfreezeUser = (id: string) => client.post(`/admin/users/${id}/unfreeze`)

// 设置
export const getSettings = () => client.get('/admin/settings')
export const updateSettings = (data: Record<string, unknown>) =>
  client.put('/admin/settings', data)
