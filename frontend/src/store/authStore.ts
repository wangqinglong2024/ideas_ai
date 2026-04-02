/**
 * 全局认证状态（Zustand）
 * token 持久化到 localStorage
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
  userId: string | null
  setToken: (token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userId: null,
      setToken: (token) => {
        // 解析 JWT payload 提取 user_id（不验签，仅读取）
        try {
          const payload = JSON.parse(atob(token.split('.')[1]))
          set({ token, userId: payload.sub })
        } catch {
          set({ token, userId: null })
        }
      },
      logout: () => set({ token: null, userId: null }),
    }),
    {
      name: 'ideas-auth',
      partialize: (s) => ({ token: s.token, userId: s.userId }),
    },
  ),
)
