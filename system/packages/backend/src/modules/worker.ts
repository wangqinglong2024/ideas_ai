import { workflowAdapter, emailAdapter, pushAdapter } from '@zhiyu/adapters';

export function createWorkerRuntime() {
  const queues = ['email.send', 'push.send', 'analytics.export', 'content.review.assign', 'user.welcome'];
  return {
    queues,
    async smoke() {
      const workflow = await workflowAdapter.start('worker.smoke', { queues });
      const email = await emailAdapter.send({ to: 'dev@example.com', subject: 'Zhiyu worker smoke', text: 'ok' });
      const push = await pushAdapter.send({ userId: 'dev', title: 'Zhiyu', body: 'Worker fake push ok' });
      return { workflow, email, push };
    }
  };
}