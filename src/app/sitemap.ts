import type { MetadataRoute } from 'next';
import { collections, seedProducts, siteConfig } from '@/data/seed';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.siteUrl.replace(/\/$/, '');
  const staticPaths = ['/', '/shop/', '/collections/', '/about/', '/contact/'];
  return [
    ...staticPaths.map((p) => ({ url: `${base}${p}` })),
    ...collections.map((c) => ({ url: `${base}/collections/${c.slug}/` })),
    // Add real product URLs here (or generate from your catalogue at build time).
    ...seedProducts.map((p) => ({ url: `${base}/products/${p.slug}/` })),
  ];
}
