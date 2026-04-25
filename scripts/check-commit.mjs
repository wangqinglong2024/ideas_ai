const message = process.argv[2] ?? '';
const pattern = /^(feat|fix|chore|docs|refactor|test|perf|build|ci)(\([a-z0-9-]+\))?: .{1,120}$/;

if (!pattern.test(message)) {
  console.error(`Invalid conventional commit message: ${message}`);
  process.exit(1);
}

console.log(`Commit message ok: ${message}`);
