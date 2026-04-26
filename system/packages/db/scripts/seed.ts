/* eslint-disable no-console */
/** Placeholder seed script. Real per-module seeds land with later epics. */
async function main(): Promise<void> {
  console.info('[seed] noop — module seeds will be wired in subsequent epics');
}

main().catch((err) => {
  console.error('[seed] failed', err);
  process.exit(1);
});
