import { useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { GlassCard, SkeletonCard, Modal, Button } from '@zhiyu/ui-kit';
import { api } from '../../lib/http.ts';
import type { ChinaCategory, Locale } from '../../lib/china-types.ts';
import { pickI18n } from '../../lib/china-types.ts';

type Resp = { items: ChinaCategory[] };

// 12 类目预置 emoji（A21）
const CAT_ICONS: Record<string, string> = {
  '01': '🏛', '02': '🍜', '03': '🏔', '04': '🎎', '05': '🎨', '06': '🎼',
  '07': '📜', '08': '🐉', '09': '☯️', '10': '🌆', '11': '🀄️', '12': '🧚',
};

export function ChinaCategoryCardsPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as Locale;
  const nav = useNavigate();

  const session = useQuery({
    queryKey: ['session'],
    queryFn: () => api<{ authenticated: boolean }>('/auth/session'),
    staleTime: 30_000,
  });
  const authed = session.data?.authenticated === true;

  const q = useQuery({
    queryKey: ['china-categories'],
    queryFn: () => api<Resp>('/china/categories'),
    staleTime: 60 * 60 * 1000,
  });

  const [lockTip, setLockTip] = useState<{ open: boolean; code: string }>({ open: false, code: '' });

  const items = useMemo(() => (q.data?.items ?? []).slice().sort((a, b) => a.sort_order - b.sort_order), [q.data]);

  function clickCard(c: ChinaCategory) {
    const requiresLogin = c.requires_login ?? c.code >= '04';
    if (requiresLogin && !authed) {
      setLockTip({ open: true, code: c.code });
      return;
    }
    nav({ to: `/china/categories/${c.code}` });
  }

  return (
    <div className="zy-container" data-testid="china-cards">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>{t('china.title', { defaultValue: '发现中国' })}</h1>
      </div>

      {q.isLoading && (
        <div className="zy-grid-12">
          {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} height={140} />)}
        </div>
      )}

      {q.error && !q.isLoading && (
        <div className="zy-state" data-testid="cards-error">
          <div className="zy-state-icon">⚠️</div>
          <div>{t('china.load_failed', { defaultValue: '内容加载失败' })}</div>
          <Button onClick={() => q.refetch()} data-testid="cards-retry">{t('common.retry')}</Button>
        </div>
      )}

      {q.data && (
        <div className="zy-grid-12" data-testid="categories-grid">
          {items.map((c) => {
            const requiresLogin = c.requires_login ?? c.code >= '04';
            const locked = requiresLogin && !authed;
            return (
              <GlassCard
                key={c.id}
                data-testid={`china-cat-${c.code}`}
                role="button"
                tabIndex={0}
                onClick={() => clickCard(c)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); clickCard(c); } }}
                className={`zy-china-card ${locked ? 'zy-china-card-locked' : ''}`}
              >
                {locked && <span className="zy-china-lock" aria-label="locked">🔒</span>}
                <div style={{ fontSize: 26 }}>{CAT_ICONS[c.code] ?? '📚'}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ color: 'var(--zy-fg-mute)', fontSize: 12 }}>#{c.code}</span>
                  <h3 style={{ margin: 0, fontSize: 17 }}>{pickI18n(c.name_i18n, lang)}</h3>
                </div>
                <p style={{ margin: 0, color: 'var(--zy-fg-soft)', fontSize: 13, lineHeight: 1.5,
                  display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden' }}>
                  {pickI18n(c.description_i18n, lang)}
                </p>
              </GlassCard>
            );
          })}
        </div>
      )}

      <LoginPromptModal
        open={lockTip.open}
        onClose={() => setLockTip({ open: false, code: '' })}
        onLogin={() => {
          const code = lockTip.code;
          setLockTip({ open: false, code: '' });
          nav({ to: '/auth/login', search: { redirect: `/china/categories/${code}` } as never });
        }}
      />
    </div>
  );
}

function LoginPromptModal({ open, onClose, onLogin }: { open: boolean; onClose: () => void; onLogin: () => void }) {
  const { t } = useTranslation();
  return (
    <Modal
      open={open}
      onClose={onClose}
      width={380}
      testId="login-prompt-modal"
      title={t('china.login_required_title', { defaultValue: '🔒 该类目需要登录后查看' })}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} data-testid="login-prompt-cancel">
            {t('china.login_later', { defaultValue: '再看看' })}
          </Button>
          <Button onClick={onLogin} data-testid="login-prompt-go">
            {t('china.login_go', { defaultValue: '去登录' })}
          </Button>
        </>
      }
    >
      <p style={{ margin: 0, color: 'var(--zy-fg-soft)', lineHeight: 1.6 }}>
        {t('china.login_required_body', { defaultValue: '登录后你还可以保存阅读进度。' })}
      </p>
    </Modal>
  );
}
