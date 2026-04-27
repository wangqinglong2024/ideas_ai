import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const moduleName = process.argv[2] ?? 'all';
const root = process.cwd();

async function main() {
  if (moduleName !== 'all' && moduleName !== 'user' && moduleName !== 'discover-china') {
    throw new Error(`Unsupported seed module ${moduleName}`);
  }
  if (moduleName === 'discover-china') {
    const file = join(root, 'seed/discover-china/blueprint.json');
    const text = await readFile(file, 'utf8');
    const json = JSON.parse(text) as { categories: Array<{ slug: string; titles: string[]; public: boolean }>; minimumArticlesPerCategory: number; locales: string[] };
    const articleCount = json.categories.reduce((sum, category) => sum + category.titles.length, 0);
    const missing = json.categories.filter((category) => category.titles.length < json.minimumArticlesPerCategory).map((category) => category.slug);
    if (json.categories.length !== 12) throw new Error(`discover-china requires 12 categories, got ${json.categories.length}`);
    if (articleCount < 36) throw new Error(`discover-china requires at least 36 dev articles, got ${articleCount}`);
    if (missing.length) throw new Error(`discover-china categories below minimum: ${missing.join(', ')}`);
    console.log(JSON.stringify({ status: 'ok', module: 'discover-china', categories: json.categories.length, articles: articleCount, openCategories: json.categories.filter((category) => category.public).map((category) => category.slug), locales: json.locales, mode: process.env.ALLOW_FAKE_DATABASE === 'true' ? 'fake-safe' : 'database' }));
    return;
  }
  const file = join(root, 'seed/user/users.json');
  const text = await readFile(file, 'utf8');
  const json = JSON.parse(text) as { items: unknown[] };
  console.log(JSON.stringify({ status: 'ok', module: 'user', count: json.items.length, mode: process.env.ALLOW_FAKE_DATABASE === 'true' ? 'fake-safe' : 'database' }));
}

await main();