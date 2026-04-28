import { useEffect, useMemo, useState } from 'react';
import { Button, Drawer, Tabs, Textarea, useToast } from '@zhiyu/ui-kit';
import { adminApi } from '../../../lib/http.ts';
import type { I18nMap, Locale } from '../../../lib/types.ts';
import { LOCALES, LOCALE_LABELS } from '../../../lib/types.ts';

type Position =
  | { mode: 'append' }
  | { mode: 'prepend' }
  | { mode: 'after'; afterSeqNo: number };

type Props = {
  open: boolean;
  articleId: string;
  position: Position;
  onClose: () => void;
  onCreated: () => void;
};

const empty: I18nMap = { zh: '', en: '', vi: '', th: '', id: '' };

export function SentenceCreateDrawer({ open, articleId, position, onClose, onCreated }: Props) {
  const toast = useToast();
  const [pinyin, setPinyin] = useState('');
  const [content, setContent] = useState<I18nMap>({ ...empty });
  const [tab, setTab] = useState<Locale>('zh');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => { if (!open) return;
    setPinyin(''); setContent({ ...empty }); setTab('zh'); setErr(null); setBusy(false);
  }, [open]);

  const errorTabs = useMemo(() => {
    const errs = new Set<Locale>();
    for (const lng of LOCALES) {
      const v = content[lng];
      if (!v.trim()) errs.add(lng);
      else if (v.length > 500) errs.add(lng);
    }
    return errs;
  }, [content]);

  const isValid = pinyin.trim() && pinyin.length <= 1000 && errorTabs.size === 0;

  async function submit() {
    if (!isValid) return;
    setBusy(true); setErr(null);
    try {
      const body = {
        article_id: articleId,
        pinyin: pinyin.trim(),
        content_zh: content.zh, content_en: content.en, content_vi: content.vi, content_th: content.th, content_id: content.id,
      };
      if (position.mode === 'append') {
        await adminApi('/china/sentences', { method: 'POST', body: JSON.stringify(body) });
      } else if (position.mode === 'prepend') {
        await adminApi('/china/sentences/insert', { method: 'POST', body: JSON.stringify({ ...body, position: 'first' }) });
      } else {
        await adminApi('/china/sentences/insert', { method: 'POST', body: JSON.stringify({ ...body, after_seq_no: position.afterSeqNo }) });
      }
      toast.success('已添加');
      onCreated();
    } catch (e) { setErr((e as Error).message); }
    finally { setBusy(false); }
  }

  const titleText =
    position.mode === 'append' ? '在结尾添加句子' :
    position.mode === 'prepend' ? '在开头添加句子' :
    `在第 ${position.afterSeqNo} 句后插入`;

  return (
    <Drawer
      open={open}
      onClose={busy ? () => undefined : onClose}
      side="right"
      width={520}
      title={titleText}
      testId="sentence-create-drawer"
      footer={<>
        <Button variant="ghost" onClick={onClose} disabled={busy} data-testid="sentence-create-cancel">取消</Button>
        <Button onClick={submit} disabled={!isValid || busy} data-testid="sentence-create-submit">{busy ? '添加中…' : '添加'}</Button>
      </>}
    >
      <div style={{ display: 'grid', gap: 14 }}>
        <div className="zy-field">
          <label className="zy-label"><span className="zy-required">*</span>拼音</label>
          <Textarea data-testid="sc-pinyin" rows={2} value={pinyin} onChange={(e) => setPinyin(e.target.value)} maxLength={1000} />
          <div className="zy-helper">{pinyin.length}/1000</div>
        </div>
        <div className="zy-field">
          <label className="zy-label"><span className="zy-required">*</span>内容（5 语言必填）</label>
          <Tabs
            items={LOCALES.map((l) => ({ key: l, label: LOCALE_LABELS[l], flag: errorTabs.has(l) ? 'error' : undefined }))}
            active={tab}
            onChange={(k) => setTab(k as Locale)}
            testIdPrefix="sc-tab"
          />
          <Textarea
            data-testid={`sc-content-${tab}`}
            value={content[tab]}
            onChange={(e) => setContent({ ...content, [tab]: e.target.value })}
            rows={5}
            maxLength={500}
          />
          <div className="zy-helper">{content[tab].length}/500</div>
        </div>
        {err && <p className="zy-error-text" data-testid="sentence-create-error">{err}</p>}
      </div>
    </Drawer>
  );
}
