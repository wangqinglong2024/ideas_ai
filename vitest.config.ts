import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

const workspacePackages = [
  'analytics',
  'config',
  'db',
  'i18n',
  'jobs',
  'observability',
  'sdk',
  'types',
  'ui',
];

const alias = Object.fromEntries(
  workspacePackages.map((packageName) => [
    `@zhiyu/${packageName}`,
    fileURLToPath(new URL(`./packages/${packageName}/src/index.ts`, import.meta.url)),
  ]),
);

export default defineConfig({
  resolve: { alias },
  test: {
    environment: 'node',
  },
});
