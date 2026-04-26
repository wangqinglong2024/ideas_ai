import type { AdapterFlags } from '@zhiyu/config';
import type { AdapterBundle } from './contracts.js';
import {
  FakeASRAdapter,
  FakeCaptchaAdapter,
  FakeEmailAdapter,
  FakeLLMAdapter,
  FakePaymentAdapter,
  FakePushAdapter,
  FakeSmsAdapter,
  FakeTTSAdapter,
  FakeWebSearchAdapter,
  FakeWorkflowAdapter,
} from './fake.js';

export * from './contracts.js';
export * from './fake.js';

/**
 * Build the full adapter bundle. This step never throws; missing real impls
 * fall back to fakes (each fake logs WARN once).
 */
export function buildAdapters(_flags: AdapterFlags): AdapterBundle {
  // Real impls are deferred to later epics.
  return {
    email: new FakeEmailAdapter(),
    sms: new FakeSmsAdapter(),
    push: new FakePushAdapter(),
    payment: new FakePaymentAdapter(),
    captcha: new FakeCaptchaAdapter(),
    llm: new FakeLLMAdapter(),
    tts: new FakeTTSAdapter(),
    asr: new FakeASRAdapter(),
    workflow: new FakeWorkflowAdapter(),
    webSearch: new FakeWebSearchAdapter(),
  };
}
