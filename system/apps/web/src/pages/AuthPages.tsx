import { useEffect, useState } from 'react';
import { Download, ShieldCheck, Trash2 } from 'lucide-react';
import { api } from '../api';
import { Badge, Button, Card, Input, Segmented, Select, Toast } from '@zhiyu/ui';
import { locales, t, type Locale } from '@zhiyu/i18n';

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

export function ProfilePage({ navigate, locale, changeLocale }: { navigate: (path: string) => void; locale: Locale; changeLocale: (locale: Locale) => void }) {
  const [theme, setTheme] = useState(localStorage.getItem('zhiyu.theme') ?? 'system');
  const [uiLang, setUiLang] = useState<Locale>(locale);
  const [pinyinMode, setPinyinMode] = useState(localStorage.getItem('zhiyu.pinyinMode') ?? 'tones');
  const [translationMode, setTranslationMode] = useState(localStorage.getItem('zhiyu.translationMode') ?? 'inline');
  const [fontSize, setFontSize] = useState(localStorage.getItem('zhiyu.fontSize') ?? 'M');
  const [ttsSpeed, setTtsSpeed] = useState(Number(localStorage.getItem('zhiyu.ttsSpeed') ?? '1'));
  const [summary, setSummary] = useState<Record<string, unknown>>({});
  const [message, setMessage] = useState('');
  useEffect(() => { api.me.get().then((result) => { const preferences = result.data as { preferences?: Record<string, unknown> } | null; const nextLang = preferences?.preferences?.uiLang as Locale | undefined; if (nextLang && locales.includes(nextLang)) setUiLang(nextLang); }); api.request<Record<string, unknown>>('/api/v1/me/discover-summary').then((result) => setSummary(result.data ?? {})); }, []);
  function persistPreference(patch: Record<string, unknown>) {
    const current = {
      pinyinMode,
      translationMode,
      fontSize,
      ttsSpeed,
      ...patch
    };
    localStorage.setItem('zhiyu.preferences', JSON.stringify(current));
    if (current.pinyinMode) localStorage.setItem('zhiyu.pinyinMode', String(current.pinyinMode));
    if (current.translationMode) localStorage.setItem('zhiyu.translationMode', String(current.translationMode));
    if (current.fontSize) localStorage.setItem('zhiyu.fontSize', String(current.fontSize));
    if (current.ttsSpeed) localStorage.setItem('zhiyu.ttsSpeed', String(current.ttsSpeed));
    window.dispatchEvent(new Event('zhiyu-preferences'));
    api.me.preferences({ ...current, uiLang }).then((result) => setMessage(result.error?.message ?? 'Preferences saved'));
  }
  async function exportData() {
    const result = await api.request<{ id: string }>('/api/me/data-exports', { method: 'POST', body: JSON.stringify({ format: 'json' }) });
    setMessage(result.error?.message ?? `Export ready: ${result.data?.id}`);
  }
  async function deleteAccount() {
    const result = await api.request('/api/me/delete-account', { method: 'POST', body: JSON.stringify({ password: 'Password123!' }) });
    setMessage(result.error?.message ?? 'Account is in 90-day restore window.');
  }
  return <section className="page stack"><div className="profile-hero glass-porcelain"><div className="avatar">知</div><div><h1>My Zhiyu</h1><p>Profile, progress, coins, referral, settings and privacy.</p></div></div><Card><h2>Learning stats</h2><div className="metric-grid"><span>HSK 1</span><span>Coins 100</span><span>Read {String(summary.readArticles ?? 0)}</span><span>Notes {String(summary.notes ?? 0)}</span></div></Card><Card><h2>{t(locale, 'settings')}</h2><div className="settings-grid"><Select label={t(locale, 'language')} value={uiLang} onChange={(event) => { const next = event.currentTarget.value as Locale; setUiLang(next); changeLocale(next); api.me.preferences({ uiLang: next, ui_lang: next }).then((result) => setMessage(result.error?.message ?? 'Language saved')); }}>{locales.map((item) => <option key={item} value={item}>{item.toUpperCase()}</option>)}</Select><Select label={t(locale, 'pinyinMode')} value={pinyinMode} onChange={(event) => { setPinyinMode(event.currentTarget.value); persistPreference({ pinyinMode: event.currentTarget.value }); }}><option value="tones">letters with tone marks</option><option value="letters">letters only</option><option value="hidden">hidden</option></Select><Select label={t(locale, 'translationMode')} value={translationMode} onChange={(event) => { setTranslationMode(event.currentTarget.value); persistPreference({ translationMode: event.currentTarget.value }); }}><option value="inline">inline</option><option value="collapse">collapsed tone</option><option value="hidden">hidden</option></Select><Select label={t(locale, 'fontSize')} value={fontSize} onChange={(event) => { setFontSize(event.currentTarget.value); persistPreference({ fontSize: event.currentTarget.value }); }}><option value="S">S</option><option value="M">M</option><option value="L">L</option><option value="XL">XL</option></Select></div><Segmented label="Theme" items={['light', 'dark', 'system']} value={theme} onChange={(value) => { setTheme(value); localStorage.setItem('zhiyu.theme', value); document.documentElement.dataset.theme = value === 'system' ? 'light' : value; persistPreference({ theme: value }); }} /><label className="setting-line"><span>{t(locale, 'ttsSpeed')}</span><input type="range" min="0.5" max="1.5" step="0.25" value={ttsSpeed} onChange={(event) => { const next = Number(event.currentTarget.value); setTtsSpeed(next); persistPreference({ ttsSpeed: next }); }} /><strong>{ttsSpeed}x</strong></label></Card><Card><h2>Favorites and notes</h2><p>Favorites {String(summary.favorites ?? 0)} · Read words {String(summary.readWords ?? 0)}</p><div className="row"><Button variant="secondary" onClick={() => navigate('/discover/search')}>Search articles</Button><Button variant="secondary" onClick={() => navigate('/discover/history')}>Continue Discover China</Button></div></Card><Card><h2>Security and privacy</h2><div className="row"><Button variant="secondary" onClick={() => setMessage('Password change form uses /api/auth/password/change.')}><ShieldCheck size={18} />Change password</Button><Button variant="secondary" onClick={exportData}><Download size={18} />Export data</Button><Button variant="danger" onClick={deleteAccount}><Trash2 size={18} />Delete account</Button></div>{message ? <Toast type="info">{message}</Toast> : null}</Card><Card><h2>Anonymous access model</h2><p>Visitors can read 中国历史、中国美食、名胜风光. Login unlocks all 12 Discover China categories.</p><Button variant="secondary" onClick={() => navigate('/onboarding')}>Open onboarding</Button></Card></section>;
}