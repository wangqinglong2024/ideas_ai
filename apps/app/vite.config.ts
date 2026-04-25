import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@zhiyu/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@zhiyu/i18n': path.resolve(__dirname, '../../packages/i18n/src'),
      '@zhiyu/sdk': path.resolve(__dirname, '../../packages/sdk/src'),
    },
  },
});
