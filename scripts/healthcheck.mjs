const url = process.argv[2] ?? 'http://localhost:3000/health';

const response = await fetch(url);
if (!response.ok) {
  throw new Error(`Health check failed: ${response.status}`);
}

const payload = await response.json();
if (payload.status !== 'ok') {
  throw new Error(`Health check returned non-ok status: ${payload.status}`);
}

console.log(`Health check ok: ${url}`);
