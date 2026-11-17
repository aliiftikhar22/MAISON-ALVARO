'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';
import { adminSignIn, adminSignOut, subscribeAdmin, type AdminUser } from '@/lib/auth';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await adminSignIn(email.trim(), password);
    } catch {
      setError('Sign-in failed. Check your email and password.');
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto mt-24 w-full max-w-sm px-5">
      <p className="eyebrow text-center">Maison Alvaro</p>
      <h1 className="mt-3 text-center font-serif text-4xl">Admin sign in</h1>
      <form onSubmit={onSubmit} className="mt-10 space-y-5">
        <div>
          <label htmlFor="a-email" className="field-label">
            Email
          </label>
          <input
            id="a-email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field"
          />
        </div>
        <div>
          <label htmlFor="a-pass" className="field-label">
            Password
          </label>
          <input
            id="a-pass"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field"
          />
        </div>
        {error && (
          <p role="alert" className="field-error">
            {error}
          </p>
        )}
        <button type="submit" disabled={busy} className="btn-gold w-full">
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<AdminUser | null | undefined>(undefined);

  useEffect(() => subscribeAdmin(setUser), []);

  if (user === undefined) {
    return <div className="grid min-h-screen place-items-center text-sm text-ivory/50">Loading…</div>;
  }
  if (user === null) return <LoginForm />;

  const tabs = [
    { href: '/admin/', label: 'Orders' },
    { href: '/admin/products/', label: 'Products' },
  ];

  return (
    <div className="min-h-screen bg-obsidian">
      <header className="border-b border-gold/30">
        <div className="container-luxe flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-8">
            <p className="font-serif text-xl tracking-[0.14em] text-gold">MAISON ALVARO</p>
            <span className="text-[10px] uppercase tracking-luxe text-ivory/45">Admin</span>
            <nav className="flex gap-1" aria-label="Admin">
              {tabs.map((t) => {
                const active = t.href === '/admin/' ? pathname === '/admin/' || pathname === '/admin' : pathname.startsWith(t.href.replace(/\/$/, ''));
                return (
                  <Link
                    key={t.href}
                    href={t.href}
                    className={`px-4 py-2 text-[11px] uppercase tracking-wide2 transition-colors ${
                      active ? 'bg-gold text-obsidian' : 'text-ivory/70 hover:text-gold'
                    }`}
                  >
                    {t.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-5 text-xs text-ivory/55">
            <Link href="/" className="hover:text-gold">
              View store ↗
            </Link>
            {!user.demo && (
              <button onClick={() => void adminSignOut()} className="flex items-center gap-2 hover:text-gold">
                <LogOut className="h-3.5 w-3.5" /> Sign out
              </button>
            )}
          </div>
        </div>
        {user.demo && (
          <p className="bg-crimson/20 px-5 py-2 text-center text-xs text-ivory/80">
            <strong className="font-semibold text-gold">Demo mode</strong> — Firebase isn’t configured, so products and orders are
            saved only in this browser. Customers’ orders will not reach this screen until Firebase is set up (see README).
          </p>
        )}
      </header>
      <div className="container-luxe py-10">{children}</div>
    </div>
  );
}
