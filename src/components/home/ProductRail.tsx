'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useCatalog } from '@/context/CatalogContext';
import type { Product } from '@/types';
import SectionHeading from '@/components/ui/SectionHeading';
import ProductGrid from '@/components/product/ProductGrid';

export type RailKind = 'bestSeller' | 'signature' | 'giftSet';

const filters: Record<RailKind, (p: Product) => boolean> = {
  bestSeller: (p) => p.bestSeller && !p.isGiftSet,
  signature: (p) => p.signature && !p.isGiftSet,
  giftSet: (p) => p.isGiftSet,
};

interface Props {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  kind: RailKind;
  limit?: number;
  href?: string;
  linkLabel?: string;
  background?: string;
}

export default function ProductRail({
  eyebrow,
  title,
  subtitle,
  kind,
  limit = 4,
  href = '/shop/',
  linkLabel = 'View all',
  background = 'bg-obsidian',
}: Props) {
  const { products } = useCatalog();
  const items = useMemo(
    () => products.filter(filters[kind]).slice(0, limit),
    [products, kind, limit],
  );

  return (
    <section className={`${background} py-20 sm:py-28`}>
      <div className="container-luxe">
        <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
        <div className="mt-14">
          <ProductGrid products={items} columns={limit === 3 ? 3 : 4} />
        </div>
        <div className="mt-14 text-center">
          <Link href={href} className="btn-outline">
            {linkLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
