import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const thresholds = new Map([
  ['apps/app/dist', 250 * 1024],
  ['apps/admin/dist', 350 * 1024],
  ['apps/web/dist', 220 * 1024],
  ['apps/docs/dist', 220 * 1024],
]);

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(fullPath)));
    } else if (entry.name.endsWith('.js')) {
      files.push(fullPath);
    }
  }
  return files;
}

for (const [directory, threshold] of thresholds) {
  const absoluteDirectory = path.resolve(directory);
  try {
    await stat(absoluteDirectory);
  } catch {
    console.log(`Skipping size check for ${directory}; dist not found`);
    continue;
  }
  const files = await collectFiles(absoluteDirectory);
  let total = 0;
  for (const file of files) {
    const source = await import('node:fs/promises').then((fs) => fs.readFile(file));
    total += gzipSync(source).byteLength;
  }
  if (total > threshold) {
    throw new Error(`${directory} gzipped JS ${total} exceeds ${threshold}`);
  }
  console.log(`${directory} gzipped JS ${total}/${threshold}`);
}
