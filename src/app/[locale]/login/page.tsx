'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const [tab, setTab] = useState<'email' | 'pin'>('email');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError(t('loginFailed'));
    } else {
      router.push('/');
      router.refresh();
    }
  }

  async function handlePinLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await signIn('pin', {
      pin,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError(t('loginFailed'));
    } else {
      router.push('/');
      router.refresh();
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl shadow-blue-900/5">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            KitchenFlow
          </h1>
          <p className="mt-2 text-sm text-gray-500">Kitchen Management System</p>
        </div>

        <div className="mb-6 flex rounded-xl bg-gray-100/80 p-1">
          <button
            onClick={() => { setTab('email'); setError(''); }}
            className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
              tab === 'email'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t('emailLogin')}
          </button>
          <button
            onClick={() => { setTab('pin'); setError(''); }}
            className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
              tab === 'pin'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t('pinLogin')}
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-3.5 text-sm font-medium text-danger">
            {error}
          </div>
        )}

        {tab === 'email' ? (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                {t('email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-border bg-gray-50/50 px-4 py-3 text-sm transition focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                {t('password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-border bg-gray-50/50 px-4 py-3 text-sm transition focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition hover:bg-primary-light hover:shadow-primary/30 disabled:opacity-50"
            >
              {loading ? '...' : t('login')}
            </button>
          </form>
        ) : (
          <form onSubmit={handlePinLogin} className="space-y-5">
            <div>
              <label className="mb-2 block text-center text-sm font-medium text-gray-700">
                {t('enterPin')}
              </label>
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                required
                className="w-full rounded-xl border border-border bg-gray-50/50 px-4 py-4 text-center text-3xl tracking-[0.5em] transition focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="- - - -"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition hover:bg-primary-light hover:shadow-primary/30 disabled:opacity-50"
            >
              {loading ? '...' : t('login')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
