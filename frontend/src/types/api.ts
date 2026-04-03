/** API 请求/响应公共类型 */

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  code?: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
}

export interface CreateOrderResponse {
  order_id: string
  pay_url: string
  pay_type: 'wechat_mweb' | 'wechat_jsapi' | 'alipay'
}

export interface OrderStatus {
  order_id: string
  status: 'pending' | 'paid' | 'generating' | 'completed' | 'failed' | 'expired' | 'refunded'
  report?: ReportData
}

export interface ReportData {
  /** 核心症结（300-500字）*/
  core_issue: string
  /** 三条路径（数组） */
  paths: ReportPath[]
  /** 认知升维（认知层面提升建议） */
  upgrade: string
  /** 金句（用于海报） */
  quote: string
}

export interface ReportPath {
  title: string
  content: string
  pros: string
  cons: string
}

export interface OrderListItem {
  id: string
  category: 'career' | 'emotion'
  status: string
  amount: number
  paid_at: string | null
  created_at: string
}

export interface WalletData {
  balance: number
  total_earned: number
  total_withdrawn: number
}

export interface CommissionItem {
  id: string
  type: 'self_cashback' | 'referral'
  amount: number
  status: string
  created_at: string
}

export interface WithdrawalItem {
  id: string
  amount: number
  payee_method: string
  status: 'pending' | 'approved' | 'rejected' | 'paid'
  admin_note: string | null
  created_at: string
}
