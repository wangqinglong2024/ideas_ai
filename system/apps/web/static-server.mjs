import { createReadStream, existsSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';

const root = join(process.cwd(), 'dist');
const port = Number(process.env.PORT ?? 80);
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json', '.webmanifest': 'application/manifest+json' };

createServer(async (req, res) => {
  if (req.url === '/healthz') { res.writeHead(200); res.end('ok'); return; }
  let pathname;
  try {
    pathname = normalize(decodeURIComponent(new URL(req.url ?? '/', `http://${req.headers.host}`).pathname));
  } catch {
    res.writeHead(400); res.end('bad request'); return;
  }
  let file = join(root, pathname === '/' ? 'index.html' : pathname);
  const acceptsHtml = String(req.headers.accept ?? '').includes('text/html');
  if (!file.startsWith(root) || !existsSync(file) || (await stat(file)).isDirectory()) {
    if (!acceptsHtml) { res.writeHead(404); res.end('not found'); return; }
    file = join(root, 'index.html');
  }
  res.setHeader('content-type', types[extname(file)] ?? 'application/octet-stream');
  res.setHeader('x-content-type-options', 'nosniff');
  res.setHeader('referrer-policy', 'strict-origin-when-cross-origin');
  res.setHeader('content-security-policy', "default-src 'self'; connect-src 'self' http: https:; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self'; object-src 'none'; base-uri 'self'");
  createReadStream(file).pipe(res);
}).listen(port, '0.0.0.0', () => console.log(JSON.stringify({ service: process.env.ROLE ?? 'frontend', port })));