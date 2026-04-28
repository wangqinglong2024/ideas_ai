import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Button, Input } from '@zhiyu/ui-kit';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/http.ts';

type SendOtpResp = { sent: boolean; dev_code?: string };

export function RegisterPage() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [devCode, setDevCode] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function sendOtp() {
    setBusy(true); setErr(null); setInfo(null);
    try {
      const data = await api<SendOtpResp>('/auth/email/send-otp', {
        method: 'POST',
        body: JSON.stringify({ email, purpose: 'register' }),
      });
      setStep(2);
      setDevCode(data.dev_code ?? null);
      setInfo(t('auth.otp.sent', { defaultValue: '验证码已发送到邮箱，5 分钟内有效' }));
    } catch (e) {
      setErr((e as Error).message);
    } finally { setBusy(false); }
  }

  async function verifyAndCreate() {
    setBusy(true); setErr(null);
    try {
      await api('/auth/register/verify', {
        method: 'POST',
        body: JSON.stringify({ email, code, password, display_name: name || undefined }),
      });
      // 自动登录
      try {
        await api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
        window.location.href = '/china';
      } catch {
        nav({ to: '/auth/login' });
      }
    } catch (e) {
      setErr((e as Error).message);
    } finally { setBusy(false); }
  }

  return (
    <div className="zy-login-shell" data-testid="register-shell">
      <div className="zy-login-bg" aria-hidden="true">
        <div className="zy-blob zy-blob-1" />
        <div className="zy-blob zy-blob-2" />
        <div className="zy-blob zy-blob-3" />
      </div>
      <div className="zy-login-card zy-glass">
        <div className="zy-login-brand">
          <div className="zy-login-logo">知</div>
          <div>
            <div className="zy-login-title">{t('common.register')}</div>
            <div className="zy-login-subtitle">{t('auth.register_subtitle', { defaultValue: '邮箱验证码注册，无需点击链接' })}</div>
          </div>
        </div>

        {step === 1 && (
          <form
            onSubmit={(e) => { e.preventDefault(); void sendOtp(); }}
            className="zy-login-form"
          >
            <div className="zy-field">
              <label className="zy-label" htmlFor="reg-email">{t('auth.email')}</label>
              <Input id="reg-email" data-testid="register-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div className="zy-field">
              <label className="zy-label" htmlFor="reg-password">{t('auth.password')}</label>
              <Input id="reg-password" data-testid="register-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <div className="zy-field">
              <label className="zy-label" htmlFor="reg-name">{t('auth.display_name')}</label>
              <Input id="reg-name" data-testid="register-name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('auth.display_name')} />
            </div>
            {err && <div role="alert" className="zy-error-text" data-testid="register-error">{err}</div>}
            <Button type="submit" data-testid="register-send-otp" disabled={busy} style={{ width: '100%', height: 44, fontSize: 15 }}>
              {busy ? t('common.loading') : t('auth.otp.send', { defaultValue: '发送验证码' })}
            </Button>
            <div style={{ fontSize: 13, color: 'var(--zy-fg-soft)', textAlign: 'center' }}>
              <Link to="/auth/login" className="zy-link-strong">{t('auth.have_account')} {t('common.login')}</Link>
            </div>
          </form>
        )}

        {step === 2 && (
          <form
            onSubmit={(e) => { e.preventDefault(); void verifyAndCreate(); }}
            className="zy-login-form"
          >
            <div className="zy-field">
              <label className="zy-label">{t('auth.email')}</label>
              <Input value={email} disabled />
            </div>
            <div className="zy-field">
              <label className="zy-label" htmlFor="reg-code">{t('auth.otp.code', { defaultValue: '验证码' })}</label>
              <Input
                id="reg-code"
                data-testid="register-code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                inputMode="numeric"
                pattern="\d{6}"
                required
                style={{ letterSpacing: '0.4em', textAlign: 'center', fontSize: 18 }}
              />
            </div>
            {info && <div className="zy-helper" data-testid="register-info">{info}</div>}
            {devCode && (
              <div className="zy-helper" style={{ color: 'var(--zy-brand)' }} data-testid="register-dev-code">
                {t('auth.otp.dev_hint', { defaultValue: '开发环境验证码（仅 dev 可见）：' })}<b>{devCode}</b>
              </div>
            )}
            {err && <div role="alert" className="zy-error-text" data-testid="register-error">{err}</div>}
            <Button type="submit" data-testid="register-verify" disabled={busy || code.length !== 6} style={{ width: '100%', height: 44, fontSize: 15 }}>
              {busy ? t('common.loading') : t('auth.otp.verify', { defaultValue: '验证并完成注册' })}
            </Button>
            <button
              type="button"
              className="zy-link-mute"
              onClick={() => { setStep(1); setCode(''); setDevCode(null); }}
            >← {t('auth.otp.back', { defaultValue: '返回上一步' })}</button>
          </form>
        )}
      </div>
    </div>
  );
}
