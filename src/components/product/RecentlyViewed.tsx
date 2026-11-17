'use client';

import { useEffect, useState } from 'react';
import { useCatalog } from '@/context/CatalogContext';
import { getRecentSlugs } from '@/lib/recent';
import SectionHeading from '@/components/ui/SectionHeading';
import ProductCard from './ProductCard';

export default function RecentlyViewed({ currentSlug }: { currentSlug: string }) {
  const { products } = useCatalog();
  const [slugs, setSlugs] = useState<string[]>([]);

  // Read on mount (before the current product is recorded) so the list shows earlier views.
  useEffect(() => {
    setSlugs(getRecentSlugs().filter((s) => s !== currentSlug));
  }, [currentSlug]);

  const items = slugs
    .map((s) => products.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 4);

  if (items.length === 0) return null;

  return (
    <section className="bg-obsidian py-16 sm:py-24" aria-labelledby="recent-heading">
      <div className="container-luxe">
        <SectionHeading eyebrow="Pick up where you left off" title={<span id="recent-heading">Recently Viewed</span>} />
        <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
