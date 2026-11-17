'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { categoryLabels, collections, siteConfig } from '@/data/seed';
import { useCatalog } from '@/context/CatalogContext';
import { SHELL_SLUG } from '@/lib/constants';
import { recordRecentlyViewed } from '@/lib/recent';
import ProductGallery from './ProductGallery';
import PurchasePanel from './PurchasePanel';
import ProductDetails from './ProductDetails';
import ProductReviews from './ProductReviews';
import RelatedProducts from './RelatedProducts';
import RecentlyViewed from './RecentlyViewed';
import {
  ProductLoadError,
  ProductNotFound,
  ProductSkeleton,
  ProductUnavailable,
} from './ProductStates';

/**
 * Renders the product page for a slug. The slug is read from the real URL on the client,
 * so the same prebuilt shell can serve products that were added in /admin after deployment.
 */
export default function ProductView({ slug: initialSlug }: { slug: string }) {
  const { products, allProducts, status, refresh } = useCatalog();
  const [slug, setSlug] = useState(initialSlug);

  useEffect(() => {
    const match = window.location.pathname.match(/\/products\/([^/]+)/);
    if (match) setSlug(decodeURIComponent(match[1]));
  }, []);

  const product = useMemo(() => products.find((p) => p.slug === slug), [products, slug]);
  const existsUnpublished = useMemo(
    () => allProducts.some((p) => p.slug === slug && !p.published),
    [allProducts, slug],
  );

  useEffect(() => {
    if (product) recordRecentlyViewed(product.slug);
  }, [product]);

  if (slug === SHELL_SLUG || status === 'loading') return <ProductSkeleton />;
  if (status === 'error') return <ProductLoadError onRetry={() => void refresh()} />;
  if (!product) return existsUnpublished ? <ProductUnavailable /> : <ProductNotFound />;

  const collection = collections.find((c) =>
    product.isGiftSet ? c.giftSets : c.category === product.category,
  );
  const minPrice = Math.min(...product.sizes.map((s) => s.price));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription,
    image: product.images.map((i) => new URL(i.src, siteConfig.siteUrl).toString()),
    sku: product.id,
    brand: { '@type': 'Brand', name: siteConfig.name },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'PKR',
      price: minPrice,
      url: new URL(`/products/${product.slug}/`, siteConfig.siteUrl).toString(),
      availability:
        product.availability === 'out_of_stock'
          ? 'https://schema.org/OutOfStock'
          : 'https://schema.org/InStock',
    },
  };

  return (
    <main>
      {product.isDemo && (
        <div className="border-b border-gold/20 bg-espresso/60 py-2 text-center text-[10px] uppercase tracking-wide2 text-gold/80">
          Demo product — placeholder name, price and details until real inventory is provided
        </div>
      )}

      <div className="container-luxe py-8 lg:py-10">
        <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wide2 text-ivory/50">
          <Link href="/" className="hover:text-gold">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" aria-hidden />
          <Link href="/shop/" className="hover:text-gold">
            Shop
          </Link>
          {collection && (
            <>
              <ChevronRight className="h-3 w-3" aria-hidden />
              <Link href={`/collections/${collection.slug}/`} className="hover:text-gold">
                {product.isGiftSet ? 'Gift Sets' : categoryLabels[product.category]}
              </Link>
            </>
          )}
          <ChevronRight className="h-3 w-3" aria-hidden />
          <span className="text-ivory/80" aria-current="page">
            {product.name}
          </span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          {/* key resets gallery/purchase state when navigating between products */}
          <ProductGallery key={`g-${product.id}`} images={product.images} name={product.name} />
          <PurchasePanel key={`p-${product.id}`} product={product} />
        </div>
      </div>

      <ProductDetails product={product} />
      <ProductReviews reviews={product.reviews} />
      <RelatedProducts product={product} />
      <RecentlyViewed currentSlug={product.slug} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
    </main>
  );
}
