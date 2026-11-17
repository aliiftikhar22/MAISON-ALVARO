'use client';

import Link from 'next/link';
import { useCatalog } from '@/context/CatalogContext';
import type { Product } from '@/types';
import ProductCard from './ProductCard';

export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <div className="aspect-[4/5] animate-pulse-soft border border-gold/10 bg-espresso/40" />
          <div className="mx-auto mt-5 h-4 w-2/3 animate-pulse-soft bg-espresso/60" />
          <div className="mx-auto mt-3 h-3 w-1/3 animate-pulse-soft bg-espresso/60" />
        </div>
      ))}
    </div>
  );
}

interface Props {
  products: Product[];
  columns?: 3 | 4;
  emptyMessage?: string;
}

/** Product grid with built-in loading / error / empty states. */
export default function ProductGrid({
  products,
  columns = 4,
  emptyMessage = 'No fragrances are available here yet.',
}: Props) {
  const { status, refresh } = useCatalog();

  if (status === 'loading') return <ProductGridSkeleton count={columns} />;

  if (status === 'error') {
    return (
      <div className="border border-crimson/50 px-6 py-12 text-center">
        <p className="font-serif text-2xl">We couldn’t load the collection.</p>
        <button onClick={() => void refresh()} className="btn-outline mt-6">
          Try again
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="border border-gold/20 px-6 py-14 text-center">
        <p className="font-serif text-2xl">{emptyMessage}</p>
        <Link href="/shop/" className="btn-outline mt-6">
          Browse all fragrances
        </Link>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-2 gap-x-5 gap-y-12 ${
        columns === 4 ? 'lg:grid-cols-4' : 'md:grid-cols-3'
      }`}
    >
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
