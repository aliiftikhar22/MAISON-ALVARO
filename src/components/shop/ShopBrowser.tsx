'use client';

import { useMemo, useState } from 'react';
import { useCatalog } from '@/context/CatalogContext';
import ProductGrid from '@/components/product/ProductGrid';
import type { Category, Product } from '@/types';

type Filter = 'all' | Category | 'gift-sets';
type Sort = 'featured' | 'price-asc' | 'price-desc' | 'name';

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'for-him', label: 'For Him' },
  { id: 'for-her', label: 'For Her' },
  { id: 'unisex', label: 'Unisex' },
  { id: 'gift-sets', label: 'Gift Sets' },
];

const minPrice = (p: Product) => Math.min(...p.sizes.map((s) => s.price));

export default function ShopBrowser() {
  const { products } = useCatalog();
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<Sort>('featured');

  const items = useMemo(() => {
    let list = products.filter((p) => {
      if (filter === 'all') return true;
      if (filter === 'gift-sets') return p.isGiftSet;
      return p.category === filter && !p.isGiftSet;
    });
    list = [...list];
    if (sort === 'price-asc') list.sort((a, b) => minPrice(a) - minPrice(b));
    if (sort === 'price-desc') list.sort((a, b) => minPrice(b) - minPrice(a));
    if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, filter, sort]);

  return (
    <div>
      <div className="flex flex-col gap-5 border-y border-gold/20 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter fragrances">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={`px-4 py-2 text-[11px] uppercase tracking-wide2 transition-colors ${
                filter === f.id
                  ? 'bg-gold text-obsidian'
                  : 'border border-ivory/20 text-ivory/75 hover:border-gold/60 hover:text-gold'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 text-sm">
          <label htmlFor="sort" className="text-[11px] uppercase tracking-wide2 text-ivory/50">
            Sort
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="border border-ivory/20 bg-obsidian px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>
      <p className="mt-5 text-xs uppercase tracking-wide2 text-ivory/45" aria-live="polite">
        {items.length} {items.length === 1 ? 'fragrance' : 'fragrances'}
      </p>
      <div className="mt-8">
        <ProductGrid products={items} />
      </div>
    </div>
  );
}
