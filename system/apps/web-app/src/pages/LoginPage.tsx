import { useState } from 'react';
import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Input } from '@zhiyu/ui-kit';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/http.ts';

type LoginSearch = { redirect?: string };

// dev mock 默认账号（用户演示用）
const MOCK_DEFAULT_EMAIL = 'demo@zhiyu.local';
const MOCK_DEFAULT_PASSWORD = 'Demo@123456';

export function LoginPage() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const qc = useQueryClient();
  const search = useSearch({ strict: false }) as LoginSearch;
  const [email, setEmail] = useState(MOCK_DEFAULT_EMAIL);
  const [password, setPassword] = useState(MOCK_DEFAULT_PASSWORD);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function destAfterLogin(): string {
    return search.redirect && /^\/[A-Za-z0-9/_-]*/.test(search.redirect) ? search.redirect : '/china';
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      await api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      qc.clear();
      window.location.href = destAfterLogin();
    } catch {
      setErr(t('auth.invalid_credentials'));
    } finally {
      setBusy(false);
    }
  }

  async function googleLogin() {
    setBusy(true); setErr(null);
    try {
      // dev mock：直接传 mock_email；接入真实 Google 后改为 id_token
      await api('/auth/google', {
        method: 'POST',
        body: JSON.stringify({ mock_email: 'google.demo@zhiyu.local', mock_name: 'Google Demo' }),
      });
      qc.clear();
      window.location.href = destAfterLogin();
    } catch (e) {
      setErr((e as Error).message || 'google_login_failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="zy-login-shell" data-testid="login-shell">
      <div className="zy-login-bg" aria-hidden="true">
        <div className="zy-blob zy-blob-1" />
        <div className="zy-blob zy-blob-2" />
        <div className="zy-blob zy-blob-3" />
      </div>

      <div className="zy-login-card zy-glass">
        <div className="zy-login-brand">
          <div className="zy-login-logo">知</div>
          <div>
            <div className="zy-login-title">{t('login_page.welcome', { defaultValue: '欢迎回来' })}</div>
            <div className="zy-login-subtitle">{t('login_page.subtitle', { defaultValue: '登录后开启你的中文学习之旅' })}</div>
          </div>
        </div>

        <form onSubmit={submit} className="zy-login-form">
          <div className="zy-field">
            <label className="zy-label" htmlFor="login-email-input">{t('auth.email')}</label>
            <Input
              id="login-email-input"
              data-testid="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>
          <div className="zy-field">
            <label className="zy-label" htmlFor="login-password-input">{t('auth.password')}</label>
            <Input
              id="login-password-input"
              data-testid="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>
          {err && <div role="alert" className="zy-error-text" data-testid="login-error">{err}</div>}
          <Button type="submit" data-testid="login-submit" disabled={busy} style={{ width: '100%', height: 44, fontSize: 15 }}>
            {busy ? t('common.loading') : t('common.login')}
          </Button>
        </form>

        <div className="zy-login-divider"><span>{t('login_page.or', { defaultValue: '或' })}</span></div>

        <button
          type="button"
          className="zy-google-btn"
          data-testid="google-login"
          disabled={busy}
          onClick={googleLogin}
        >
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.6 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C33.6 5.5 29.1 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.3-.4-3.5z" />
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C33.6 6.5 29.1 5 24 5c-7.7 0-14.4 4.4-17.7 10.7z" />
            <path fill="#4CAF50" d="M24 43c5 0 9.6-1.9 13-5l-6-5c-1.9 1.3-4.3 2-7 2-5.2 0-9.7-3.4-11.3-8l-6.5 5C9.5 38.6 16.2 43 24 43z" />
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4-4 5.3l6 5C40.6 35 44 30 44 24c0-1.3-.1-2.3-.4-3.5z" />
          </svg>
          <span>{t('login_page.google', { defaultValue: '使用 Google 登录' })}</span>
        </button>

        <div className="zy-login-footer">
          <span className="zy-fg-soft">{t('login_page.no_account_q', { defaultValue: '还没有账号？' })}</span>
          <Link to="/auth/register" data-testid="to-register" className="zy-link-strong">
            {t('login_page.sign_up_now', { defaultValue: '立即注册' })}
          </Link>
        </div>
        <div className="zy-login-extra">
          <button
            type="button"
            className="zy-link-mute"
            onClick={() => nav({ to: '/' })}
          >← {t('common.back')}</button>
          <Link to="/auth/forgot" data-testid="to-forgot" className="zy-link-mute">
            {t('auth.forgot', { defaultValue: '忘记密码？' })}
          </Link>
        </div>
      </div>
    </div>
  );
}
