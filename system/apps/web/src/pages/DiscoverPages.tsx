import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Bookmark, Lock, Search, Share2, Sparkles, Star, Volume2 } from 'lucide-react';
import { Badge, Button, Card, EmptyState, SearchInput, Select, SentenceCard, Toast } from '@zhiyu/ui';
import { localizedText, t, type Locale } from '@zhiyu/i18n';
import { api, getJson } from '../api';
import { Paywall } from '../App';

type Localized = Partial<Record<Locale, string>>;
type Category = { id: string; slug: string; nameZh: string; nameTranslations: Localized; description: Localized; motif: string; public: boolean; locked?: boolean; articleCount: number; readCount?: number; recentTitles: string[]; themeColor: string; contentBoundary?: string };
type Sentence = { id: string; sequenceNumber: number; zh: string; pinyin: string; pinyinTones?: string; translations: Localized; audio?: { default?: { url: string; durationMs: number } }; keyPoint?: Localized };
type Article = { id: string; slug: string; categorySlug: string; titleZh: string; titleTranslations: Localized; summary: Localized; hskLevel: number; wordCount: number; readingMinutes: number; length: 'short' | 'medium' | 'long'; ratingAvg: number; ratingCount: number; favoriteCount: number; sentences?: Sentence[]; keyPoints?: Record<Locale, string[]>; progress?: { lastSentenceId?: string | null; progressPct?: number; isCompleted?: boolean } | null; favorite?: boolean; userRating?: number | null; highlight?: string | null };
type Preferences = { pinyinMode: 'letters' | 'tones' | 'hidden'; translationMode: 'inline' | 'collapse' | 'hidden'; fontSize: 'S' | 'M' | 'L' | 'XL'; ttsSpeed: number };

const defaultPrefs: Preferences = { pinyinMode: 'tones', translationMode: 'inline', fontSize: 'M', ttsSpeed: 1 };
const fontClass: Record<Preferences['fontSize'], string> = { S: 'reader-small', M: 'reader-medium', L: 'reader-large', XL: 'reader-xl' };

function readPrefs(): Preferences {
  try { return { ...defaultPrefs, ...JSON.parse(localStorage.getItem('zhiyu.preferences') ?? '{}') }; }
  catch { return defaultPrefs; }
}

function titleFor(article: Article, locale: Locale) {
  return localizedText(article.titleTranslations, locale, article.titleZh);
}

function categoryTitle(category: Category, locale: Locale) {
  return localizedText(category.nameTranslations, locale, category.nameZh);
}

export function DiscoverPage({ locale, navigate, loggedIn }: { locale: Locale; navigate: (path: string) => void; loggedIn: boolean }) {
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => { getJson<Category[]>(`/api/v1/discover/categories?locale=${locale}`).then((data) => setCategories(data ?? [])); }, [locale, loggedIn]);
  const featured = categories.slice(0, 3);
  return <section className="page stack discover-page">
    <div className="hero-book hero-ink-flow"><Badge>Discover China</Badge><h1>发现中国</h1><p>{t(locale, 'unlockDiscover')}</p><div className="hero-actions"><Button onClick={() => navigate('/discover/history')}><Sparkles size={18} />Start reading</Button><Button variant="secondary" onClick={() => navigate('/discover/search')}><Search size={18} />{t(locale, 'search')}</Button></div></div>
    <div className="today-strip glass-porcelain"><strong>今日推荐</strong>{featured.map((item) => <button key={item.slug} onClick={() => navigate(`/discover/${item.slug}`)}>{categoryTitle(item, locale)}</button>)}</div>
    <div className="category-grid rich-grid">{categories.map((item, index) => <button className="category-tile glass-porcelain" style={{ '--tile-accent': item.themeColor } as CSSProperties} key={item.slug} onClick={() => navigate(`/discover/${item.slug}`)}><span className="seal small">{item.nameZh.slice(0, 1)}</span><strong>{categoryTitle(item, locale)}</strong><small>{item.motif}</small><span>{item.articleCount} articles · {item.readCount ?? 0} read</span>{item.locked ? <Badge tone="warning"><Lock size={12} />Login</Badge> : <Badge tone={index < 3 ? 'success' : 'info'}>{index < 3 ? 'Open' : 'Member'}</Badge>}</button>)}</div>
    <Card className="novel-entry" variant="porcelain"><h2>跨模块入口</h2><p>每篇文章末尾都会引导到系统课程、游戏、小说或相关发现中国类目。</p><Button variant="secondary" onClick={() => navigate('/courses')}>Open courses</Button></Card>
  </section>;
}

export function CategoryPage({ route, locale, loggedIn, navigate }: { route: string; locale: Locale; loggedIn: boolean; navigate: (path: string) => void }) {
  const slug = route.split('/')[2] ?? 'history';
  const [categories, setCategories] = useState<Category[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [length, setLength] = useState('all');
  const [sort, setSort] = useState('latest');
  const [locked, setLocked] = useState(false);
  const category = categories.find((item) => item.slug === slug);
  useEffect(() => { getJson<Category[]>(`/api/v1/discover/categories?locale=${locale}`).then((data) => setCategories(data ?? [])); }, [locale]);
  useEffect(() => {
    setLocked(false);
    api.request<Article[]>(`/api/v1/discover/categories/${slug}/articles?length=${length}&sort=${sort}&locale=${locale}`).then((result) => { setArticles(result.data ?? []); setLocked(result.error?.code === 'discover_category_login_required'); });
  }, [slug, length, sort, locale, loggedIn]);
  return <section className="page stack">
    <div className="reading-cover category-cover"><Badge>{category?.motif ?? 'Discover China'}</Badge><h1>{category ? categoryTitle(category, locale) : slug}</h1><p>{category?.contentBoundary ?? localizedText(category?.description, locale, '')}</p></div>
    {locked ? <Paywall onLogin={() => navigate('/auth/login')} /> : null}
    {!locked ? <div className="filterbar glass-porcelain"><Select label="Length" value={length} onChange={(event) => setLength(event.currentTarget.value)}><option value="all">All lengths</option><option value="short">Short</option><option value="medium">Medium</option><option value="long">Long</option></Select><Select label="Sort" value={sort} onChange={(event) => setSort(event.currentTarget.value)}><option value="latest">Latest</option><option value="popular">Popular</option></Select></div> : null}
    {!locked && articles.length === 0 ? <EmptyState title="No articles match these filters" /> : null}
    <div className="article-list">{articles.map((article) => <Card key={article.id} variant="interactive"><div className="row between"><div><h3>{titleFor(article, locale)}</h3><p>{localizedText(article.summary, locale)} · {article.readingMinutes} min</p></div><Button onClick={() => navigate(`/discover/${slug}/${article.slug}`)}>Read</Button></div></Card>)}</div>
  </section>;
}

export function ArticlePage({ route, locale, loggedIn, navigate }: { route: string; locale: Locale; loggedIn: boolean; navigate: (path: string) => void }) {
  const slug = route.split('/')[3] ?? '';
  const categorySlug = route.split('/')[2] ?? 'history';
  const [article, setArticle] = useState<Article | null>(null);
  const [locked, setLocked] = useState(false);
  const [prefs, setPrefs] = useState(readPrefs);
  const [activeSentence, setActiveSentence] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [favorite, setFavorite] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [noteSentence, setNoteSentence] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');
  const [related, setRelated] = useState<Article[]>([]);

  useEffect(() => {
    const refreshPrefs = () => setPrefs(readPrefs());
    window.addEventListener('storage', refreshPrefs);
    window.addEventListener('zhiyu-preferences', refreshPrefs);
    return () => { window.removeEventListener('storage', refreshPrefs); window.removeEventListener('zhiyu-preferences', refreshPrefs); };
  }, []);

  useEffect(() => {
    setArticle(null); setLocked(false);
    api.request<Article>(`/api/v1/discover/articles/${slug}?locale=${locale}`).then((result) => {
      setLocked(result.error?.code === 'discover_category_login_required');
      setArticle(result.data ?? null);
      setFavorite(Boolean(result.data?.favorite));
      setRating(result.data?.userRating ?? null);
      const saved = Number(localStorage.getItem(`zhiyu.progress.${slug}`) ?? result.data?.progress?.progressPct ?? 0);
      setProgress(Number.isFinite(saved) ? saved : 0);
    });
    api.request<Article[]>(`/api/v1/discover/categories/${categorySlug}/articles?limit=4&locale=${locale}&sort=popular`).then((result) => setRelated((result.data ?? []).filter((item) => item.slug !== slug).slice(0, 4)));
  }, [slug, categorySlug, locale, loggedIn]);

  useEffect(() => {
    if (!article || !progress) return;
    const handle = window.setTimeout(() => {
      localStorage.setItem(`zhiyu.progress.${article.slug}`, String(progress));
      if (loggedIn) api.request(`/api/v1/discover/articles/${article.id}/progress`, { method: 'POST', body: JSON.stringify({ progressPct: progress, lastSentenceId: activeSentence, isCompleted: progress >= 100, readingTimeDelta: 5 }) });
    }, 5000);
    return () => window.clearTimeout(handle);
  }, [article, progress, activeSentence, loggedIn]);

  const sentences = article?.sentences ?? [];
  const keyPoints = article?.keyPoints?.[locale] ?? article?.keyPoints?.en ?? [];
  const handleSentencePlay = (sentence: Sentence, index: number) => {
    setActiveSentence(sentence.id);
    setProgress(Math.round(((index + 1) / Math.max(1, sentences.length)) * 100));
    setMessage(`Audio placeholder · ${prefs.ttsSpeed}x · ${sentence.audio?.default?.url ?? 'seed://audio'}`);
  };
  async function toggleFavorite() {
    if (!article || !loggedIn) return navigate('/auth/login');
    const result = await api.request<{ favorite: boolean }>(`/api/v1/discover/articles/${article.id}/favorite`, { method: 'POST' });
    setFavorite(Boolean(result.data?.favorite));
    setMessage(result.error?.message ?? (result.data?.favorite ? 'Saved to favorites' : 'Removed from favorites'));
  }
  async function saveNote(sentenceId: string) {
    if (!loggedIn) return navigate('/auth/login');
    if (note.length > 500) return setMessage('Note must be 500 characters or less');
    const result = await api.request(`/api/v1/discover/sentences/${sentenceId}/note`, { method: 'POST', body: JSON.stringify({ content: note }) });
    setMessage(result.error?.message ?? 'Note saved');
    if (!result.error) { setNoteSentence(null); setNote(''); }
  }
  async function rate(next: number) {
    if (!article || !loggedIn) return navigate('/auth/login');
    const result = await api.request<{ rating: number }>(`/api/v1/discover/articles/${article.id}/rating`, { method: 'POST', body: JSON.stringify({ rating: next }) });
    setRating(result.data?.rating ?? null);
    setMessage(result.error?.message ?? 'Rating saved');
  }
  async function shareArticle() {
    if (!article || !loggedIn) return navigate('/auth/login');
    const result = await api.request<{ url: string; qr: string }>(`/api/v1/discover/articles/${article.id}/share-card`, { method: 'POST' });
    const text = `${titleFor(article, locale)} ${location.href}`;
    if (navigator.share) await navigator.share({ title: titleFor(article, locale), text, url: location.href }).catch(() => undefined);
    else await navigator.clipboard?.writeText(`${text}\n${result.data?.qr ?? ''}`);
    setMessage(result.error?.message ?? `Share card ready: ${result.data?.url}`);
  }

  if (locked) return <section className="page stack"><div className="reading-cover"><Badge>Protected</Badge><h1>{t(locale, 'unlockDiscover')}</h1></div><Paywall onLogin={() => navigate('/auth/login')} /></section>;
  if (!article) return <section className="page stack"><Card>Loading article...</Card></section>;
  return <article className={`page stack article-page ${fontClass[prefs.fontSize]}`}>
    <div className="reading-progress"><span style={{ width: `${progress}%` }} /></div>
    <div className="reading-cover article-cover"><Badge>Discover China</Badge><h1>{titleFor(article, locale)}</h1><p>{localizedText(article.summary, locale)} · {article.wordCount} words · {article.readingMinutes} min · {article.favoriteCount} saves</p><div className="row"><Button variant="secondary" onClick={() => sentences[0] ? handleSentencePlay(sentences[0], 0) : undefined}><Volume2 size={18} />Audio</Button><Button variant={favorite ? 'secondary' : 'ghost'} onClick={toggleFavorite}><Bookmark size={18} />{favorite ? 'Saved' : 'Save'}</Button><Button variant="ghost" onClick={shareArticle}><Share2 size={18} />Share</Button></div></div>
    <div className="sentence-list">{sentences.map((sentence, index) => <SentenceCard key={sentence.id} zh={sentence.zh} pinyin={sentence.pinyin} pinyinTones={sentence.pinyinTones} translation={localizedText(sentence.translations, locale)} keyPoint={localizedText(sentence.keyPoint, locale)} pinyinMode={prefs.pinyinMode} translationMode={prefs.translationMode} active={activeSentence === sentence.id} saved={favorite} noteOpen={noteSentence === sentence.id} noteValue={note} noteError={note.length > 500 ? '500 characters max' : undefined} onPlay={() => handleSentencePlay(sentence, index)} onSave={toggleFavorite} onCopy={() => navigator.clipboard?.writeText(sentence.zh)} onNoteOpen={() => setNoteSentence(noteSentence === sentence.id ? null : sentence.id)} onNoteChange={setNote} onNoteSubmit={() => saveNote(sentence.id)} />)}</div>
    <Card><h2>重点提示</h2>{keyPoints.map((point) => <p key={point}>{point}</p>)}</Card>
    <Card><h2>这篇文章对你有帮助吗？</h2><div className="rating-row">{[1, 2, 3, 4, 5].map((value) => <button key={value} aria-label={`${value} stars`} aria-pressed={rating === value} onClick={() => rate(value)}><Star size={22} fill={rating && value <= rating ? 'currentColor' : 'none'} /></button>)}</div></Card>
    <Card variant="porcelain"><h2>继续学习</h2><div className="cross-module-grid"><Button variant="secondary" onClick={() => navigate('/courses')}>系统课程</Button><Button variant="secondary" onClick={() => navigate('/games')}>游戏挑战</Button><Button variant="secondary" onClick={() => navigate('/discover/search')}>相关类目</Button></div></Card>
    <Card><h2>你可能还喜欢</h2><div className="article-list compact">{related.map((item) => <button key={item.id} onClick={() => navigate(`/discover/${item.categorySlug}/${item.slug}`)}>{titleFor(item, locale)}</button>)}</div></Card>
    {message ? <Toast type="info">{message}</Toast> : null}
  </article>;
}

export function DiscoverSearchPage({ locale, navigate }: { locale: Locale; navigate: (path: string) => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Article[]>([]);
  const [searched, setSearched] = useState(false);
  const highlighted = useMemo(() => query.trim().toLowerCase(), [query]);
  async function search() {
    const result = await api.request<Article[]>(`/api/v1/discover/search?q=${encodeURIComponent(query)}&locale=${locale}`);
    setResults(result.data ?? []);
    setSearched(true);
  }
  return <section className="page stack"><div className="reading-cover"><Badge>Postgres FTS</Badge><h1>{t(locale, 'search')}</h1><p>中文、母语标题、正文句子和关键点均参与搜索，结果遵守未登录类目门禁。</p></div><div className="search-panel glass-porcelain"><SearchInput label="Search Zhiyu" placeholder="饺子, Great Wall, pinyin" value={query} onChange={(event) => setQuery(event.currentTarget.value)} onKeyDown={(event) => { if (event.key === 'Enter') search(); }} /><Button onClick={search}><Search size={18} />Search</Button></div>{searched && results.length === 0 ? <EmptyState title="No results" /> : null}<div className="article-list">{results.map((article) => <Card key={article.id} variant="interactive"><h3>{titleFor(article, locale)}</h3><p>{localizedText(article.summary, locale)}{highlighted ? ` · match: ${highlighted}` : ''}</p><Button onClick={() => navigate(`/discover/${article.categorySlug}/${article.slug}`)}>Read</Button></Card>)}</div></section>;
}
