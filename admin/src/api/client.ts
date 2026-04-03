import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30_000,
})

const TOKEN_KEY = 'ideas-admin-token'

export const getAdminToken = () => localStorage.getItem(TOKEN_KEY)
export const setAdminToken = (t: string) => localStorage.setItem(TOKEN_KEY, t)
export const clearAdminToken = () => localStorage.removeItem(TOKEN_KEY)

client.interceptors.request.use((config) => {
  const token = getAdminToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      clearAdminToken()
      window.location.href = '/admin/login'
    }
    return Promise.reject(err)
  },
)

export default client
