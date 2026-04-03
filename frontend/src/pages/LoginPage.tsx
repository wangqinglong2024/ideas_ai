/**
 * 登录页：手机号 + 短信验证码，底部下划线输入框风格
 */
import { useState, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import MeshBackground from '../components/layout/MeshBackground'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import { sendSms, login } from '../api/auth'
import { useAuthStore } from '../store/authStore'

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

export default function LoginPage() {
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [sending, setSending] = useState(false)
  const [logging, setLogging] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const setToken = useAuthStore((s) => s.setToken)
  const inviteCode = searchParams.get('invite') || undefined

  const handleSendSms = useCallback(async () => {
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      setError('请输入正确的手机号')
      return
    }
    setSending(true)
    setError('')
    try {
      await sendSms(phone)
      setCountdown(60)
      const timer = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) { clearInterval(timer); return 0 }
          return c - 1
        })
      }, 1000)
    } catch (e: any) {
      setError(e.response?.data?.message || '发送失败，请稍后重试')
    } finally {
      setSending(false)
    }
  }, [phone])

  const handleLogin = useCallback(async () => {
    if (!phone || !code) {
      setError('请填写手机号和验证码')
      return
    }
    setLogging(true)
    setError('')
    try {
      const res = await login(phone, code, inviteCode)
      const token = res.data.data?.access_token
      if (token) {
        setToken(token)
        navigate('/', { replace: true })
      }
    } catch (e: any) {
      setError(e.response?.data?.message || '登录失败，请重试')
    } finally {
      setLogging(false)
    }
  }, [phone, code, inviteCode, setToken, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center px-5" style={{ background: 'var(--bg-base)' }}>
      <MeshBackground />
      <motion.div
        className="w-full max-w-app"
        variants={pageVariants}
        initial="initial"
        animate="animate"
      >
        {/* Logo */}
        <div className="text-center mb-12">
          <h1
            className="text-2xl font-semibold mb-2"
            style={{ color: 'var(--text-gold)', letterSpacing: '0.18em' }}
          >
            内观
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            AI 认知镜 · 看清困境的本质
          </p>
        </div>

        {/* 表单 */}
        <div className="flex flex-col gap-8">
          <Input
            label="手机号"
            type="tel"
            inputMode="numeric"
            maxLength={11}
            placeholder="请输入手机号"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              验证码
            </label>
            <div className="flex items-end gap-3">
              <input
                className="input-underline flex-1"
                type="tel"
                inputMode="numeric"
                maxLength={6}
                placeholder="6位验证码"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              />
              <button
                className="text-sm whitespace-nowrap pb-3 transition-opacity"
                style={{
                  color: countdown > 0 || sending ? 'var(--text-muted)' : 'var(--text-gold)',
                  cursor: countdown > 0 || sending ? 'not-allowed' : 'pointer',
                  background: 'transparent',
                  border: 'none',
                }}
                disabled={countdown > 0 || sending}
                onClick={handleSendSms}
              >
                {sending ? '发送中' : countdown > 0 ? `${countdown}s` : '获取验证码'}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm" style={{ color: 'var(--error)' }}>
              {error}
            </p>
          )}

          <Button onClick={handleLogin} loading={logging} className="mt-4">
            登录 / 注册
          </Button>
        </div>

        <p className="text-xs text-center mt-8" style={{ color: 'var(--text-muted)' }}>
          登录即表示同意《用户协议》和《隐私政策》
        </p>
      </motion.div>
    </div>
  )
}
