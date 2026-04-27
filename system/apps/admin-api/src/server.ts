import { createAdminApi } from '@zhiyu/backend';

const app = createAdminApi();
const port = Number(process.env.PORT ?? 8080);

app.listen(port, '0.0.0.0', () => {
  console.log(JSON.stringify({ service: 'admin-api', status: 'listening', port }));
});