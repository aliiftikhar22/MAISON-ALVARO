'use client';

import { useMemo } from 'react';
import { useCatalog } from '@/context/CatalogContext';
import ProductGrid from '@/components/product/ProductGrid';
import type { Collection } from '@/types';

export default function CollectionProducts({ collection }: { collection: Collection }) {
  const { products } = useCatalog();
  const items = useMemo(
    () =>
      products.filter((p) =>
        collection.giftSets ? p.isGiftSet : p.category === collection.category && !p.isGiftSet,
      ),
    [products, collection],
  );
  return (
    <ProductGrid
      products={items}
      emptyMessage={`No ${collection.title.toLowerCase()} fragrances are available yet.`}
    />
  );
}
