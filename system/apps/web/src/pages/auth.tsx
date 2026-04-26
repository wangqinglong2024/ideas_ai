import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Container,
  HStack,
  Input,
  Label,
  PageShell,
  VStack,
  toast,
} from '@zhiyu/ui';
import { auth } from '../lib/api.js';
import { navigate } from '../lib/auth-store.js';

const errMsg = (e: unknown): string => {
  const err = e as { message?: string; body?: { error?: string } } | undefined;
  return err?.body?.error ?? err?.message ?? 'unknown_error';
};

export function SignUpPage(): JSX.Element {
  const [step, setStep] = useState<'email' | 'verify'>('email');
  const [email, setEmail] = useState('');
  const [challenge, setChallenge] = useState<{ id: string; devCode?: string } | null>(null);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <PageShell>
      <Container size="sm" className="py-16">
        <Card>
          <CardHeader>
            <CardTitle>注册 Zhiyu 账号</CardTitle>
            <CardDescription>邮箱验证码 + 设置密码（≥10 位含大写/数字/符号）</CardDescription>
          </CardHeader>
          <VStack gap={4}>
            {error && <Alert tone="danger" title="出错了">{error}</Alert>}
            {step === 'email' && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setBusy(true);
                  setError(null);
                  try {
                    const r = await auth.signUp(email);
                    setChallenge({ id: r.challenge_id, devCode: r.dev_code });
                    setStep('verify');
                    toast.success('验证码已发送', { description: r.dev_code ? `开发模式直显：${r.dev_code}` : '请查收邮箱' });
                  } catch (e2) {
                    setError(errMsg(e2));
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                <VStack gap={3}>
                  <div>
                    <Label htmlFor="su-email">邮箱</Label>
                    <Input id="su-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                  </div>
                  <Button type="submit" loading={busy}>获取验证码</Button>
                </VStack>
              </form>
            )}
            {step === 'verify' && challenge && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setBusy(true);
                  setError(null);
                  try {
                    await auth.verifyOtp({
                      challenge_id: challenge.id,
                      code,
                      password: password || undefined,
                      display_name: displayName || undefined,
                    });
                    toast.success('注册成功，已登录');
                    navigate('/me');
                  } catch (e2) {
                    setError(errMsg(e2));
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                <VStack gap={3}>
                  {challenge.devCode && (
                    <Alert tone="info" title="开发模式验证码">
                      <code>{challenge.devCode}</code>
                    </Alert>
                  )}
                  <div>
                    <Label htmlFor="su-code">6 位验证码</Label>
                    <Input id="su-code" inputMode="numeric" pattern="\\d{6}" maxLength={6} required value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} />
                  </div>
                  <div>
                    <Label htmlFor="su-name">昵称（可选）</Label>
                    <Input id="su-name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="知语小白" />
                  </div>
                  <div>
                    <Label htmlFor="su-pass">设置密码（可选，留空将随机分配）</Label>
                    <Input id="su-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="≥10 位含大写/数字/符号" />
                  </div>
                  <HStack gap={2}>
                    <Button type="submit" loading={busy}>完成注册</Button>
                    <Button type="button" variant="ghost" onClick={() => setStep('email')}>重新输入邮箱</Button>
                  </HStack>
                </VStack>
              </form>
            )}
            <div className="text-small text-text-secondary">
              已有账号？<a href="/signin" className="ms-1 underline">登录</a>
            </div>
          </VStack>
        </Card>
      </Container>
    </PageShell>
  );
}

export function SignInPage(): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [providers, setProviders] = useState<{ google: boolean; apple: boolean } | null>(null);

  useEffect(() => {
    void auth.providers().then((r) => setProviders(r.providers)).catch(() => setProviders({ google: false, apple: false }));
  }, []);

  return (
    <PageShell>
      <Container size="sm" className="py-16">
        <Card>
          <CardHeader>
            <CardTitle>登录 Zhiyu</CardTitle>
            <CardDescription>邮箱 + 密码登录。连续 5 次失败将锁定 15 分钟。</CardDescription>
          </CardHeader>
          <VStack gap={4}>
            {error && <Alert tone="danger" title="登录失败">{error}</Alert>}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setBusy(true);
                setError(null);
                try {
                  await auth.signIn(email, password);
                  toast.success('登录成功');
                  navigate('/me');
                } catch (e2) {
                  setError(errMsg(e2));
                } finally {
                  setBusy(false);
                }
              }}
            >
              <VStack gap={3}>
                <div>
                  <Label htmlFor="si-email">邮箱</Label>
                  <Input id="si-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="si-pass">密码</Label>
                  <Input id="si-pass" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <HStack gap={2} className="justify-between">
                  <Button type="submit" loading={busy}>登录</Button>
                  <a href="/reset-password" className="text-small underline text-text-secondary">忘记密码？</a>
                </HStack>
              </VStack>
            </form>
            {providers && (providers.google || providers.apple) && (
              <VStack gap={2}>
                <div className="text-small text-text-secondary">或使用第三方</div>
                {providers.google && (
                  <Button variant="secondary" asChild>
                    <a href="/api/v1/auth/oauth/google">Google 登录</a>
                  </Button>
                )}
                {providers.apple && (
                  <Button variant="secondary" asChild>
                    <a href="/api/v1/auth/oauth/apple">Apple 登录</a>
                  </Button>
                )}
              </VStack>
            )}
            <div className="text-small text-text-secondary">
              还没有账号？<a href="/signup" className="ms-1 underline">立即注册</a>
            </div>
          </VStack>
        </Card>
      </Container>
    </PageShell>
  );
}

export function ResetPasswordPage(): JSX.Element {
  const [step, setStep] = useState<'email' | 'confirm'>('email');
  const [email, setEmail] = useState('');
  const [challenge, setChallenge] = useState<{ id: string; devCode?: string } | null>(null);
  const [code, setCode] = useState('');
  const [pw, setPw] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <PageShell>
      <Container size="sm" className="py-16">
        <Card>
          <CardHeader>
            <CardTitle>重置密码</CardTitle>
            <CardDescription>输入注册邮箱获取验证码，然后设置新密码。</CardDescription>
          </CardHeader>
          <VStack gap={4}>
            {error && <Alert tone="danger" title="出错了">{error}</Alert>}
            {step === 'email' ? (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setBusy(true);
                  setError(null);
                  try {
                    const r = await auth.resetRequest(email);
                    setChallenge({ id: r.challenge_id, devCode: r.dev_code });
                    setStep('confirm');
                  } catch (e2) {
                    setError(errMsg(e2));
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                <VStack gap={3}>
                  <div>
                    <Label htmlFor="rp-email">邮箱</Label>
                    <Input id="rp-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <Button type="submit" loading={busy}>发送验证码</Button>
                </VStack>
              </form>
            ) : (
              challenge && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setBusy(true);
                    setError(null);
                    try {
                      await auth.resetConfirm({ challenge_id: challenge.id, code, new_password: pw });
                      toast.success('密码已重置，请重新登录');
                      navigate('/signin');
                    } catch (e2) {
                      setError(errMsg(e2));
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  <VStack gap={3}>
                    {challenge.devCode && <Alert tone="info" title="开发模式验证码"><code>{challenge.devCode}</code></Alert>}
                    <div>
                      <Label htmlFor="rp-code">6 位验证码</Label>
                      <Input id="rp-code" inputMode="numeric" maxLength={6} required value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} />
                    </div>
                    <div>
                      <Label htmlFor="rp-pw">新密码</Label>
                      <Input id="rp-pw" type="password" required value={pw} onChange={(e) => setPw(e.target.value)} placeholder="≥10 位含大写/数字/符号" />
                    </div>
                    <Button type="submit" loading={busy}>重置密码</Button>
                  </VStack>
                </form>
              )
            )}
          </VStack>
        </Card>
      </Container>
    </PageShell>
  );
}
