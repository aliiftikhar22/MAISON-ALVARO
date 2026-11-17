'use client';

import { useMemo } from 'react';
import { useCatalog } from '@/context/CatalogContext';
import type { Product } from '@/types';
import SectionHeading from '@/components/ui/SectionHeading';
import ProductCard from './ProductCard';

export default function RelatedProducts({ product }: { product: Product }) {
  const { products } = useCatalog();

  const related = useMemo(() => {
    const others = products.filter((p) => p.id !== product.id);
    const sameCategory = others.filter(
      (p) => p.category === product.category && p.isGiftSet === product.isGiftSet,
    );
    const rest = others.filter((p) => !sameCategory.includes(p));
    return [...sameCategory, ...rest].slice(0, 4);
  }, [products, product]);

  if (related.length === 0) return null;

  return (
    <section className="bg-espresso/30 py-16 sm:py-24" aria-labelledby="related-heading">
      <div className="container-luxe">
        <SectionHeading eyebrow="You may also love" title={<span id="related-heading">Related Fragrances</span>} />
        <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
