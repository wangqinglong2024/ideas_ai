import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Button, Input } from '@zhiyu/ui-kit';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/http.ts';

type SendOtpResp = { sent: boolean; dev_code?: string; dev_skipped?: boolean };

export function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [pwd, setPwd] = useState('');
  const [devCode, setDevCode] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function sendOtp() {
    setBusy(true); setErr(null);
    try {
      const data = await api<SendOtpResp>('/auth/email/send-otp', {
        method: 'POST',
        body: JSON.stringify({ email, purpose: 'reset_password' }),
      });
      setStep(2);
      setDevCode(data.dev_code ?? null);
      setInfo(t('auth.otp.sent', { defaultValue: '验证码已发送到邮箱，5 分钟内有效' }));
    } catch (e) {
      setErr((e as Error).message);
    } finally { setBusy(false); }
  }

  async function reset() {
    setBusy(true); setErr(null);
    try {
      await api('/auth/password/reset', {
        method: 'POST',
        body: JSON.stringify({ email, code, new_password: pwd }),
      });
      setStep(3);
    } catch (e) {
      setErr((e as Error).message);
    } finally { setBusy(false); }
  }

  return (
    <div className="zy-login-shell" data-testid="forgot-shell">
      <div className="zy-login-bg" aria-hidden="true">
        <div className="zy-blob zy-blob-1" />
        <div className="zy-blob zy-blob-2" />
        <div className="zy-blob zy-blob-3" />
      </div>
      <div className="zy-login-card zy-glass">
        <div className="zy-login-brand">
          <div className="zy-login-logo">知</div>
          <div>
            <div className="zy-login-title">{t('auth.forgot', { defaultValue: '找回密码' })}</div>
            <div className="zy-login-subtitle">{t('auth.forgot_subtitle', { defaultValue: '通过邮箱验证码重置密码' })}</div>
          </div>
        </div>

        {step === 1 && (
          <form onSubmit={(e) => { e.preventDefault(); void sendOtp(); }} className="zy-login-form">
            <div className="zy-field">
              <label className="zy-label" htmlFor="fg-email">{t('auth.email')}</label>
              <Input id="fg-email" data-testid="forgot-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            {err && <div role="alert" className="zy-error-text">{err}</div>}
            <Button type="submit" disabled={busy} data-testid="forgot-send" style={{ width: '100%', height: 44, fontSize: 15 }}>
              {busy ? t('common.loading') : t('auth.otp.send', { defaultValue: '发送验证码' })}
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={(e) => { e.preventDefault(); void reset(); }} className="zy-login-form">
            <div className="zy-field">
              <label className="zy-label">{t('auth.email')}</label>
              <Input value={email} disabled />
            </div>
            <div className="zy-field">
              <label className="zy-label" htmlFor="fg-code">{t('auth.otp.code', { defaultValue: '验证码' })}</label>
              <Input id="fg-code" data-testid="forgot-code" value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456" inputMode="numeric" pattern="\d{6}" required
                style={{ letterSpacing: '0.4em', textAlign: 'center', fontSize: 18 }}
              />
            </div>
            <div className="zy-field">
              <label className="zy-label" htmlFor="fg-pwd">{t('auth.new_password', { defaultValue: '新密码' })}</label>
              <Input id="fg-pwd" data-testid="forgot-pwd" type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} required />
            </div>
            {info && <div className="zy-helper">{info}</div>}
            {devCode && (
              <div className="zy-helper" style={{ color: 'var(--zy-brand)' }} data-testid="forgot-dev-code">
                {t('auth.otp.dev_hint', { defaultValue: '开发环境验证码（仅 dev 可见）：' })}<b>{devCode}</b>
              </div>
            )}
            {err && <div role="alert" className="zy-error-text">{err}</div>}
            <Button type="submit" disabled={busy || code.length !== 6 || pwd.length < 8} data-testid="forgot-reset"
                    style={{ width: '100%', height: 44, fontSize: 15 }}>
              {busy ? t('common.loading') : t('auth.reset_password', { defaultValue: '重置密码' })}
            </Button>
          </form>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center', display: 'grid', gap: 12 }} data-testid="forgot-done">
            <p>{t('auth.reset_done', { defaultValue: '密码已重置，请使用新密码登录' })}</p>
            <Link to="/auth/login" className="zy-link-strong">{t('common.login')}</Link>
          </div>
        )}

        <div className="zy-login-extra">
          <Link to="/auth/login" className="zy-link-mute">← {t('common.login')}</Link>
          <Link to="/auth/register" className="zy-link-mute">{t('common.register')}</Link>
        </div>
      </div>
    </div>
  );
}
