import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';
import { AlertCircle, Check, Info, Loader, Search, TriangleAlert, XCircle } from 'lucide-react';

export function cx(...items: Array<string | false | null | undefined>) {
  return items.filter(Boolean).join(' ');
}

export function Button({ variant = 'primary', size = 'md', className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost' | 'ink'; size?: 'xs' | 'sm' | 'md' | 'lg' }) {
  return <button className={cx('zy-button', `zy-button-${variant}`, `zy-button-${size}`, className)} {...props} />;
}

export function IconButton({ label, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string; children: ReactNode }) {
  return <button className="zy-icon-button" aria-label={label} title={label} {...props}>{children}</button>;
}

export function Input({ label, error, id, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  const inputId = id ?? `input-${label.replace(/\s+/g, '-').toLowerCase()}`;
  return <label className="zy-field" htmlFor={inputId}><span>{label}</span><input id={inputId} aria-invalid={Boolean(error)} aria-describedby={error ? `${inputId}-error` : undefined} {...props} />{error ? <small id={`${inputId}-error`}><AlertCircle size={14} />{error}</small> : null}</label>;
}

export function SearchInput(props: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & { label?: string }) {
  return <label className="zy-field zy-search"><span>{props.label ?? 'Search'}</span><Search size={18} /><input {...props} type="search" /></label>;
}

export function Card({ variant = 'paper', className, children }: { variant?: 'paper' | 'porcelain' | 'outlined' | 'interactive' | 'ink'; className?: string; children: ReactNode }) {
  return <section className={cx('zy-card', `zy-card-${variant}`, className)}>{children}</section>;
}

export function Badge({ tone = 'info', children }: { tone?: 'success' | 'warning' | 'danger' | 'info' | 'neutral'; children: ReactNode }) {
  return <span className={cx('zy-badge', `zy-badge-${tone}`)}>{children}</span>;
}

export function Tabs({ items, value, onChange }: { items: string[]; value: string; onChange: (value: string) => void }) {
  return <div className="zy-tabs" role="tablist">{items.map((item) => <button key={item} role="tab" aria-selected={item === value} onClick={() => onChange(item)}>{item}</button>)}</div>;
}

export function Segmented({ items, value, onChange, label }: { items: string[]; value: string; label: string; onChange: (value: string) => void }) {
  return <fieldset className="zy-segmented"><legend>{label}</legend>{items.map((item) => <button type="button" key={item} aria-pressed={item === value} onClick={() => onChange(item)}>{item}</button>)}</fieldset>;
}

export function Toast({ type, children }: { type: 'success' | 'info' | 'warning' | 'error' | 'loading'; children: ReactNode }) {
  const icons = { success: Check, info: Info, warning: TriangleAlert, error: XCircle, loading: Loader };
  const Icon = icons[type];
  return <div className={cx('zy-toast', `zy-toast-${type}`)} role="status" aria-live="polite"><Icon size={18} />{children}</div>;
}

export function EmptyState({ title, action }: { title: string; action?: ReactNode }) {
  return <div className="zy-empty"><div className="zy-empty-mark">□</div><h3>{title}</h3>{action}</div>;
}

export function DataTable<T extends Record<string, unknown>>({ rows, columns, selected, onToggle }: { rows: T[]; columns: Array<keyof T>; selected?: Set<string>; onToggle?: (id: string) => void }) {
  const columnCount = columns.length + (onToggle ? 1 : 0);
  return <div className="zy-table-wrap"><table className="zy-table" data-columns={columnCount}><thead><tr>{onToggle ? <th><span className="sr-only">Select</span></th> : null}{columns.map((column) => <th key={String(column)}>{String(column)}</th>)}</tr></thead><tbody>{rows.map((row, index) => { const id = String(row.id ?? index); return <tr key={id}>{onToggle ? <td><input type="checkbox" checked={selected?.has(id) ?? false} onChange={() => onToggle(id)} aria-label={`Select row ${id}`} /></td> : null}{columns.map((column) => <td key={String(column)}>{String(row[column] ?? '')}</td>)}</tr>; })}</tbody></table></div>;
}

export function PinyinText({ zh, pinyin, mode = 'tones' }: { zh: string; pinyin: string; mode?: 'letters' | 'tones' | 'hidden' }) {
  return <span className="zy-pinyin-text"><strong>{zh}</strong>{mode === 'hidden' ? null : <small>{mode === 'letters' ? pinyin.replace(/[1-5]/g, '') : pinyin}</small>}</span>;
}

export function SentenceCard({ zh, pinyin, translation }: { zh: string; pinyin: string; translation: string }) {
  return <Card variant="paper" className="zy-sentence"><PinyinText zh={zh} pinyin={pinyin} /><p>{translation}</p><div><Button variant="ghost" size="sm">Play</Button><Button variant="ghost" size="sm">Note</Button><Button variant="ghost" size="sm">Save</Button></div></Card>;
}