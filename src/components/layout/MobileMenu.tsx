'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { X } from 'lucide-react';
import { collections } from '@/data/seed';
import Logo from './Logo';

const links = [
  { href: '/', label: 'Home' },
  { href: '/shop/', label: 'Shop' },
  ...collections.map((c) => ({ href: `/collections/${c.slug}/`, label: c.title })),
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
];

export default function MobileMenu({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal aria-label="Menu">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} aria-hidden />
      <nav className="absolute inset-y-0 left-0 flex w-[84%] max-w-sm animate-slide-in-left flex-col border-r border-gold/30 bg-obsidian px-6 py-6">
        <div className="flex items-center justify-between">
          <Logo />
          <button onClick={onClose} aria-label="Close menu" className="p-2 text-ivory/70 hover:text-gold">
            <X className="h-6 w-6" />
          </button>
        </div>
        <ul className="mt-10 space-y-1">
          {links.map((l) => (
            <li key={l.href + l.label}>
              <Link
                href={l.href}
                onClick={onClose}
                className="block border-b border-ivory/10 py-4 font-serif text-2xl text-ivory transition-colors hover:text-gold"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-auto text-[10px] uppercase tracking-luxe text-gold/70">Luxury, you can feel.</p>
      </nav>
    </div>
  );
}
