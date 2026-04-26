/**
 * E12 — 知语币页面占位。
 * UI 风格遵循设计系统。
 */
import type { JSX } from 'react';
import { Card, EmptyState, HStack, VStack, Badge } from '@zhiyu/ui';
import { useT } from '@zhiyu/i18n/client';

export function CoinPage(): JSX.Element {
  const { t } = useT('common');
  return (
    <div className="pt-2" data-testid="coin-page">
      <header className="mb-6">
        <h1 className="text-h1 text-text-primary">{t('nav.coin')}</h1>
        <p className="mt-1 text-body text-text-secondary">用学习赚知语币，用知语币换内容与服务。</p>
      </header>

      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
        <HStack gap={4} className="items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/15 text-2xl text-amber-700 dark:text-amber-400">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M9 9h4a2 2 0 0 1 0 4H9 M9 13h5a2 2 0 0 1 0 4H9 M12 6v12" />
            </svg>
          </div>
          <VStack gap={1}>
            <p className="text-h2 text-text-primary font-semibold">0</p>
            <p className="text-small text-text-secondary">可用知语币</p>
          </VStack>
        </HStack>
      </Card>

      {/* 获币规则概览 */}
      <Card className="mt-4">
        <h3 className="text-title font-semibold mb-3 text-text-primary">如何获得知语币？</h3>
        <div className="space-y-2">
          {[
            { action: '完成一节课程', reward: '+5~15 ZC', icon: '📚' },
            { action: '阅读完整文章', reward: '+3 ZC', icon: '📖' },
            { action: '每日学习 30 分钟', reward: '+10 ZC', icon: '⏱️' },
            { action: '邀请好友注册', reward: '+50 ZC', icon: '🤝' },
            { action: '游戏通关', reward: '+5 ZC', icon: '🎮' },
          ].map((r) => (
            <HStack key={r.action} gap={3} className="items-center rounded-xl border border-border-default p-3">
              <span className="text-xl">{r.icon}</span>
              <span className="flex-1 text-body text-text-primary">{r.action}</span>
              <Badge tone="amber" variant="soft">{r.reward}</Badge>
            </HStack>
          ))}
        </div>
      </Card>

      <div className="mt-8">
        <EmptyState illustration="search" title={t('states.coming_soon')} description="知语币 ZC 系统在 Epic 12 上线。" />
      </div>
    </div>
  );
}
