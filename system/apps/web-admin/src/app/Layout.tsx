import type { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { TopNav, ThemeToggle, Button } from '@zhiyu/ui-kit';
import { adminApi } from '../lib/http.ts';

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <TopNav
        left={
          <>
            <Link to="/" style={{ fontWeight: 700, fontSize: 18, color: 'var(--zy-brand)' }} data-testid="brand-link">
              知语 · Admin
            </Link>
            <Link to="/users" data-testid="nav-users">用户管理</Link>
            <Link to="/china" data-testid="nav-china">发现中国</Link>
          </>
        }
        right={
          <>
            <ThemeToggle />
            <Button
              variant="ghost"
              data-testid="admin-logout"
              onClick={async () => {
                try { await adminApi('/auth/logout', { method: 'POST' }); } catch { /* ignore */ }
                window.location.href = '/login';
              }}
            >
              退出
            </Button>
          </>
        }
      />
      <main className="zy-page" style={{ padding: 0 }}>{children}</main>
    </>
  );
}
