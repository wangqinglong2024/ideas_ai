import React from 'react';
import { createRoot } from 'react-dom/client';

import { translate } from '@zhiyu/i18n';
import { formatBrandBadge, noop } from '@zhiyu/ui';

import './styles.css';

noop();

function App() {
  const badge = formatBrandBadge({ productName: 'Zhiyu', environment: 'docker' });

  return (
    <main className="shell">
      <section className="panel">
        <p className="eyebrow">{badge}</p>
        <h1>{translate('zh-CN', 'welcome')}</h1>
        <p>移动端学习入口已接入 monorepo、TypeScript strict 与 Docker 验证链路。</p>
        <a href="/health.txt">本地健康占位</a>
      </section>
    </main>
  );
}

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');
createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
