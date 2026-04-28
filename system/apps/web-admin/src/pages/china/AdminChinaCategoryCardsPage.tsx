import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { GlassCard, Input, SkeletonCard, Button } from '@zhiyu/ui-kit';
import { adminApi } from '../../lib/http.ts';
import type { AdminCategory } from '../../lib/types.ts';

const CAT_ICONS: Record<string, string> = {
  '01': '🏛', '02': '🍜', '03': '🏔', '04': '🎎', '05': '🎨', '06': '🎼',
  '07': '📜', '08': '🐉', '09': '☯️', '10': '🌆', '11': '🀄️', '12': '🧚',
};

export function AdminChinaCategoryCardsPage() {
  const nav = useNavigate();
  const [q, setQ] = useState('');
  const cats = useQuery({
    queryKey: ['admin-china-categories'],
    queryFn: () => adminApi<{ items: AdminCategory[] }>('/china/categories'),
  });

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    nav({ to: '/china/search', search: { q: term } as never });
  };

  return (
    <div style={{ padding: 24 }} data-testid="admin-china-cards">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <h2 style={{ margin: 0 }}>发现中国 · 类目</h2>
        <form onSubmit={onSearch} style={{ display: 'flex', gap: 8, minWidth: 280 }}>
          <Input
            data-testid="global-search"
            placeholder="🔍 搜索文章标题或句子内容"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ minWidth: 240 }}
          />
          <Button type="submit" data-testid="global-search-submit">搜索</Button>
        </form>
      </div>

      {cats.isLoading && (
        <div className="zy-grid-12">
          {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} height={150} />)}
        </div>
      )}

      {cats.error && !cats.isLoading && (
        <div className="zy-state" data-testid="cards-error">
          <div className="zy-state-icon">⚠️</div>
          <div>{(cats.error as Error).message}</div>
          <Button onClick={() => cats.refetch()}>重试</Button>
        </div>
      )}

      {cats.data && (
        <div className="zy-grid-12" data-testid="admin-categories-grid">
          {cats.data.items.slice().sort((a, b) => a.sort_order - b.sort_order).map((c) => (
            <GlassCard
              key={c.id}
              data-testid={`admin-cat-${c.code}`}
              className="zy-china-card"
              role="button"
              tabIndex={0}
              onClick={() => nav({ to: '/china/categories/$code', params: { code: c.code } })}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); nav({ to: '/china/categories/$code', params: { code: c.code } }); } }}
            >
              <div style={{ fontSize: 24 }}>{CAT_ICONS[c.code] ?? '📚'}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ color: 'var(--zy-fg-mute)', fontSize: 12 }}>#{c.code}</span>
                <h3 style={{ margin: 0, fontSize: 17 }}>{c.name_i18n.zh}</h3>
              </div>
              <p style={{ margin: 0, color: 'var(--zy-fg-soft)', fontSize: 13, lineHeight: 1.5,
                display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden' }}>
                {c.description_i18n.zh}
              </p>
              <div className="zy-china-card-meta">
                <span>总数 <b style={{ color: 'var(--zy-fg)' }}>{c.article_count_total}</b></span>
                <span>已发布 <b style={{ color: '#16a34a' }}>{c.article_count_published}</b></span>
                <span>草稿 <b style={{ color: 'var(--zy-fg-soft)' }}>{c.article_count_draft}</b></span>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
