/**
 * 订单状态轮询 Hook
 * 每 2 秒拉取一次，最多 60 秒
 * 状态到达终态（completed/failed/refunded）后自动停止
 */
import { useState, useEffect, useRef } from 'react'
import { getOrderStatus } from '../api/orders'
import type { OrderStatus } from '../types/api'

const TERMINAL_STATUSES = new Set(['completed', 'failed', 'refunded', 'expired'])
const POLL_INTERVAL = 2000
const MAX_POLL_TIME = 60_000

export function useOrderStatus(orderId: string | undefined) {
  const [data, setData] = useState<OrderStatus | null>(null)
  const [error, setError] = useState<string | null>(null)
  const elapsedRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!orderId) return

    const poll = async () => {
      try {
        const res = await getOrderStatus(orderId)
        const status = res.data.data
        if (status) {
          setData(status)
          if (TERMINAL_STATUSES.has(status.status)) {
            clearInterval(timerRef.current!)
          }
        }
      } catch (e) {
        setError('查询失败，请刷新重试')
      }
      elapsedRef.current += POLL_INTERVAL
      if (elapsedRef.current >= MAX_POLL_TIME) {
        clearInterval(timerRef.current!)
        setError('查询超时，请刷新页面')
      }
    }

    poll() // 立即执行一次
    timerRef.current = setInterval(poll, POLL_INTERVAL)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [orderId])

  return { data, error }
}
