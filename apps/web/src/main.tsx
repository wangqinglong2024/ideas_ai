import React from 'react';
import { createRoot } from 'react-dom/client';

import { formatBrandBadge } from '@zhiyu/ui';

import './styles.css';

function WebApp() {
  return (
    <main>
      <section className="content">
        <p>{formatBrandBadge({ productName: 'Zhiyu Web', environment: 'docker' })}</p>
        <h1>知语内容门户</h1>
        <p>面向官网与公开内容的 Docker-only Vite 入口。</p>
      </section>
    </main>
  );
}

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');
createRoot(root).render(
  <React.StrictMode>
    <WebApp />
  </React.StrictMode>,
);
