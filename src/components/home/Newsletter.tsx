'use client';

import { useState } from 'react';
import { getRepo } from '@/lib/repo';

export default function Newsletter({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setState('error');
      setMessage('Please enter a valid email address.');
      return;
    }
    setState('sending');
    try {
      await (await getRepo()).addSubscriber(value);
      setState('done');
      setMessage('Thank you — you are on the list.');
      setEmail('');
    } catch {
      setState('error');
      setMessage('Something went wrong. Please try again.');
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className={`flex ${compact ? '' : 'mx-auto max-w-xl'} border-b border-gold/50`}>
        <label htmlFor={compact ? 'nl-footer' : 'nl-main'} className="sr-only">
          Email address
        </label>
        <input
          id={compact ? 'nl-footer' : 'nl-main'}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          autoComplete="email"
          className="w-full bg-transparent py-3 text-sm text-ivory placeholder:text-ivory/35 focus:outline-none"
        />
        <button
          type="submit"
          disabled={state === 'sending'}
          className="px-4 text-[11px] uppercase tracking-luxe text-gold transition-colors hover:text-gold-soft disabled:opacity-50"
        >
          {state === 'sending' ? '…' : 'Subscribe'}
        </button>
      </div>
      <p
        role="status"
        className={`mt-3 min-h-[1.25rem] text-xs ${state === 'error' ? 'text-[#e0636a]' : 'text-gold'} ${
          compact ? '' : 'text-center'
        }`}
      >
        {message}
      </p>
    </form>
  );
}
