import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@zhiyu/ui': path.resolve(__dirname, '../../packages/ui/src'),
    },
  },
});