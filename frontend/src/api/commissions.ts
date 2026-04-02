import client from './client'
import type { ApiResponse, WalletData, CommissionItem } from '../types/api'

export const getBalance = () =>
  client.get<ApiResponse<{ wallet: WalletData; recent_commissions: CommissionItem[] }>>(
    '/commissions/balance',
  )
