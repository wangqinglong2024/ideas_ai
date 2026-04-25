import React from 'react';
import { createRoot } from 'react-dom/client';

import { formatBrandBadge } from '@zhiyu/ui';

import './styles.css';

function DocsApp() {
  return (
    <main className="docs-shell">
      <aside>
        <strong>{formatBrandBadge({ productName: 'Zhiyu Docs', environment: 'docker' })}</strong>
      </aside>
      <section>
        <h1>工程文档入口</h1>
        <ul>
          <li>Docker 构建与测试命令</li>
          <li>环境变量 mock 策略</li>
          <li>PR 与 issue 模板</li>
        </ul>
      </section>
    </main>
  );
}

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');
createRoot(root).render(
  <React.StrictMode>
    <DocsApp />
  </React.StrictMode>,
);