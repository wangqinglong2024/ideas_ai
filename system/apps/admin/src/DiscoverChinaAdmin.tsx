import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Copy, FileUp, History, Lock, Plus, Search, ShieldAlert, SplitSquareHorizontal } from 'lucide-react';
import { Badge, Button, Card, DataTable, Input, Select, TextArea, Toast } from '@zhiyu/ui';
import { adminRequest } from './api';

type Row = Record<string, unknown>;
type Category = { slug: string; nameZh: string; public: boolean; articleCount: number; motif: string; sourceDoc: string; contentBoundary: string; status: string };
type Sentence = { id: string; sequenceNumber: number; zh: string; pinyin: string; pinyinTones: string; translations: Record<string, string> };
type Article = { id: string; slug: string; titleZh: string; categorySlug: string; status: string; hskLevel: number; length: string; sentences: Sentence[]; keyPoints?: Record<string, string[]>; updatedAt: string };

export function DiscoverChinaAdmin() {
  const [rows, setRows] = useState<Row[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [article, setArticle] = useState<Article | null>(null);
  const [access, setAccess] = useState<Row>({});
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');
  const filtered = useMemo(() => rows.filter((row) => JSON.stringify(row).toLowerCase().includes(query.toLowerCase())), [rows, query]);

  function refresh() {
    adminRequest<Row[]>('/admin/api/content/articles').then((result) => { const next = result.data ?? []; setRows(next); if (!selectedId && next[0]?.id) setSelectedId(String(next[0].id)); });
    adminRequest<Category[]>('/admin/api/content/articles/categories').then((result) => setCategories(result.data ?? []));
    adminRequest<Row>('/admin/api/content/articles/access-model').then((result) => setAccess(result.data ?? {}));
  }
  useEffect(refresh, []);
  useEffect(() => { if (selectedId) adminRequest<Article>(`/admin/api/content/articles/${selectedId}`).then((result) => setArticle(result.data)); }, [selectedId]);

  async function createArticle() {
    const categorySlug = categories[0]?.slug ?? 'history';
    const result = await adminRequest<Article>('/admin/api/content/articles', { method: 'POST', body: JSON.stringify({ categorySlug, titleZh: '新发现中国文章', slug: `new-discover-${Date.now()}` }) });
    setMessage(result.error?.message ?? 'Article created and audited');
    refresh();
    if (result.data?.id) setSelectedId(result.data.id);
  }
  async function updateArticle(patch: Row) {
    if (!article) return;
    const result = await adminRequest<Article>(`/admin/api/content/articles/${article.id}`, { method: 'PATCH', body: JSON.stringify(patch) });
    setArticle(result.data ?? article);
    setMessage(result.error?.message ?? 'Article saved and versioned');
    refresh();
  }
  async function addSentence() {
    if (!article) return;
    const result = await adminRequest<Sentence>(`/admin/api/content/articles/${article.id}/sentences`, { method: 'POST', body: JSON.stringify({ zh: '这是一句新的发现中国内容。', pinyin: 'zhe shi yi ju xin de nei rong', pinyinTones: 'zhe4 shi4 yi1 ju4 xin1 de nei4 rong2', translations: { en: 'This is a new Discover China sentence.', vi: 'This is a new Discover China sentence.', th: 'This is a new Discover China sentence.', id: 'This is a new Discover China sentence.' } }) });
    setMessage(result.error?.message ?? 'Sentence added and audited');
    if (article) adminRequest<Article>(`/admin/api/content/articles/${article.id}`).then((next) => setArticle(next.data));
  }
  async function runAction(action: string) {
    if (!article) return;
    const result = await adminRequest<Row>(`/admin/api/content/articles/${article.id}/${action}`, { method: 'POST', body: JSON.stringify({ reason: 'manual admin action' }) });
    setMessage(result.error?.message ?? `${action} done and audited`);
    refresh();
    adminRequest<Article>(`/admin/api/content/articles/${article.id}`).then((next) => setArticle(next.data ?? article));
  }
  async function redline() {
    if (!article) return;
    const result = await adminRequest<Row>(`/admin/api/content/articles/${article.id}/redline`, { method: 'POST' });
    setMessage(result.error?.message ?? `Redline passed: ${String(result.data?.passed)}`);
  }
  async function importSeed() {
    const result = await adminRequest<Row>('/admin/api/content/articles/import', { method: 'POST', body: JSON.stringify({ $schema_version: '1.0', module: 'discover-china', items: rows.slice(0, 3) }) });
    setMessage(result.error?.message ?? `Import validated: ${String(result.data?.imported ?? 0)} items`);
  }

  return <section className="admin-page stack discover-admin-page">
    <div className="admin-section-head"><div><Badge>AD-FR-006</Badge><h2>Discover China content workbench</h2><p>12 categories, article and sentence CRUD, redline, preview, publish, version, import and access-model visibility.</p></div><div className="row"><Button onClick={createArticle}><Plus size={16} />New article</Button><Button variant="secondary" onClick={importSeed}><FileUp size={16} />Import JSON</Button></div></div>
    <div className="access-grid"><Card><h3>Access model</h3><p><Lock size={16} /> Anonymous: {String((access.anonymousOpenCategories as string[] | undefined)?.join(', ') ?? 'history,cuisine,scenic')}</p><p>Login unlocks all: {String(access.loginUnlocksAll ?? true)}</p></Card><Card><h3>W0 gate</h3><p>Dev seed: {rows.length} / 36 articles. W0 gate remains 600 and is reported in audit.</p></Card><Card><h3>Review queue</h3><p>Native language review uses `/admin/content/review` and audit logs.</p></Card></div>
    <div className="category-admin-grid">{categories.map((category) => <Card key={category.slug} variant="porcelain"><div className="row between"><strong>{category.nameZh}</strong>{category.public ? <Badge tone="success">Anonymous</Badge> : <Badge tone="warning">Login</Badge>}</div><small>{category.sourceDoc}</small><p>{category.contentBoundary}</p></Card>)}</div>
    <div className="admin-split"><Card><div className="filterbar"><Input label="Search" value={query} onChange={(event) => setQuery(event.currentTarget.value)} /><Button variant="secondary"><Search size={16} />Filter</Button></div><DataTable rows={filtered} columns={['title', 'category', 'status', 'hskLevel', 'sentences', 'access']} /><div className="row article-picks">{filtered.slice(0, 8).map((row) => <button key={String(row.id)} aria-current={selectedId === row.id ? 'true' : undefined} onClick={() => setSelectedId(String(row.id))}>{String(row.title)}</button>)}</div></Card><EditorPanel article={article} categories={categories} updateArticle={updateArticle} addSentence={addSentence} runAction={runAction} redline={redline} /></div>
    {message ? <Toast type="info">{message}</Toast> : null}
  </section>;
}

function EditorPanel({ article, categories, updateArticle, addSentence, runAction, redline }: { article: Article | null; categories: Category[]; updateArticle: (patch: Row) => void; addSentence: () => void; runAction: (action: string) => void; redline: () => void }) {
  const [title, setTitle] = useState('');
  const [categorySlug, setCategorySlug] = useState('history');
  const [status, setStatus] = useState('draft');
  useEffect(() => { setTitle(article?.titleZh ?? ''); setCategorySlug(article?.categorySlug ?? 'history'); setStatus(article?.status ?? 'draft'); }, [article?.id]);
  if (!article) return <Card><h3>Select an article</h3><p>Choose a row to edit article metadata, sentences, review state and publishing actions.</p></Card>;
  return <Card className="article-editor"><div className="row between"><div><Badge>{status}</Badge><h3>{article.titleZh}</h3></div><Button variant="secondary" onClick={() => updateArticle({ titleZh: title, categorySlug, status })}>Save draft</Button></div><Input label="Title zh" value={title} onChange={(event) => setTitle(event.currentTarget.value)} /><Select label="Category" value={categorySlug} onChange={(event) => setCategorySlug(event.currentTarget.value)}>{categories.map((category) => <option key={category.slug} value={category.slug}>{category.nameZh}</option>)}</Select><Select label="Status" value={status} onChange={(event) => setStatus(event.currentTarget.value)}><option value="draft">draft</option><option value="review">review</option><option value="published">published</option><option value="archived">archived</option></Select><div className="admin-action-grid"><Button variant="secondary" onClick={() => runAction('preview')}><SplitSquareHorizontal size={16} />Preview</Button><Button variant="secondary" onClick={() => runAction('version')}><History size={16} />Version</Button><Button variant="secondary" onClick={() => runAction('copy')}><Copy size={16} />Copy</Button><Button variant="secondary" onClick={redline}><ShieldAlert size={16} />Redline</Button><Button onClick={() => runAction('publish')}><CheckCircle2 size={16} />Publish</Button><Button variant="danger" onClick={() => runAction('withdraw')}>Withdraw</Button></div><div className="row between"><h3>Sentence editor</h3><Button variant="secondary" onClick={addSentence}><Plus size={16} />Add sentence</Button></div><div className="sentence-admin-list">{article.sentences.map((sentence) => <SentenceEdit key={sentence.id} articleId={article.id} sentence={sentence} />)}</div></Card>;
}

function SentenceEdit({ articleId, sentence }: { articleId: string; sentence: Sentence }) {
  const [zh, setZh] = useState(sentence.zh);
  const [translation, setTranslation] = useState(sentence.translations.en ?? '');
  const [message, setMessage] = useState('');
  async function save() {
    const result = await adminRequest<Sentence>(`/admin/api/content/articles/${articleId}/sentences/${sentence.id}`, { method: 'PATCH', body: JSON.stringify({ zh, translations: { ...sentence.translations, en: translation } }) });
    setMessage(result.error?.message ?? 'Sentence saved and audited');
  }
  return <div className="sentence-edit"><TextArea label={`Sentence ${sentence.sequenceNumber}`} value={zh} onChange={(event) => setZh(event.currentTarget.value)} /><TextArea label="EN translation" value={translation} onChange={(event) => setTranslation(event.currentTarget.value)} /><Button size="sm" variant="secondary" onClick={save}>Save sentence</Button>{message ? <small>{message}</small> : null}</div>;
}

