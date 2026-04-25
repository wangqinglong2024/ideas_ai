import type { ServiceHealth } from '@zhiyu/types';

export interface ZhiyuClientOptions {
  baseUrl: string;
  fetcher?: typeof fetch;
}

export function createZhiyuClient(options: ZhiyuClientOptions) {
  const fetcher = options.fetcher ?? fetch;
  const baseUrl = options.baseUrl.replace(/\/$/, '');

  return {
    async health(): Promise<ServiceHealth> {
      const response = await fetcher(`${baseUrl}/health`);
      if (!response.ok) {
        throw new Error(`Health check failed with ${response.status}`);
      }
      return (await response.json()) as ServiceHealth;
    },
  };
}
