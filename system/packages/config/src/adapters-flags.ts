import type { AppEnv } from './env.js';

/**
 * Per-adapter "real or fake" decision based on env keys.
 * The SDK consumes these to pick the implementation at boot time.
 */
export interface AdapterFlags {
  email: 'real' | 'fake';
  sms: 'real' | 'fake';
  push: 'real' | 'fake';
  payment: 'real' | 'fake';
  captcha: 'real' | 'fake';
  llm: 'real' | 'fake';
  tts: 'real' | 'fake';
  asr: 'real' | 'fake';
  workflow: 'real' | 'fake';
  webSearch: 'real' | 'fake';
}

export function deriveAdapterFlags(env: AppEnv): AdapterFlags {
  return {
    email: env.RESEND_API_KEY ? 'real' : 'fake',
    sms: 'fake',
    push: env.ONESIGNAL_KEY ? 'real' : 'fake',
    payment: env.PADDLE_KEY ? 'real' : 'fake',
    captcha: env.TURNSTILE_SECRET ? 'real' : 'fake',
    llm: env.ANTHROPIC_API_KEY || env.DEEPSEEK_API_KEY ? 'real' : 'fake',
    tts: 'fake',
    asr: 'fake',
    workflow: 'fake',
    webSearch: env.TAVILY_API_KEY ? 'real' : 'fake',
  };
}
