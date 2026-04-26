/**
 * Adapter contracts. Real implementations are deferred — every adapter ships a
 * console-fake fallback so that missing API keys never block boot.
 */
export interface EmailAdapter {
  send(args: { to: string; subject: string; html: string }): Promise<{ id: string }>;
}

export interface SmsAdapter {
  send(args: { to: string; text: string }): Promise<{ id: string }>;
}

export interface PushAdapter {
  push(args: { userId: string; title: string; body: string }): Promise<{ id: string }>;
}

export interface PaymentAdapter {
  charge(args: { userId: string; amountCents: number; currency: string; ref: string }): Promise<{
    id: string;
    status: 'succeeded' | 'pending' | 'failed';
  }>;
}

export interface CaptchaAdapter {
  verify(token: string, ip?: string): Promise<{ ok: boolean; reason?: string }>;
}

export interface LlmCompletionArgs {
  prompt: string;
  system?: string;
  maxTokens?: number;
}
export interface LlmCompletionResult {
  text: string;
  model: string;
  usage?: { input: number; output: number };
}
export interface LLMAdapter {
  complete(args: LlmCompletionArgs): Promise<LlmCompletionResult>;
}

export interface TTSAdapter {
  synthesize(args: { text: string; voice?: string; lang?: string }): Promise<{ url: string }>;
}

export interface ASRAdapter {
  transcribe(args: { audioUrl: string; lang?: string }): Promise<{ text: string }>;
}

export interface WorkflowAdapter {
  run(args: { workflowId: string; input: unknown }): Promise<{ output: unknown }>;
}

export interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
}
export interface WebSearchAdapter {
  search(args: { query: string; topK?: number }): Promise<WebSearchResult[]>;
}

export interface AdapterBundle {
  email: EmailAdapter;
  sms: SmsAdapter;
  push: PushAdapter;
  payment: PaymentAdapter;
  captcha: CaptchaAdapter;
  llm: LLMAdapter;
  tts: TTSAdapter;
  asr: ASRAdapter;
  workflow: WorkflowAdapter;
  webSearch: WebSearchAdapter;
}
