import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const moduleName = process.argv[2] ?? 'all';
const root = process.cwd();

async function main() {
  if (moduleName !== 'all' && moduleName !== 'user') {
    throw new Error(`Unsupported seed module ${moduleName}`);
  }
  const file = join(root, 'seed/user/users.json');
  const text = await readFile(file, 'utf8');
  const json = JSON.parse(text) as { items: unknown[] };
  console.log(JSON.stringify({ status: 'ok', module: 'user', count: json.items.length, mode: process.env.ALLOW_FAKE_DATABASE === 'true' ? 'fake-safe' : 'database' }));
}

await main();