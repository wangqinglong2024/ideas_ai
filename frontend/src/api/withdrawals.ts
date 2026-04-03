import client from './client'
import type { ApiResponse, WithdrawalItem } from '../types/api'

export const applyWithdrawal = (data: {
  amount: number
  payee_name: string
  payee_account: string
  payee_method: 'wechat' | 'alipay'
}) => client.post<ApiResponse<{ withdrawal_id: string }>>('/withdrawals/apply', data)

export const getMyWithdrawals = (page = 1) =>
  client.get<ApiResponse<{ withdrawals: WithdrawalItem[]; page: number }>>('/withdrawals/my', {
    params: { page },
  })
