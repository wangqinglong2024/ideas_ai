import { useQuery } from '@tanstack/react-query';
import { Button, GlassCard } from '@zhiyu/ui-kit';
import { adminApi } from '../lib/http.ts';

type UserRow = { id: string; email: string; role: string; display_name: string | null; is_active: boolean };

export function UsersPage() {
  const q = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminApi<{ items: UserRow[]; total: number }>('/users?page=1&size=50'),
  });
  async function toggle(u: UserRow) {
    await adminApi(`/users/${u.id}/active`, { method: 'POST', body: JSON.stringify({ is_active: !u.is_active }) });
    await q.refetch();
  }
  return (
    <div style={{ padding: 24 }}>
      <h2>用户管理</h2>
      <p style={{ color: 'var(--zy-fg-soft)', marginTop: -4, fontSize: 13 }}>
        仅展示普通用户（role=user），不包含任何管理员账号。
      </p>
      {q.isLoading && <p>加载中…</p>}
      {q.error && <p style={{ color: 'var(--zy-brand)' }}>{(q.error as Error).message}</p>}
      <div data-testid="users-table" style={{ display: 'grid', gap: 8 }}>
        {q.data?.items.length === 0 && !q.isLoading && (<GlassCard>暂无用户</GlassCard>)}
        {q.data?.items.map((u) => (
          <GlassCard key={u.id} data-testid={`user-row-${u.email}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <div>
                <div style={{ fontWeight: 600 }}>{u.display_name ?? u.email}</div>
                <div style={{ color: 'var(--zy-fg-soft)', fontSize: 13 }}>{u.email} · {u.role} · {u.is_active ? '启用' : '禁用'}</div>
              </div>
              <Button variant={u.is_active ? 'ghost' : 'primary'} data-testid={`toggle-${u.email}`} onClick={() => toggle(u)}>
                {u.is_active ? '禁用' : '启用'}
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
