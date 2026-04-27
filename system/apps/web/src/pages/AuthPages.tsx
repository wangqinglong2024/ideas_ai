import { useState } from 'react';
import { Download, ShieldCheck, Trash2 } from 'lucide-react';
import { api } from '../api';
import { Badge, Button, Card, Input, Segmented, Toast } from '@zhiyu/ui';

export function AuthPages({ route, navigate }: { route: string; navigate: (path: string) => void }) {
  const mode = route.includes('register') ? 'register' : route.includes('forgot') ? 'forgot' : route.includes('verify') ? 'verify' : 'login';
  const [email, setEmail] = useState('normal@example.com');
  const [password, setPassword] = useState('Password123!');
  const [message, setMessage] = useState('');
  async function submit() {
    if (mode === 'register') {
      const result = await api.auth.register({ email, password, native_lang: 'en', privacyAccepted: true, turnstile_token: 'dev' });
      setMessage(result.error?.message ?? 'Registered. Dev OTP is 123456.');
      return;
    }
    if (mode === 'forgot') {
      const result = await api.request('/api/auth/password/reset-request', { method: 'POST', body: JSON.stringify({ email }) });
      setMessage(result.error?.message ?? 'Reset token sent. Dev token is RESET123.');
      return;
    }
    if (mode === 'verify') {
      setMessage('Enter OTP after logging in; dev code is 123456.');
      return;
    }
    const result = await api.auth.login({ email, password, device_id: 'browser' });
    if (result.data?.accessToken) localStorage.setItem('zy.token', result.data.accessToken);
    setMessage(result.error?.message ?? 'Logged in.');
    if (result.data?.accessToken) navigate('/profile');
  }
  return <section className="auth-page surface-wash"><Card variant="porcelain" className="auth-card"><Badge>Account</Badge><h1>{mode === 'register' ? 'Register' : mode === 'forgot' ? 'Reset password' : mode === 'verify' ? 'Verify email' : 'Login'}</h1><Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.currentTarget.value)} /><Input label="Password" type="password" value={password} onChange={(event) => setPassword(event.currentTarget.value)} /><Button onClick={submit}>{mode === 'login' ? 'Login' : 'Continue'}</Button><Button variant="secondary" onClick={() => api.request('/api/auth/oauth/google', { method: 'POST', body: JSON.stringify({ id_token: 'dev-google-token', device_id: 'browser' }) }).then((result) => setMessage(result.error?.message ?? 'Google OAuth fake token accepted'))}>Google OAuth fake</Button><div className="auth-links"><button onClick={() => navigate('/auth/login')}>Login</button><button onClick={() => navigate('/auth/register')}>Register</button><button onClick={() => navigate('/auth/forgot-password')}>Forgot</button></div>{message ? <Toast type="info">{message}</Toast> : null}</Card></section>;
}

export function OnboardingPage({ navigate }: { navigate: (path: string) => void }) {
  const [step, setStep] = useState(0);
  const steps = ['Native language', 'UI language', 'Learning goal', 'Current level', 'Recommended track', 'Pinyin tip'];
  return <section className="auth-page surface-wash"><Card className="auth-card"><Badge>Step {step + 1}/6</Badge><h1>{steps[step]}</h1><p>Every step can be skipped while preserving later profile editing.</p><progress max={6} value={step + 1} /><div className="row"><Button variant="tertiary" onClick={() => navigate('/profile')}>Skip</Button><Button onClick={() => step < 5 ? setStep(step + 1) : navigate('/profile')}>Next</Button></div></Card></section>;
}

export function ProfilePage({ navigate }: { navigate: (path: string) => void }) {
  const [theme, setTheme] = useState(localStorage.getItem('zhiyu.theme') ?? 'system');
  const [message, setMessage] = useState('');
  async function exportData() {
    const result = await api.request<{ id: string }>('/api/me/data-exports', { method: 'POST', body: JSON.stringify({ format: 'json' }) });
    setMessage(result.error?.message ?? `Export ready: ${result.data?.id}`);
  }
  async function deleteAccount() {
    const result = await api.request('/api/me/delete-account', { method: 'POST', body: JSON.stringify({ password: 'Password123!' }) });
    setMessage(result.error?.message ?? 'Account is in 90-day restore window.');
  }
  return <section className="page stack"><div className="profile-hero glass-porcelain"><div className="avatar">知</div><div><h1>My Zhiyu</h1><p>Profile, progress, coins, referral, settings and privacy.</p></div></div><Card><h2>Learning stats</h2><div className="metric-grid"><span>HSK 1</span><span>Coins 100</span><span>Streak 7</span><span>Notes 12</span></div></Card><Card><h2>Settings</h2><Segmented label="Theme" items={['light', 'dark', 'system']} value={theme} onChange={(value) => { setTheme(value); localStorage.setItem('zhiyu.theme', value); document.documentElement.dataset.theme = value === 'system' ? 'light' : value; }} /><label className="setting-line"><span>Pinyin mode</span><select><option>tones</option><option>letters</option><option>hidden</option></select></label><label className="setting-line"><span>Font size</span><select><option>M</option><option>S</option><option>L</option><option>XL</option></select></label><label className="setting-line"><span>TTS speed</span><input type="range" min="0.5" max="1.5" step="0.25" defaultValue="1" /></label></Card><Card><h2>Security and privacy</h2><div className="row"><Button variant="secondary" onClick={() => setMessage('Password change form uses /api/auth/password/change.')}><ShieldCheck size={18} />Change password</Button><Button variant="secondary" onClick={exportData}><Download size={18} />Export data</Button><Button variant="danger" onClick={deleteAccount}><Trash2 size={18} />Delete account</Button></div>{message ? <Toast type="info">{message}</Toast> : null}</Card><Card><h2>Anonymous access model</h2><p>Visitors can read the first three Discover China categories and preview novels. Login unlocks all current DC, novels and games.</p><Button variant="secondary" onClick={() => navigate('/onboarding')}>Open onboarding</Button></Card></section>;
}