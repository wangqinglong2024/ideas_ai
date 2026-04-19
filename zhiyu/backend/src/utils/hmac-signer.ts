import { createHmac } from 'crypto'
import { config } from '../core/config'

const HMAC_ALGORITHM = 'sha256'

function getSecret(): string {
  return (config as Record<string, unknown>).HMAC_SECRET as string || config.JWT_SECRET
}

export function hmacSign(data: unknown): string {
  const payload = typeof data === 'string' ? data : JSON.stringify(data)
  return createHmac(HMAC_ALGORITHM, getSecret())
    .update(payload)
    .digest('hex')
}

export function hmacVerify(data: unknown, signature: string): boolean {
  const expected = hmacSign(data)
  if (expected.length !== signature.length) return false
  // Timing-safe comparison
  let result = 0
  for (let i = 0; i < expected.length; i++) {
    result |= expected.charCodeAt(i) ^ signature.charCodeAt(i)
  }
  return result === 0
}
