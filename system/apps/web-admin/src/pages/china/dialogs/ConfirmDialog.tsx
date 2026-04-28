import type { ReactNode } from 'react';
import { useState } from 'react';
import { Button, Modal } from '@zhiyu/ui-kit';

type Props = {
  open: boolean;
  title: ReactNode;
  body: ReactNode;
  onCancel: () => void;
  onConfirm: () => Promise<void> | void;
  okText?: string;
  cancelText?: string;
  danger?: boolean;
  testId?: string;
};

export function ConfirmDialog({ open, title, body, onCancel, onConfirm, okText = '确定', cancelText = '取消', danger, testId = 'confirm-dialog' }: Props) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function go() {
    setBusy(true); setErr(null);
    try { await onConfirm(); }
    catch (e) { setErr((e as Error).message); }
    finally { setBusy(false); }
  }

  return (
    <Modal
      open={open}
      onClose={() => { if (!busy) onCancel(); }}
      width={380}
      title={<span>{danger ? '⚠ ' : ''}{title}</span>}
      testId={testId}
      footer={<>
        <Button variant="ghost" onClick={onCancel} disabled={busy} data-testid="confirm-cancel">{cancelText}</Button>
        <Button onClick={go} disabled={busy} data-testid="confirm-ok">{busy ? '处理中…' : okText}</Button>
      </>}
    >
      <div style={{ lineHeight: 1.7 }}>{body}</div>
      {err && <p className="zy-error-text" style={{ marginTop: 8 }} data-testid="confirm-error">{err}</p>}
    </Modal>
  );
}

export function UnsavedChangesModal({ open, onStay, onLeave }: { open: boolean; onStay: () => void; onLeave: () => void }) {
  return (
    <Modal
      open={open}
      onClose={onStay}
      width={380}
      title="你有未保存的修改"
      testId="unsaved-modal"
      footer={<>
        <Button variant="ghost" onClick={onStay} data-testid="unsaved-stay">继续编辑</Button>
        <Button onClick={onLeave} data-testid="unsaved-leave">放弃修改并离开</Button>
      </>}
    >
      <p style={{ margin: 0 }}>未保存的内容会丢失，确定离开？</p>
    </Modal>
  );
}
