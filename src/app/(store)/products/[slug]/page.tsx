import type { Metadata } from 'next';
import { seedProducts, siteConfig } from '@/data/seed';
import ProductView from '@/components/product/ProductView';
import { SHELL_SLUG } from '@/lib/constants';

/**
 * Static export: one HTML page is generated per demo product (SEO-friendly URLs and metadata)
 * plus a `_shell` page. Products added later in /admin are served by the `_shell` page through a
 * hosting rewrite (see firebase.json / vercel.json / public/_redirects) and resolved by slug on the client.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return [...seedProducts.map((p) => ({ slug: p.slug })), { slug: SHELL_SLUG }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = seedProducts.find((p) => p.slug === slug);

  if (!product) {
    return { title: 'Fragrance', robots: { index: false } };
  }

  const url = `/products/${product.slug}/`;
  const from = Math.min(...product.sizes.map((s) => s.price));
  const description = `${product.shortDescription} From PKR ${from.toLocaleString('en-US')}.`;

  return {
    title: product.name,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      title: `${product.name} | ${siteConfig.name}`,
      description,
      url,
      images: product.images[0] ? [{ url: product.images[0].src, alt: product.images[0].alt }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProductView slug={slug} />;
}
