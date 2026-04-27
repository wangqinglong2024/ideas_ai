import { useEffect, useState } from 'react';
import { Bookmark, Lock, Volume2 } from 'lucide-react';
import { Badge, Button, Card, SentenceCard } from '@zhiyu/ui';
import { getJson } from '../api';
import { categoryMotifs } from '../data';
import { Paywall } from '../App';

type Article = { slug: string; title: string; category: string; hskLevel: number; estimatedMinutes: number; locked?: boolean; sentences?: Array<{ zh: string; pinyin: string; translation: string }> };

export function DiscoverPage({ navigate, loggedIn }: { navigate: (path: string) => void; loggedIn: boolean }) {
  return <section className="page stack discover-page">
    <div className="hero-book"><Badge>Ink Porcelain Glass</Badge><h1>发现中国</h1><p>12 categories, sentence-level pinyin, translations and audio-ready reading.</p></div>
    <div className="category-grid">{categoryMotifs.map((item) => <button className="category-tile glass-porcelain" key={item.slug} onClick={() => navigate(`/discover/${item.slug}`)}><span className="seal small">{item.title.slice(0, 1)}</span><strong>{item.title}</strong><small>{item.motif}</small>{!item.public && !loggedIn ? <Badge tone="warning">Login</Badge> : <Badge tone="success">Ready</Badge>}</button>)}</div>
    <Card className="novel-entry"><h2>Novel preview</h2><p>Anonymous readers can preview first chapters; login unlocks all current novels.</p><Button variant="secondary" onClick={() => navigate('/profile')}>Open reading profile</Button></Card>
  </section>;
}

export function CategoryPage({ route, loggedIn, navigate }: { route: string; loggedIn: boolean; navigate: (path: string) => void }) {
  const slug = route.split('/')[2] ?? 'history';
  const category = categoryMotifs.find((item) => item.slug === slug) ?? { slug: 'history', title: '中国历史', motif: '碑拓线条、松烟墨', public: true };
  const [articles, setArticles] = useState<Article[]>([]);
  useEffect(() => { getJson<Article[]>(`/api/v1/discover/categories/${slug}/articles`).then((data) => setArticles(data ?? [])); }, [slug]);
  const locked = !category.public && !loggedIn;
  return <section className="page stack"><div className="reading-cover"><Badge>{category.motif}</Badge><h1>{category.title}</h1><p>{category.public ? 'Anonymous readable category' : 'Login required for full text'}</p></div>{locked ? <Paywall onLogin={() => navigate('/auth/login')} /> : null}<div className="article-list">{articles.map((article) => <Card key={article.slug} variant="interactive"><div className="row between"><div><h3>{article.title}</h3><p>HSK {article.hskLevel} · {article.estimatedMinutes} min</p></div>{locked ? <Lock size={20} /> : <Button onClick={() => navigate(`/discover/${slug}/${article.slug}`)}>Read</Button>}</div></Card>)}</div></section>;
}

export function ArticlePage({ route, loggedIn, navigate }: { route: string; loggedIn: boolean; navigate: (path: string) => void }) {
  const slug = route.split('/')[3] ?? '';
  const [article, setArticle] = useState<Article | null>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setLoaded(false); getJson<Article>(`/api/v1/discover/articles/${slug}`).then((data) => { setArticle(data); setLoaded(true); }); }, [slug]);
  if (!loaded) return <section className="page"><Card>Loading article...</Card></section>;
  if (!article) return <section className="page stack"><Card><h1>Article not found</h1><p>The requested reading item is not available.</p><Button onClick={() => navigate('/discover')}>Back to Discover</Button></Card></section>;
  if (article.locked) return <section className="page stack"><div className="reading-cover"><Badge>Protected</Badge><h1>{article.title}</h1></div><Paywall onLogin={() => navigate('/auth/login')} /></section>;
  return <article className="page stack article-page"><div className="reading-cover"><Badge>HSK {article.hskLevel}</Badge><h1>{article.title}</h1><p>{article.estimatedMinutes} min · Sentence-level Chinese learning</p><div className="row"><Button variant="secondary"><Volume2 size={18} />Audio</Button><Button variant="ghost"><Bookmark size={18} />Save</Button></div></div><div className="sentence-list">{article.sentences?.map((sentence, index) => <SentenceCard key={index} {...sentence} />)}</div><Card><h2>Cross-module paths</h2><p>Continue with system courses, matching games, novels, or related Discover China categories.</p></Card></article>;
}