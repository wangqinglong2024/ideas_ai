import React from 'react';
import { createRoot } from 'react-dom/client';

import { formatBrandBadge } from '@zhiyu/ui';

import './styles.css';

function AdminApp() {
  return (
    <main className="admin-shell">
      <header>
        <span>{formatBrandBadge({ productName: 'Zhiyu Admin', environment: 'docker' })}</span>
        <strong>Foundation Console</strong>
      </header>
      <section className="table-panel">
        <h1>平台基础状态</h1>
        <dl>
          <div>
            <dt>构建</dt>
            <dd>Docker compose</dd>
          </div>
          <div>
            <dt>密钥</dt>
            <dd>缺失时自动 mock</dd>
          </div>
          <div>
            <dt>测试</dt>
            <dd>pnpm verify inside container</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');
createRoot(root).render(
  <React.StrictMode>
    <AdminApp />
  </React.StrictMode>,
);
