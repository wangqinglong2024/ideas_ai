import { useEffect, useState } from 'react';
import { Button, Drawer, useToast } from '@zhiyu/ui-kit';
import { adminApi } from '../../../lib/http.ts';
import type { AdminSentence } from '../../../lib/types.ts';

type Props = {
  open: boolean;
  articleId: string;
  sentences: AdminSentence[];
  onClose: () => void;
  onSaved: () => void;
};

export function ReorderDrawer({ open, articleId, sentences, onClose, onSaved }: Props) {
  const toast = useToast();
  const [order, setOrder] = useState<AdminSentence[]>(sentences);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => { if (open) { setOrder(sentences.slice()); setErr(null); setBusy(false); } }, [open, sentences]);

  function move(from: number, to: number) {
    if (from === to) return;
    const next = order.slice();
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setOrder(next);
  }

  async function save() {
    if (busy) return;
    setBusy(true); setErr(null);
    try {
      const ordered_ids = order.map((s) => s.id);
      await adminApi('/china/sentences/reorder', {
        method: 'PUT',
        body: JSON.stringify({ article_id: articleId, ordered_ids }),
      });
      toast.success('排序已保存');
      onSaved();
    } catch (e) { setErr((e as Error).message); }
    finally { setBusy(false); }
  }

  return (
    <Drawer
      open={open}
      onClose={busy ? () => undefined : onClose}
      side="right"
      width={560}
      title="调整句子顺序"
      testId="reorder-drawer"
      footer={<>
        <Button variant="ghost" onClick={onClose} disabled={busy} data-testid="reorder-cancel">取消</Button>
        <Button onClick={save} disabled={busy} data-testid="reorder-save">{busy ? '保存中…' : '保存顺序'}</Button>
      </>}
    >
      <p style={{ margin: '0 0 12px', color: 'var(--zy-fg-soft)', fontSize: 13 }}>
        拖拽句子调整顺序；保存后 seq_no 会重新连续编号。
      </p>
      <ul data-testid="reorder-list" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 6 }}>
        {order.map((s, idx) => (
          <li
            key={s.id}
            data-testid={`reorder-item-${s.id}`}
            className={
              'zy-reorder-item'
              + (dragIdx === idx ? ' dragging' : '')
              + (overIdx === idx && dragIdx !== null && dragIdx !== idx ? ' drop-target' : '')
            }
            draggable
            onDragStart={() => setDragIdx(idx)}
            onDragOver={(e) => { e.preventDefault(); setOverIdx(idx); }}
            onDragEnd={() => { setDragIdx(null); setOverIdx(null); }}
            onDrop={(e) => {
              e.preventDefault();
              if (dragIdx === null) return;
              move(dragIdx, idx);
              setDragIdx(null); setOverIdx(null);
            }}
          >
            <span style={{ cursor: 'grab', color: 'var(--zy-fg-mute)' }}>⋮⋮</span>
            <span style={{ minWidth: 56, color: 'var(--zy-fg-soft)', fontSize: 12 }}>原 #{s.seq_label}</span>
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {s.content_zh}
            </span>
            <span style={{ display: 'flex', gap: 4 }}>
              <Button variant="ghost" data-testid={`reorder-up-${s.id}`} disabled={idx === 0} onClick={() => move(idx, idx - 1)}>↑</Button>
              <Button variant="ghost" data-testid={`reorder-down-${s.id}`} disabled={idx === order.length - 1} onClick={() => move(idx, idx + 1)}>↓</Button>
            </span>
          </li>
        ))}
      </ul>
      {err && <p className="zy-error-text" style={{ marginTop: 12 }} data-testid="reorder-error">{err}</p>}
    </Drawer>
  );
}
