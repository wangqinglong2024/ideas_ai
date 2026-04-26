/**
 * E09 — 游戏广场占位页。
 * UI 风格遵循设计系统，统一圆角、字号、配色。
 */
import type { JSX } from 'react';
import { Card, EmptyState, Grid, Badge, HStack } from '@zhiyu/ui';
import { useT } from '@zhiyu/i18n/client';

const GAMES = [
  { id: 'g1', name: '汉字忍者', desc: '滑动切水果式记字', icon: '🥷', difficulty: '简单' },
  { id: 'g2', name: '拼音射击', desc: '声调瞄准训练', icon: '🎯', difficulty: '中等' },
  { id: 'g3', name: '声调泡泡', desc: '听音辨调', icon: '🫧', difficulty: '简单' },
  { id: 'g4', name: '汉字俄罗斯方块', desc: '部首叠合', icon: '🧱', difficulty: '困难' },
];

export function PlayPage(): JSX.Element {
  const { t } = useT('common');
  return (
    <div className="pt-2" data-testid="play-page">
      <header className="mb-6">
        <h1 className="text-h1 text-text-primary">{t('nav.games')}</h1>
        <p className="mt-1 text-body text-text-secondary">12 款核心游戏，预计在 E09 上线。</p>
      </header>
      <Grid cols={2} gap={4}>
        {GAMES.map((g) => (
          <Card key={g.id} className="hover:shadow-md transition-shadow">
            <HStack gap={3} className="items-start">
              <span className="text-3xl">{g.icon}</span>
              <div className="flex-1">
                <h3 className="text-title font-semibold text-text-primary">{g.name}</h3>
                <p className="mt-1 text-small text-text-secondary">{g.desc}</p>
                <HStack gap={2} className="mt-2">
                  <Badge tone="sky" variant="soft">{g.difficulty}</Badge>
                  <Badge tone="neutral" variant="soft">{t('states.coming_soon')}</Badge>
                </HStack>
              </div>
            </HStack>
          </Card>
        ))}
      </Grid>
      <div className="mt-8">
        <EmptyState
          illustration="search"
          title={t('states.coming_soon')}
          description="完整游戏库将在 Epic 09 上线。"
        />
      </div>
    </div>
  );
}
