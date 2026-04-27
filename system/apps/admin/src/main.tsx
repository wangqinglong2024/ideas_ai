import React from 'react';
import { createRoot } from 'react-dom/client';
import '@zhiyu/ui/styles.css';
import '@zhiyu/ui/components.css';
import './styles.css';
import { AdminApp } from './AdminApp';

createRoot(document.getElementById('root')!).render(<React.StrictMode><AdminApp /></React.StrictMode>);