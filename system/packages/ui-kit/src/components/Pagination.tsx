type Props = {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
  testId?: string;
};

export function Pagination({ page, pageSize, total, onChange, testId }: Props) {
  const last = Math.max(1, Math.ceil(total / pageSize));
  if (last <= 1) return null;
  const pages: number[] = [];
  const win = 1;
  const add = (p: number) => { if (p >= 1 && p <= last && !pages.includes(p)) pages.push(p); };
  add(1); for (let i = page - win; i <= page + win; i++) add(i); add(last);
  pages.sort((a, b) => a - b);

  return (
    <nav className="zy-pagination" data-testid={testId ?? 'pagination'} aria-label="pagination">
      <button type="button" className="zy-page-btn" data-testid="page-prev" disabled={page <= 1} onClick={() => onChange(page - 1)}>‹</button>
      {pages.map((p, idx) => {
        const prev = pages[idx - 1];
        const gap = prev !== undefined && p - prev > 1;
        return (
          <span key={p} style={{ display: 'inline-flex', alignItems: 'center' }}>
            {gap && <span className="zy-page-gap">…</span>}
            <button
              type="button"
              className={`zy-page-btn ${p === page ? 'zy-page-current' : ''}`}
              data-testid={`page-${p}`}
              aria-current={p === page ? 'page' : undefined}
              onClick={() => onChange(p)}
            >
              {p}
            </button>
          </span>
        );
      })}
      <button type="button" className="zy-page-btn" data-testid="page-next" disabled={page >= last} onClick={() => onChange(page + 1)}>›</button>
    </nav>
  );
}
