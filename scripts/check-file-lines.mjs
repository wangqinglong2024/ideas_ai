import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const ignored = new Set(['.git', 'node_modules', 'dist', 'build', 'coverage', '.turbo']);
const checkedExtensions = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.mjs',
  '.cjs',
  '.json',
  '.md',
  '.yaml',
  '.yml',
  '.css',
]);
const maxLines = 800;
const violations = [];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  await Promise.all(
    entries.map(async (entry) => {
      if (ignored.has(entry.name)) return;
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
        return;
      }
      if (!checkedExtensions.has(path.extname(entry.name))) return;
      const lineCount = (await readFile(fullPath, 'utf8')).split('\n').length;
      if (lineCount > maxLines) {
        violations.push(`${path.relative(root, fullPath)}: ${lineCount}`);
      }
    }),
  );
}

await walk(root);

if (violations.length > 0) {
  console.error(`Files over ${maxLines} lines:\n${violations.join('\n')}`);
  process.exit(1);
}

console.log(`File line check passed: <= ${maxLines} lines`);
