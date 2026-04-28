import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button, Input, Modal, Select, Tabs, Textarea, useToast } from '@zhiyu/ui-kit';
import { adminApi } from '../../../lib/http.ts';
import type { AdminCategory, I18nMap, Locale } from '../../../lib/types.ts';
import { LOCALES, LOCALE_LABELS } from '../../../lib/types.ts';

type Props = {
  open: boolean;
  initialCategoryCode?: string;
  onClose: () => void;
  onCreated: (article: { id: string; code: string }) => void;
};

const empty: I18nMap = { zh: '', en: '', vi: '', th: '', id: '' };

export function NewArticleModal({ open, initialCategoryCode, onClose, onCreated }: Props) {
  const toast = useToast();
  const cats = useQuery({
    queryKey: ['admin-china-categories'],
    queryFn: () => adminApi<{ items: AdminCategory[] }>('/china/categories'),
    enabled: open,
  });
  const [categoryId, setCategoryId] = useState<string>('');
  const [titlePinyin, setTitlePinyin] = useState('');
  const [title, setTitle] = useState<I18nMap>({ ...empty });
  const [tab, setTab] = useState<Locale>('zh');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setTitlePinyin(''); setTitle({ ...empty }); setTab('zh'); setErr(null); setBusy(false);
    if (cats.data && initialCategoryCode) {
      const c = cats.data.items.find((x) => x.code === initialCategoryCode);
      if (c) setCategoryId(c.id);
    }
  }, [open, cats.data, initialCategoryCode]);

  const errorTabs = useMemo(() => {
    const errs = new Set<Locale>();
    for (const lng of LOCALES) {
      if (!title[lng].trim()) errs.add(lng);
      else if (title[lng].length > 100) errs.add(lng);
    }
    return errs;
  }, [title]);

  const isValid = !!categoryId && titlePinyin.trim() && titlePinyin.length <= 200 && errorTabs.size === 0;

  async function submit() {
    if (!isValid || busy) return;
    setBusy(true); setErr(null);
    try {
      const data = await adminApi<{ id: string; code: string }>('/china/articles', {
        method: 'POST',
        body: JSON.stringify({ category_id: categoryId, title_pinyin: titlePinyin.trim(), title_i18n: title }),
      });
      toast.success('创建成功');
      onCreated(data);
    } catch (e) {
      setErr((e as Error).message || '创建失败');
    } finally { setBusy(false); }
  }

  return (
    <Modal
      open={open}
      onClose={busy ? () => undefined : onClose}
      width={640}
      title="新建文章"
      testId="new-article-modal"
      footer={<>
        <Button variant="ghost" onClick={onClose} disabled={busy} data-testid="new-article-cancel">取消</Button>
        <Button onClick={submit} disabled={!isValid || busy} data-testid="new-article-submit">{busy ? '保存中…' : '保存'}</Button>
      </>}
    >
      <div style={{ display: 'grid', gap: 14 }}>
        <div className="zy-field">
          <label className="zy-label"><span className="zy-required">*</span>类目</label>
          <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} data-testid="new-article-category">
            <option value="">请选择类目</option>
            {cats.data?.items.slice().sort((a, b) => a.sort_order - b.sort_order).map((c) => (
              <option key={c.id} value={c.id}>#{c.code} {c.name_i18n.zh}</option>
            ))}
          </Select>
        </div>
        <div className="zy-field">
          <label className="zy-label"><span className="zy-required">*</span>标题拼音</label>
          <Input
            data-testid="new-article-pinyin"
            value={titlePinyin}
            onChange={(e) => setTitlePinyin(e.target.value)}
            maxLength={200}
            placeholder="例如：Cháng Chéng"
          />
          <div className="zy-helper">{titlePinyin.length}/200</div>
        </div>
        <div className="zy-field">
          <label className="zy-label"><span className="zy-required">*</span>标题（5 语言必填）</label>
          <Tabs
            items={LOCALES.map((l) => ({ key: l, label: LOCALE_LABELS[l], flag: errorTabs.has(l) ? 'error' : undefined }))}
            active={tab}
            onChange={(k) => setTab(k as Locale)}
            testIdPrefix="lang-tab"
          />
          <Input
            data-testid={`new-article-title-${tab}`}
            value={title[tab]}
            onChange={(e) => setTitle({ ...title, [tab]: e.target.value })}
            maxLength={100}
            placeholder={`请输入${LOCALE_LABELS[tab]}标题`}
          />
          <div className="zy-helper">{title[tab].length}/100</div>
        </div>
        {err && <p className="zy-error-text" data-testid="new-article-error">{err}</p>}
        <p style={{ margin: 0, color: 'var(--zy-fg-soft)', fontSize: 12 }}>保存后将进入编辑页继续添加正文句子。</p>
      </div>
    </Modal>
  );
}
