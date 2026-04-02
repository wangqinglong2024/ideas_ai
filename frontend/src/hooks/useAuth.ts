/**
 * 认证 Hook：检查登录态，未登录跳转 /login
 * 同时检查 token 有效期（解析 JWT exp 字段）
 */
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export function useAuth() {
  const { token, userId, logout } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true })
      return
    }
    // 检查 JWT exp
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      if (payload.exp && Date.now() / 1000 > payload.exp) {
        logout()
        navigate('/login', { replace: true })
      }
    } catch {
      logout()
      navigate('/login', { replace: true })
    }
  }, [token, navigate, logout])

  return { token, userId }
}
