import client from './client'
import type { ApiResponse, CreateOrderResponse, OrderStatus, OrderListItem } from '../types/api'

export const createOrder = (category: string, input_content: string) =>
  client.post<ApiResponse<CreateOrderResponse>>('/orders/create', { category, input_content })

export const getOrderStatus = (orderId: string) =>
  client.get<ApiResponse<OrderStatus>>(`/orders/${orderId}/status`)

export const getMyOrders = (page = 1) =>
  client.get<ApiResponse<{ orders: OrderListItem[]; page: number }>>('/orders/my', {
    params: { page },
  })
