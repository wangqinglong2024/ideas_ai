export type AdapterResult<T> = { provider: string; fake: boolean; data: T };

export type EmailMessage = { to: string; subject: string; text: string; locale?: string };
export type SmsMessage = { to: string; text: string };
export type PushMessage = { userId: string; title: string; body: string };

export const emailAdapter = {
  async send(message: EmailMessage): Promise<AdapterResult<EmailMessage>> {
    console.warn('[adapter:fallback] EmailAdapter fake provider used', { to: message.to, subject: message.subject });
    return { provider: 'fake-email-console', fake: true, data: message };
  }
};

export const smsAdapter = {
  async send(message: SmsMessage): Promise<AdapterResult<SmsMessage>> {
    console.warn('[adapter:fallback] SmsAdapter fake provider used', { to: message.to });
    return { provider: 'fake-sms-console', fake: true, data: message };
  }
};

export const pushAdapter = {
  async send(message: PushMessage): Promise<AdapterResult<PushMessage>> {
    console.warn('[adapter:fallback] PushAdapter fake provider used', { userId: message.userId });
    return { provider: 'fake-push-console', fake: true, data: message };
  }
};

export const paymentAdapter = {
  async checkout(input: { userId: string; plan: string; amountUsd: number }) {
    return { provider: 'dummy-payment', fake: true, data: { ...input, status: 'paid', transactionId: `dummy_${Date.now()}` } };
  },
  async refund(input: { orderId: string; reason: string }) {
    return { provider: 'dummy-payment', fake: true, data: { ...input, status: 'refund_pending' } };
  }
};

export const captchaAdapter = {
  async verify(token?: string) {
    return { provider: 'always-pass-captcha', fake: true, data: { ok: true, token: token ?? 'missing-dev-token' } };
  }
};

export const llmAdapter = {
  async complete(prompt: string) {
    return { provider: 'mock-llm', fake: true, data: { text: `fixture:${prompt.slice(0, 80)}` } };
  }
};

export const ttsAdapter = {
  async synthesize(text: string) {
    return { provider: 'mock-tts', fake: true, data: { audioUrl: `seed://audio/mock/${encodeURIComponent(text.slice(0, 24))}.mp3` } };
  }
};

export const asrAdapter = {
  async transcribe() {
    return { provider: 'mock-asr', fake: true, data: { transcript: 'ni hao', confidence: 0.99 } };
  }
};

export const workflowAdapter = {
  async start(name: string, payload: Record<string, unknown>) {
    return { provider: 'mock-workflow', fake: true, data: { id: `wf_${Date.now()}`, name, payload, status: 'queued' } };
  }
};