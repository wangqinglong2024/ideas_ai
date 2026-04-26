/**
 * Console-only fake implementations.
 *
 * These exist so that missing third-party API keys never block local dev or
 * smoke tests. They log a one-shot WARN line on instantiation and return
 * deterministic fixtures.
 */
import { randomUUID } from 'node:crypto';
import type {
  ASRAdapter,
  CaptchaAdapter,
  EmailAdapter,
  LLMAdapter,
  LlmCompletionArgs,
  LlmCompletionResult,
  PaymentAdapter,
  PushAdapter,
  SmsAdapter,
  TTSAdapter,
  WebSearchAdapter,
  WebSearchResult,
  WorkflowAdapter,
} from './contracts.js';

const warned = new Set<string>();
function warnOnce(name: string): void {
  if (warned.has(name)) return;
  warned.add(name);
  // eslint-disable-next-line no-console
  console.warn(`[zhiyu/adapter] ${name} -> fake (no API key configured)`);
}

export class FakeEmailAdapter implements EmailAdapter {
  constructor() {
    warnOnce('EmailAdapter');
  }
  async send(args: { to: string; subject: string; html: string }) {
    // eslint-disable-next-line no-console
    console.info('[fake-email]', { to: args.to, subject: args.subject });
    return { id: `fake-email-${randomUUID()}` };
  }
}

export class FakeSmsAdapter implements SmsAdapter {
  constructor() {
    warnOnce('SmsAdapter');
  }
  async send(args: { to: string; text: string }) {
    // eslint-disable-next-line no-console
    console.info('[fake-sms]', args);
    return { id: `fake-sms-${randomUUID()}` };
  }
}

export class FakePushAdapter implements PushAdapter {
  constructor() {
    warnOnce('PushAdapter');
  }
  async push(args: { userId: string; title: string; body: string }) {
    // eslint-disable-next-line no-console
    console.info('[fake-push]', args);
    return { id: `fake-push-${randomUUID()}` };
  }
}

export class FakePaymentAdapter implements PaymentAdapter {
  constructor() {
    warnOnce('PaymentAdapter');
  }
  async charge(args: { userId: string; amountCents: number; currency: string; ref: string }) {
    // eslint-disable-next-line no-console
    console.info('[fake-payment]', args);
    return { id: `fake-pay-${randomUUID()}`, status: 'succeeded' as const };
  }
}

export class FakeCaptchaAdapter implements CaptchaAdapter {
  constructor() {
    warnOnce('CaptchaAdapter');
  }
  async verify(_token: string) {
    return { ok: true };
  }
}

export class FakeLLMAdapter implements LLMAdapter {
  constructor() {
    warnOnce('LLMAdapter');
  }
  async complete(args: LlmCompletionArgs): Promise<LlmCompletionResult> {
    return {
      text: `[fake-llm] echo: ${args.prompt.slice(0, 80)}`,
      model: 'fake-llm-1',
      usage: { input: args.prompt.length, output: 32 },
    };
  }
}

export class FakeTTSAdapter implements TTSAdapter {
  constructor() {
    warnOnce('TTSAdapter');
  }
  async synthesize() {
    return { url: '/fixtures/tts/sample.wav' };
  }
}

export class FakeASRAdapter implements ASRAdapter {
  constructor() {
    warnOnce('ASRAdapter');
  }
  async transcribe() {
    return { text: '你好，世界。' };
  }
}

export class FakeWorkflowAdapter implements WorkflowAdapter {
  constructor() {
    warnOnce('WorkflowAdapter');
  }
  async run(args: { workflowId: string; input: unknown }) {
    return { output: { workflowId: args.workflowId, echoed: args.input } };
  }
}

export class FakeWebSearchAdapter implements WebSearchAdapter {
  constructor() {
    warnOnce('WebSearchAdapter');
  }
  async search(args: { query: string; topK?: number }): Promise<WebSearchResult[]> {
    const k = args.topK ?? 3;
    return Array.from({ length: k }, (_, i) => ({
      title: `Fake result ${i + 1} for "${args.query}"`,
      url: `https://example.invalid/${encodeURIComponent(args.query)}/${i + 1}`,
      snippet: 'Deterministic fake snippet for offline development.',
    }));
  }
}
