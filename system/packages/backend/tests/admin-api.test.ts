import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createAdminApi } from '../src/modules/admin-api';

describe('admin api rbac and audit', () => {
  const app = createAdminApi();

  it('logs in with mandatory totp and records write audit', async () => {
    const login = await request(app).post('/admin/api/auth/login').send({ email: 'admin@example.com', password: 'Password123!', totp: '123456' });
    expect(login.status).toBe(200);
    const token = login.body.data.token;
    const users = await request(app).get('/admin/api/users').set('authorization', `Bearer ${token}`);
    expect(users.status).toBe(200);
    const id = users.body.data[0].id;
    const freeze = await request(app).post(`/admin/api/users/${id}/freeze`).set('authorization', `Bearer ${token}`).send({ reason: 'vitest' });
    expect(freeze.status).toBe(200);
    const audit = await request(app).get('/admin/api/audit').set('authorization', `Bearer ${token}`);
    expect(audit.body.data.some((row: { action: string }) => row.action === 'user.freeze')).toBe(true);
  });

  it('enforces sensitive read roles and validates coin adjustments', async () => {
    const viewerLogin = await request(app).post('/admin/api/auth/login').send({ email: 'viewer@example.com', password: 'Password123!', totp: '123456' });
    expect(viewerLogin.status).toBe(200);
    const viewerToken = viewerLogin.body.data.token;
    expect((await request(app).get('/admin/api/users').set('authorization', `Bearer ${viewerToken}`)).status).toBe(403);
    expect((await request(app).get('/admin/api/audit').set('authorization', `Bearer ${viewerToken}`)).status).toBe(403);
    expect((await request(app).get('/admin/api/security/events').set('authorization', `Bearer ${viewerToken}`)).status).toBe(403);

    const adminLogin = await request(app).post('/admin/api/auth/login').send({ email: 'admin@example.com', password: 'Password123!', totp: '123456' });
    const adminToken = adminLogin.body.data.token;
    const users = await request(app).get('/admin/api/users').set('authorization', `Bearer ${adminToken}`);
    const invalidCoins = await request(app).post(`/admin/api/users/${users.body.data[0].id}/coins/grant`).set('authorization', `Bearer ${adminToken}`).send({ amount: 1.5, reason: 'vitest' });
    expect(invalidCoins.status).toBe(400);
  });
});