import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useRouter } from '@tanstack/react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { TopNav, ThemeToggle } from '@zhiyu/ui-kit';
import { useTranslation } from 'react-i18next';
import { setLocale } from './i18n.ts';
import { LOCALES } from '@zhiyu/shared-config';
import { api } from '../lib/http.ts';

type SessionResp =
  | { authenticated: false }
  | { authenticated: true; user: { id: string; email: string; role: string; display_name: string | null } };

function initialsOf(s: string): string {
  const t = s.trim();
  if (!t) return '?';
  // 中文/CJK 取首字符
  if (/[\u4e00-\u9fa5]/.test(t[0])) return t.slice(0, 1);
  // 邮箱：取 @ 前的首两位
  const local = t.split('@')[0];
  const parts = local.split(/[._\-\s]+/).filter(Boolean);
  const ch = (parts[0]?.[0] ?? '?') + (parts[1]?.[0] ?? '');
  return ch.toUpperCase().slice(0, 2);
}

function AvatarMenu({ user, onLogout }: { user: { email: string; display_name: string | null }; onLogout: () => void }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false); }
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, []);
  const label = user.display_name ?? user.email;
  const initials = initialsOf(label);
  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <button
        type="button"
        data-testid="header-avatar"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t('header.open_menu', { defaultValue: '打开菜单' })}
        onClick={() => setOpen((v) => !v)}
        style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--zy-brand), var(--zy-brand-strong, #c0344b))',
          color: '#fff', fontWeight: 600, fontSize: 13,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid var(--zy-border)', cursor: 'pointer',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        }}
      >
        {initials}
      </button>
      {open && (
        <div
          role="menu"
          data-testid="header-avatar-menu"
          style={{
            position: 'absolute', right: 0, top: 'calc(100% + 8px)',
            minWidth: 200, background: 'var(--zy-bg-elev)', color: 'var(--zy-fg)',
            border: '1px solid var(--zy-border)', borderRadius: 12,
            boxShadow: '0 12px 32px rgba(0,0,0,0.12)', overflow: 'hidden', zIndex: 50,
          }}
        >
          <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--zy-border)' }}>
            <div style={{ fontWeight: 600, fontSize: 14 }} data-testid="menu-user-name">{label}</div>
            <div style={{ fontSize: 12, color: 'var(--zy-fg-soft)' }}>{user.email}</div>
          </div>
          <Link
            to="/me"
            data-testid="menu-profile"
            onClick={() => setOpen(false)}
            style={{ display: 'block', padding: '10px 14px', fontSize: 14 }}
          >
            {t('header.profile', { defaultValue: '个人中心' })}
          </Link>
          <button
            type="button"
            data-testid="menu-logout"
            onClick={() => { setOpen(false); onLogout(); }}
            style={{
              display: 'block', width: '100%', textAlign: 'left',
              padding: '10px 14px', fontSize: 14, background: 'transparent',
              border: 'none', borderTop: '1px solid var(--zy-border)',
              color: 'var(--zy-brand)', cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            {t('header.logout', { defaultValue: '退出登录' })}
          </button>
        </div>
      )}
    </div>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const { t, i18n } = useTranslation();
  const qc = useQueryClient();
  const router = useRouter();
  const session = useQuery({
    queryKey: ['header-session'],
    queryFn: () => api<SessionResp>('/auth/session'),
    staleTime: 30_000,
  });
  const authed = session.data?.authenticated === true;
  const user = authed ? session.data.user : null;

  async function logout() {
    try { await api('/auth/logout', { method: 'POST' }); } catch { /* ignore */ }
    qc.clear();
    window.location.href = '/';
  }
  async function gotoLogin() {
    await router.navigate({ to: '/auth/login' });
  }

  return (
    <>
      <TopNav
        left={
          <>
            <Link to="/" style={{ fontWeight: 700, fontSize: 18, color: 'var(--zy-brand)' }} data-testid="brand-link">
              {t('common.app_name')}
            </Link>
            <Link to="/china" data-testid="nav-china">{t('nav.discover')}</Link>
          </>
        }
        right={
          <>
            <select
              value={i18n.language}
              onChange={(e) => setLocale(e.target.value as never)}
              className="zy-input"
              style={{ width: 88, height: 36 }}
              data-testid="locale-switch"
            >
              {LOCALES.map((l) => <option key={l} value={l}>{l.toUpperCase()}</option>)}
            </select>
            <ThemeToggle label={t('theme.toggle')} />
            {authed && user ? (
              <AvatarMenu user={user} onLogout={logout} />
            ) : (
              <button
                type="button"
                className="zy-btn zy-btn-primary"
                onClick={gotoLogin}
                data-testid="cta-login"
                style={{ height: 36, padding: '0 14px' }}
              >
                {t('common.login')}
              </button>
            )}
          </>
        }
      />
      <main className="zy-page" style={{ padding: 24 }}>{children}</main>
    </>
  );
}
