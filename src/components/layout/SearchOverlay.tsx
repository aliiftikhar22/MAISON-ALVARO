'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { categoryLabels } from '@/data/seed';
import { useCatalog } from '@/context/CatalogContext';
import { formatPKR } from '@/lib/format';

export default function SearchOverlay({ onClose }: { onClose: () => void }) {
  const { products } = useCatalog();
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (term.length < 2) return [];
    return products
      .filter((p) =>
        [p.name, categoryLabels[p.category], p.shortDescription, ...p.notes.top, ...p.notes.middle, ...p.notes.base]
          .join(' ')
          .toLowerCase()
          .includes(term),
      )
      .slice(0, 6);
  }, [q, products]);

  return (
    <div className="fixed inset-0 z-[70] bg-obsidian/97 animate-fade-up" role="dialog" aria-modal aria-label="Search">
      <div className="container-luxe pt-8">
        <div className="flex items-center justify-between">
          <p className="eyebrow">Search</p>
          <button onClick={onClose} aria-label="Close search" className="p-2 text-ivory/70 hover:text-gold">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="mx-auto mt-10 max-w-2xl">
          <div className="flex items-center gap-4 border-b border-gold/50 pb-3">
            <Search className="h-5 w-5 text-gold" aria-hidden />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search fragrances"
              className="w-full bg-transparent font-serif text-3xl text-ivory placeholder:text-ivory/30 focus:outline-none"
              aria-label="Search fragrances"
            />
          </div>
          <ul className="mt-8 divide-y divide-ivory/10">
            {results.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/products/${p.slug}/`}
                  onClick={onClose}
                  className="flex items-center gap-5 py-4 transition-colors hover:text-gold"
                >
                  <img
                    src={p.images[0]?.src}
                    alt=""
                    className="h-16 w-14 border border-gold/20 object-cover"
                  />
                  <span className="flex-1">
                    <span className="block font-serif text-xl">{p.name}</span>
                    <span className="text-xs uppercase tracking-wide2 text-ivory/50">
                      {categoryLabels[p.category]}
                    </span>
                  </span>
                  <span className="text-sm text-gold">{formatPKR(Math.min(...p.sizes.map((s) => s.price)))}</span>
                </Link>
              </li>
            ))}
          </ul>
          {q.trim().length >= 2 && results.length === 0 && (
            <p className="mt-8 text-center text-sm text-ivory/55">No fragrances match “{q}”.</p>
          )}
        </div>
      </div>
    </div>
  );
}
