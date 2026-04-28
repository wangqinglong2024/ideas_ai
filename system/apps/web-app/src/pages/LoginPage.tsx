import { useState } from 'react';
import { Link, useRouter, useSearch } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Input } from '@zhiyu/ui-kit';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/http.ts';

type LoginSearch = { redirect?: string };

export function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const qc = useQueryClient();
  const search = useSearch({ strict: false }) as LoginSearch;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      await api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      qc.clear();
      const dest = search.redirect && /^\/[A-Za-z0-9/_-]*/.test(search.redirect) ? search.redirect : '/china';
      window.location.href = dest;
    } catch (e) {
      setErr(t('auth.invalid_credentials'));
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
          <label className="zy-field">
            <span className="zy-label">{t('auth.email')}</span>
            <Input
              data-testid="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>
          <label className="zy-field">
            <span className="zy-label">{t('auth.password')}</span>
            <Input
              data-testid="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </label>
          {err && <div role="alert" className="zy-error-text" data-testid="login-error">{err}</div>}
          <Button type="submit" data-testid="login-submit" disabled={busy} style={{ width: '100%', height: 44, fontSize: 15 }}>
            {busy ? t('common.loading') : t('common.login')}
          </Button>
        </form>

        <div className="zy-login-divider"><span>{t('login_page.or', { defaultValue: '或' })}</span></div>

        <div className="zy-login-footer">
          <span className="zy-fg-soft">{t('login_page.no_account_q', { defaultValue: '还没有账号？' })}</span>
          <Link to="/auth/register" data-testid="to-register" className="zy-link-strong">
            {t('login_page.sign_up_now', { defaultValue: '立即注册' })}
          </Link>
        </div>
        <div className="zy-login-extra">
          <Link to="/" className="zy-fg-mute">← {t('common.back')}</Link>
          <span className="zy-fg-mute">{t('auth.forgot')}</span>
        </div>
      </div>
    </div>
  );
}
