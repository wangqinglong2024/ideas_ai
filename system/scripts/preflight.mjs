import { existsSync, readdirSync, statSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const repoRoot = join(root, '..');
const failures = [];
const required = ['package.json', 'pnpm-workspace.yaml', 'turbo.json', 'tsconfig.base.json', 'docker/docker-compose.yml'];

for (const path of required) {
  if (!existsSync(join(root, path))) failures.push(`missing ${path}`);
}

for (const name of ['package.json', 'apps', 'packages', 'docker']) {
  const target = join(repoRoot, name);
  if (existsSync(target) && statSync(target).isFile()) failures.push(`runtime file at repo root: ${name}`);
  if (existsSync(target) && statSync(target).isDirectory()) failures.push(`runtime directory at repo root: ${name}`);
}

const composeText = readFileSync(join(root, 'docker/docker-compose.yml'), 'utf8');
for (const port of ['3100', '8100', '4100', '9100']) {
  if (!composeText.includes(port)) failures.push(`compose missing fixed port ${port}`);
}
if (existsSync(join(root, 'docker/docker-compose.prod.yml')) || existsSync(join(root, 'docker/docker-compose.stg.yml'))) {
  failures.push('stg/prod compose file exists');
}

const bannedRuntimeDirs = ['.github', '.agents', '.claude', '_bmad', 'planning', 'content', 'games', 'novels'];
for (const name of bannedRuntimeDirs) {
  if (existsSync(join(root, name))) failures.push(`non-runtime asset copied into system: ${name}`);
}

function walk(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', 'dist', '.turbo', 'artifacts', '.pnpm-store', '.cache'].includes(entry.name)) continue;
    const next = join(dir, entry.name);
    if (entry.isDirectory()) walk(next, files);
    else files.push(next);
  }
  return files;
}

for (const file of walk(root)) {
  if (file.endsWith('pnpm-lock.yaml') || file.endsWith('scripts/preflight.mjs')) continue;
  const text = readFileSync(file, 'utf8');
  for (const keyword of ['Di' + 'fy', 'Post' + 'Hog', 'Sen' + 'try', 'Browser' + 'Stack', 'Dop' + 'pler']) {
    if (text.includes(keyword)) failures.push(`banned runtime keyword ${keyword} in ${file.replace(root + '/', '')}`);
  }
}

if (failures.length) {
  console.error(JSON.stringify({ status: 'failed', failures }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: 'ok', checkedAt: new Date().toISOString() }, null, 2));