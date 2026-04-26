/**
 * Decide whether the caller may scrape /metrics.
 *
 * Allowed when:
 *  - env.ALLOW_METRICS === true, OR
 *  - request originates from an internal/private IP range.
 */
export function isMetricsAllowed(args: { allowFlag: boolean; remoteIp: string | undefined }): boolean {
  if (args.allowFlag) return true;
  if (!args.remoteIp) return false;
  const ip = normalizeIp(args.remoteIp);
  return isPrivateIp(ip);
}

function normalizeIp(ip: string): string {
  if (ip.startsWith('::ffff:')) return ip.slice(7);
  if (ip === '::1') return '127.0.0.1';
  return ip;
}

function isPrivateIp(ip: string): boolean {
  if (ip === '127.0.0.1' || ip === 'localhost') return true;
  if (/^10\./.test(ip)) return true;
  if (/^192\.168\./.test(ip)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)) return true;
  // Docker default bridges
  if (/^172\.17\./.test(ip) || /^172\.18\./.test(ip) || /^172\.19\./.test(ip)) return true;
  return false;
}
