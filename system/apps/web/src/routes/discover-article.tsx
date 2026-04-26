/**
 * E06 — 沉浸式文章阅读页。
 *
 * 严格遵循 PRD 02-discover-china：
 *  - DC-FR-003：标题 + 元信息 + 句子列表 + 关键点卡片 + 末尾 CTA
 *  - DC-FR-004：句子点击播放 + 长按弹窗 + 拼音 on/off
 *  - DC-FR-005：阅读进度（5s 防抖 + 自动滚动恢复）
 *  - DC-FR-006：文章级收藏（心形按钮）
 *  - DC-FR-007：句子级笔记
 *  - DC-FR-008：文章评分
 *  - DC-FR-012：相关推荐（末尾 4 篇）
 *  - DC-FR-013：母语切换
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { JSX } from 'react';
import { Link, useParams } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Badge, Button, Card, HStack, VStack } from '@zhiyu/ui';
import { useT } from '@zhiyu/i18n/client';
import { discover } from '../lib/api.js';
import { CharPopover } from '../components/discover/CharPopover.js';
import { RatingStars } from '../components/discover/RatingStars.js';

const FONT_LS_KEY = 'zhiyu:reader:font';
const PINYIN_LS_KEY = 'zhiyu:reader:pinyin';
const TRANS_LS_KEY = 'zhiyu:reader:trans';

function pickI18n(map: Record<string, string> | null | undefined, lng: string): string {
  if (!map) return '';
  return map[lng] || map['en'] || map['zh-CN'] || Object.values(map)[0] || '';
}

function isHanChar(c: string): boolean {
  if (!c) return false;
  const cp = c.codePointAt(0);
  if (cp === undefined) return false;
  return (
    (cp >= 0x4e00 && cp <= 0x9fff) ||
    (cp >= 0x3400 && cp <= 0x4dbf) ||
    (cp >= 0x20000 && cp <= 0x2a6df)
  );
}

function speak(text: string, rate = 1, voice?: string): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-CN';
    u.rate = rate;
    if (voice) {
      const v = window.speechSynthesis.getVoices().find((vv) => vv.name === voice);
      if (v) u.voice = v;
    }
    window.speechSynthesis.speak(u);
  } catch {
    /* ignore */
  }
}

/* ── 心形收藏图标 DC-FR-006 ── */
function HeartIcon({ filled }: { filled: boolean }): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

/* ── 笔记图标 DC-FR-007 ── */
function NoteIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

export function DiscoverArticlePage(): JSX.Element {
  const { slug } = useParams({ from: '/discover/$slug' as never }) as { slug: string };
  const { t, i18n } = useT('common');
  const lng = i18n.language || 'en';
  const qc = useQueryClient();

  /* ── 数据加载 ── */
  const { data, isLoading, isError } = useQuery({
    queryKey: ['discover', 'article', slug],
    queryFn: () => discover.article(slug),
  });

  /* ── 相关推荐 DC-FR-012 ── */
  const { data: relatedData } = useQuery({
    queryKey: ['discover', 'related', slug],
    queryFn: () => discover.related(slug).catch(() => ({ items: [] })),
    enabled: !!data,
    staleTime: 5 * 60_000,
  });

  /* ── 阅读偏好状态 ── */
  const [showPinyin, setShowPinyin] = useState<boolean>(() =>
    typeof window !== 'undefined' ? localStorage.getItem(PINYIN_LS_KEY) !== '0' : true,
  );
  const [showTrans, setShowTrans] = useState<boolean>(() =>
    typeof window !== 'undefined' ? localStorage.getItem(TRANS_LS_KEY) !== '0' : true,
  );
  const [fontPct, setFontPct] = useState<number>(() => {
    if (typeof window === 'undefined') return 110;
    const v = Number(localStorage.getItem(FONT_LS_KEY));
    return Number.isFinite(v) && v >= 80 && v <= 160 ? v : 110;
  });
  const [rate, setRate] = useState<number>(1);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [popChar, setPopChar] = useState<string | null>(null);
  const [favChars, setFavChars] = useState<Set<string>>(new Set());

  /* ── DC-FR-006：文章级收藏状态 ── */
  const [articleFav, setArticleFav] = useState(false);

  /* ── DC-FR-007：句子笔记弹窗 ── */
  const [noteTarget, setNoteTarget] = useState<{ sentenceId: string; zh: string } | null>(null);
  const [noteText, setNoteText] = useState('');
  const [noteSaving, setNoteSaving] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(PINYIN_LS_KEY, showPinyin ? '1' : '0');
    localStorage.setItem(TRANS_LS_KEY, showTrans ? '1' : '0');
    localStorage.setItem(FONT_LS_KEY, String(fontPct));
  }, [showPinyin, showTrans, fontPct]);

  /* 加载已收藏字符 + 文章收藏状态 */
  useEffect(() => {
    discover.favorites.list().then((r) => {
      const set = new Set<string>();
      let artFav = false;
      for (const f of r.items) {
        if (f.entity_type === 'char') set.add(f.entity_id);
        if (f.entity_type === 'article' && data?.article && f.entity_id === data.article.id) artFav = true;
      }
      setFavChars(set);
      setArticleFav(artFav);
    }).catch(() => undefined);
  }, [data?.article?.id]);

  /* ── DC-FR-005：阅读进度保存（5s 防抖） ── */
  const saveProgress = useMutation({
    mutationFn: (payload: { last_sentence_idx?: number; scroll_pct?: number; delta_seconds?: number; completed?: boolean }) =>
      discover.progress.save({ article_id: data!.article.id, ...payload }),
  });

  const startedAt = useRef<number>(Date.now());
  useEffect(() => {
    if (!data?.article) return;
    startedAt.current = Date.now();
    const id = setInterval(() => {
      const delta = Math.round((Date.now() - startedAt.current) / 1000);
      if (delta < 3) return;
      startedAt.current = Date.now();
      const scroll =
        document.documentElement.scrollHeight > 0
          ? Math.min(
              100,
              Math.round(
                ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100,
              ),
            )
          : 0;
      saveProgress.mutate({
        last_sentence_idx: activeIdx ?? undefined,
        scroll_pct: scroll,
        delta_seconds: delta,
        completed: scroll >= 95,
      });
    }, 5_000);
    return () => clearInterval(id);
  }, [data?.article, activeIdx, saveProgress]);

  /* ── DC-FR-005：自动滚动恢复 ── */
  const scrollRestored = useRef(false);
  useEffect(() => {
    if (!data?.progress || scrollRestored.current) return;
    scrollRestored.current = true;
    const pct = data.progress.scroll_pct;
    if (pct && pct > 5 && pct < 95) {
      requestAnimationFrame(() => {
        const target = (document.documentElement.scrollHeight * pct) / 100;
        window.scrollTo({ top: target, behavior: 'smooth' });
      });
    }
  }, [data?.progress]);

  /* ── 评分 DC-FR-008 ── */
  const rateMutation = useMutation({
    mutationFn: (score: number) => discover.rate(slug, score),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['discover', 'article', slug] }),
  });

  /* ── TTS：全文播放 ── */
  const playAll = useCallback(async () => {
    if (!data) return;
    for (let i = 0; i < data.sentences.length; i++) {
      setActiveIdx(i);
      const s = data.sentences[i];
      if (!s) continue;
      await new Promise<void>((resolve) => {
        if (!('speechSynthesis' in window)) { resolve(); return; }
        const u = new SpeechSynthesisUtterance(s.zh);
        u.lang = 'zh-CN';
        u.rate = rate;
        u.onend = () => resolve();
        u.onerror = () => resolve();
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(u);
      });
    }
    setActiveIdx(null);
  }, [data, rate]);

  const stopAll = useCallback(() => {
    if (typeof window === 'undefined') return;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setActiveIdx(null);
  }, []);

  /* ── 长按弹窗 ── */
  const longPressTimer = useRef<number | null>(null);
  const onCharPointerDown = useCallback((ch: string) => {
    if (longPressTimer.current) window.clearTimeout(longPressTimer.current);
    longPressTimer.current = window.setTimeout(() => setPopChar(ch), 350);
  }, []);
  const onCharPointerUp = useCallback(() => {
    if (longPressTimer.current) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  /* ── DC-FR-006：切换文章收藏 ── */
  const toggleArticleFav = useCallback(async () => {
    if (!data?.article) return;
    const id = data.article.id;
    if (articleFav) {
      setArticleFav(false);
      await discover.favorites.remove('article', id).catch(() => setArticleFav(true));
    } else {
      setArticleFav(true);
      await discover.favorites.add('article', id).catch(() => setArticleFav(false));
    }
  }, [data?.article, articleFav]);

  /* ── DC-FR-007：保存句子笔记 ── */
  const saveNote = useCallback(async () => {
    if (!noteTarget || !noteText.trim()) return;
    setNoteSaving(true);
    try {
      await discover.notes.create('sentence', noteTarget.sentenceId, noteText.trim().slice(0, 500));
      setNoteTarget(null);
      setNoteText('');
    } catch { /* ignore */ }
    setNoteSaving(false);
  }, [noteTarget, noteText]);

  const article = data?.article;
  const title = useMemo(() => (article ? pickI18n(article.i18n_title, lng) : ''), [article, lng]);
  const summary = useMemo(() => (article ? pickI18n(article.i18n_summary, lng) : ''), [article, lng]);

  if (isLoading) {
    return (
      <div className="py-8 text-center text-text-tertiary" data-testid="reader-loading">
        加载中...
      </div>
    );
  }
  if (isError || !data) {
    return (
      <div className="py-8 text-center" data-testid="reader-error">
        <p className="text-text-secondary text-body-lg">文章未找到</p>
        <Button variant="ghost" asChild className="mt-4">
          <Link to="/">← 返回首页</Link>
        </Button>
      </div>
    );
  }

  const relatedArticles = (relatedData?.items ?? []).slice(0, 4);

  return (
    <div className="mx-auto max-w-3xl pb-24" data-testid="reader-page">
      {/* 返回 + 收藏 */}
      <div className="mb-4 flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/">← 返回</Link>
        </Button>
        <button
          type="button"
          onClick={() => void toggleArticleFav()}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-small font-medium transition-colors ${
            articleFav
              ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400'
              : 'bg-bg-surface text-text-secondary border border-border-default hover:text-rose-600'
          }`}
          data-testid="article-fav"
        >
          <HeartIcon filled={articleFav} />
          {articleFav ? '已收藏' : '收藏'}
        </button>
      </div>

      {/* ── 文章头部 DC-FR-003 ── */}
      <header className="mb-6">
        <HStack gap={2} className="mb-3 flex-wrap">
          <Badge tone="rose" variant="soft">{`HSK ${article!.hsk_level}`}</Badge>
          <Badge tone="amber" variant="soft">{`${article!.estimated_minutes} min`}</Badge>
          {article!.category_name && (
            <Badge tone="sky" variant="soft">{article!.category_name}</Badge>
          )}
        </HStack>
        <h1 className="text-h2 text-text-primary">{title}</h1>
        <p className="mt-2 text-body-lg text-text-secondary">{summary}</p>
        <div className="mt-3 flex items-center gap-4">
          <RatingStars
            value={Number(article!.rating_avg)}
            count={article!.rating_count}
            size="md"
          />
          <span className="text-micro text-text-tertiary">您的评分:</span>
          <RatingStars
            value={data.rating_mine ?? 0}
            size="sm"
            onRate={(s) => rateMutation.mutate(s)}
          />
        </div>
      </header>

      {/* ── 工具栏 ── */}
      <Card className="glass-card sticky top-16 z-20 mb-4" data-testid="reader-toolbar">
        <HStack gap={3} className="flex-wrap">
          <Button
            variant={showPinyin ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setShowPinyin((v) => !v)}
            data-testid="toggle-pinyin"
          >拼音</Button>
          <Button
            variant={showTrans ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setShowTrans((v) => !v)}
            data-testid="toggle-trans"
          >翻译</Button>
          <div className="flex items-center gap-2">
            <span className="text-micro text-text-tertiary">字号</span>
            <input
              type="range"
              min={80}
              max={160}
              value={fontPct}
              onChange={(e) => setFontPct(Number(e.target.value))}
              className="w-20"
              data-testid="font-slider"
            />
            <span className="w-8 text-right text-micro text-text-tertiary">{fontPct}%</span>
          </div>
          <div className="flex items-center gap-1">
            {[0.75, 1, 1.25].map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => setRate(r)}
                className={`rounded-lg px-2 py-1 text-micro font-medium transition-colors ${
                  rate === r
                    ? 'bg-rose-600 text-white'
                    : 'bg-bg-surface text-text-secondary border border-border-default'
                }`}
                data-testid={`rate-${r}`}
              >{`${r}x`}</button>
            ))}
          </div>
          <Button size="sm" onClick={() => void playAll()} data-testid="play-all">▶ 全文播放</Button>
          <Button size="sm" variant="ghost" onClick={stopAll} data-testid="stop-all">■ 停止</Button>
        </HStack>
      </Card>

      {/* ── 句子列表 DC-FR-003 + DC-FR-004 ── */}
      <VStack gap={3}>
        {data.sentences.map((s, i) => (
          <div
            key={s.id}
            className={`rounded-xl border p-4 transition cursor-pointer ${
              activeIdx === i
                ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20'
                : 'border-border-default bg-bg-surface'
            }`}
            onClick={() => { setActiveIdx(i); speak(s.zh, rate, article!.audio_voice); }}
            data-testid={`sentence-${i}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                {showPinyin && s.pinyin && (
                  <div className="text-pinyin-base text-text-tertiary mb-1">{s.pinyin}</div>
                )}
                <div
                  className="leading-loose text-text-primary text-zh-base"
                  style={{ fontSize: `${fontPct}%` }}
                >
                  {Array.from(s.zh).map((ch, idx) =>
                    isHanChar(ch) ? (
                      <span
                        key={idx}
                        className="cursor-pointer rounded px-0.5 hover:bg-amber-100 dark:hover:bg-amber-900/30"
                        onDoubleClick={(e) => { e.stopPropagation(); setPopChar(ch); }}
                        onPointerDown={(e) => { e.stopPropagation(); onCharPointerDown(ch); }}
                        onPointerUp={onCharPointerUp}
                        onPointerLeave={onCharPointerUp}
                        data-testid={`han-${i}-${idx}`}
                      >{ch}</span>
                    ) : (
                      <span key={idx}>{ch}</span>
                    ),
                  )}
                </div>
                {showTrans && (
                  <div className="mt-2 text-small text-text-secondary italic">
                    {pickI18n(s.i18n_translation, lng)}
                  </div>
                )}
              </div>
              {/* 句子操作按钮 DC-FR-007 */}
              <div className="flex flex-col gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setActiveIdx(i); speak(s.zh, rate, article!.audio_voice); }}
                  className="rounded-lg bg-rose-500/10 px-2.5 py-1 text-micro text-rose-600 dark:text-rose-400 hover:bg-rose-500/20"
                  data-testid={`play-${i}`}
                >▶</button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setNoteTarget({ sentenceId: String(s.id), zh: s.zh }); }}
                  className="rounded-lg bg-sky-500/10 px-2.5 py-1 text-micro text-sky-600 dark:text-sky-400 hover:bg-sky-500/20"
                  data-testid={`note-${i}`}
                  title="添加笔记"
                ><NoteIcon /></button>
              </div>
            </div>
          </div>
        ))}
      </VStack>

      {/* ── 关键点卡片 DC-FR-003 ── */}
      {data.article.key_points && data.article.key_points.length > 0 && (
        <Card className="mt-6" data-testid="key-points">
          <h3 className="text-title font-semibold mb-3">Key Points</h3>
          <ul className="space-y-2">
            {data.article.key_points.map((kp: string, i: number) => (
              <li key={i} className="flex gap-2 text-body text-text-secondary">
                <span className="text-rose-600 shrink-0">•</span>
                <span>{kp}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* ── 评分区 DC-FR-008 ── */}
      <Card className="mt-6 text-center" data-testid="rate-section">
        <p className="text-body-lg text-text-primary mb-3">这篇文章对你有帮助吗？</p>
        <RatingStars
          value={data.rating_mine ?? 0}
          size="lg"
          onRate={(s) => rateMutation.mutate(s)}
        />
      </Card>

      {/* ── 末尾 CTA DC-FR-003 ── */}
      <Card className="mt-6 bg-gradient-to-r from-rose-50 to-amber-50 dark:from-rose-950/20 dark:to-amber-950/20" data-testid="cta-courses">
        <VStack gap={3} className="items-center text-center">
          <h3 className="text-title font-semibold">想系统学中文？</h3>
          <p className="text-body text-text-secondary">从零基础到 HSK6，4 条赛道为你量身定制。</p>
          <Button asChild>
            <Link to="/learn">开始系统课程 →</Link>
          </Button>
        </VStack>
      </Card>

      {/* ── 相关推荐 DC-FR-012 ── */}
      {relatedArticles.length > 0 && (
        <section className="mt-8" data-testid="related-articles">
          <h3 className="text-title font-semibold mb-3">你可能还喜欢</h3>
          <div className="grid grid-cols-2 gap-3">
            {relatedArticles.map((ra: { slug: string; i18n_title?: Record<string, string>; hsk_level?: number }) => (
              <Link
                key={ra.slug}
                to="/discover/$slug"
                params={{ slug: ra.slug }}
                className="block"
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <Badge tone="rose" variant="soft" className="mb-2">{`HSK ${ra.hsk_level ?? '?'}`}</Badge>
                  <p className="text-body font-medium line-clamp-2">{pickI18n(ra.i18n_title, lng) || ra.slug}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── 句子笔记弹窗 DC-FR-007 ── */}
      {noteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setNoteTarget(null)}>
          <Card className="max-w-md w-full p-5" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <h3 className="text-title font-semibold mb-2">为句子添加笔记</h3>
            <p className="text-small text-text-secondary mb-3 line-clamp-2">{noteTarget.zh}</p>
            <textarea
              className="w-full rounded-lg border border-border-default bg-bg-surface px-3 py-2 text-body focus:outline-none focus:ring-2 focus:ring-rose-500/30"
              rows={4}
              maxLength={500}
              placeholder="写下你的笔记（最多 500 字）..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            />
            <div className="mt-1 text-right text-micro text-text-tertiary">{noteText.length}/500</div>
            <HStack gap={2} className="mt-3 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setNoteTarget(null)}>取消</Button>
              <Button size="sm" onClick={() => void saveNote()} disabled={noteSaving || !noteText.trim()}>
                {noteSaving ? '保存中...' : '保存'}
              </Button>
            </HStack>
          </Card>
        </div>
      )}

      {/* ── 字词弹窗 DC-FR-004 ── */}
      {popChar && (
        <CharPopover
          ch={popChar}
          lng={lng}
          isFavorite={favChars.has(popChar)}
          onClose={() => setPopChar(null)}
          onAddNote={async (ch) => {
            const body = window.prompt(`为「${ch}」添加笔记:`) ?? '';
            if (body.trim()) {
              await discover.notes.create('char', ch, body.trim()).catch(() => undefined);
            }
          }}
          onFavorite={async (ch) => {
            const has = favChars.has(ch);
            const next = new Set(favChars);
            if (has) {
              next.delete(ch);
              await discover.favorites.remove('char', ch).catch(() => undefined);
            } else {
              next.add(ch);
              await discover.favorites.add('char', ch).catch(() => undefined);
            }
            setFavChars(next);
          }}
          speak={(text) => speak(text, rate)}
        />
      )}
    </div>
  );
}
