import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createAppApi } from '../src/modules/app-api';

describe('app api account flow', () => {
  const app = createAppApi();

  it('registers, logs in, reads me and writes telemetry', async () => {
    const email = `test-${Date.now()}@example.com`;
    const register = await request(app).post('/api/auth/register').send({ email, password: 'Password123!', native_lang: 'en', privacyAccepted: true });
    expect(register.status).toBe(201);
    const login = await request(app).post('/api/auth/login').send({ email, password: 'Password123!', device_id: 'vitest' });
    expect(login.status).toBe(200);
    const token = login.body.data.accessToken;
    const me = await request(app).get('/api/me').set('authorization', `Bearer ${token}`);
    expect(me.body.data.profile.email).toBe(email);
    const telemetry = await request(app).post('/api/v1/_telemetry/events').send({ type: 'vitest.smoke', props: {} });
    expect(telemetry.status).toBe(201);
  });

  it('rotates refresh tokens into access tokens and restricts deleted accounts', async () => {
    const email = `delete-${Date.now()}@example.com`;
    await request(app).post('/api/auth/register').send({ email, password: 'Password123!', native_lang: 'en', privacyAccepted: true });
    const login = await request(app).post('/api/auth/login').send({ email, password: 'Password123!', device_id: 'vitest' });
    const { accessToken, refreshToken } = login.body.data;

    const refreshed = await request(app).post('/api/auth/refresh').send({ refresh_token: refreshToken });
    expect(refreshed.status).toBe(200);
    expect(refreshed.body.data.accessToken).not.toBe(refreshToken);

    const deleted = await request(app).post('/api/me/delete-account').set('authorization', `Bearer ${accessToken}`).send({ password: 'Password123!' });
    expect(deleted.status).toBe(200);
    const restricted = await request(app).get('/api/me').set('authorization', `Bearer ${accessToken}`);
    expect(restricted.status).toBe(403);
  });
});