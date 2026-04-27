import { createAppApi } from '@zhiyu/backend';

const app = createAppApi();
const port = Number(process.env.PORT ?? 8080);

app.listen(port, '0.0.0.0', () => {
  console.log(JSON.stringify({ service: 'app-api', status: 'listening', port }));
});