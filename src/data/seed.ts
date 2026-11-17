/**
 * DEMO CATALOGUE — centralized product data.
 *
 * Everything in this file is clearly-identified placeholder content
 * (names, prices, notes, reviews). Nothing here is real inventory.
 * Replace it by adding real products in /admin (Firebase mode), or by editing
 * this file when running in demo mode, once real inventory is provided.
 */
import type { Category, Collection, Product, Testimonial } from '@/types';

export const siteConfig = {
  name: 'Maison Alvaro',
  tagline: 'Luxury, you can feel.',
  description:
    'Maison Alvaro — luxury fragrances for him, for her and beyond. Luxury, you can feel.',
  announcement: 'Free Delivery Across Pakistan',
  announcementSecondary: 'Luxury Redefined',
  /** Delivery fee in PKR. 0 = free delivery (as shown in the announcement bar). */
  deliveryFee: 0,
  currency: 'PKR',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.example.com',
} as const;

export const collections: Collection[] = [
  { slug: 'for-him', title: 'For Him', tagline: 'Bold. Distinguished.', category: 'for-him' },
  { slug: 'for-her', title: 'For Her', tagline: 'Elegant. Timeless.', category: 'for-her' },
  { slug: 'unisex', title: 'Unisex', tagline: 'Unbound. Unique.', category: 'unisex' },
  { slug: 'gift-sets', title: 'Gift Sets', tagline: 'Luxury, wrapped.', giftSets: true },
];

export const categoryLabels: Record<Category, string> = {
  'for-him': 'For Him',
  'for-her': 'For Her',
  unisex: 'Unisex',
};

const IMG = '/images/placeholder';
const bottles = ['bottle-a', 'bottle-b', 'bottle-c'];
const DEMO_DATE = Date.UTC(2026, 10, 17);

const demoReviews = (slug: string) => [
  {
    id: `${slug}-r1`,
    author: 'Demo Customer',
    rating: 5,
    title: 'Sample review',
    body: 'Placeholder review text used only to preview the layout. Replace with real customer feedback.',
    isDemo: true,
  },
  {
    id: `${slug}-r2`,
    author: 'Demo Customer',
    rating: 4,
    title: 'Sample review',
    body: 'Another placeholder review for layout purposes. This is not real customer feedback.',
    isDemo: true,
  },
];

function demoFragrance(
  n: number,
  category: Category,
  opts: { bestSeller?: boolean; signature?: boolean; availability?: Product['availability'] } = {},
): Product {
  const num = String(n).padStart(2, '0');
  const slug = `demo-fragrance-${num}`;
  const name = `Demo Fragrance ${num}`;
  const bottle = bottles[(n - 1) % bottles.length];
  const base = 10000 + (n % 3) * 2000; // DEMO price
  return {
    id: slug,
    slug,
    name,
    category,
    isGiftSet: false,
    shortDescription:
      'Demo product — placeholder description. Real fragrance details will be added once inventory is provided.',
    description: [
      'This is demo content. Replace this paragraph with the real product description once inventory information is available.',
      'No real fragrance name, composition or pricing is represented by this placeholder entry.',
    ],
    sizes: [
      { label: '50ml', price: base },
      { label: '100ml', price: base + 6000 },
    ],
    availability: opts.availability ?? 'in_stock',
    published: true,
    bestSeller: opts.bestSeller ?? false,
    signature: opts.signature ?? false,
    images: [
      { src: `${IMG}/${bottle}.svg`, alt: `${name} — demo bottle image` },
      { src: `${IMG}/box.svg`, alt: `${name} — demo packaging image` },
      { src: `${IMG}/detail.svg`, alt: `${name} — demo detail image` },
    ],
    notes: {
      top: ['Demo top note A', 'Demo top note B'],
      middle: ['Demo heart note A', 'Demo heart note B'],
      base: ['Demo base note A', 'Demo base note B'],
    },
    specifications: [
      { label: 'Concentration', value: 'To be provided' },
      { label: 'Fragrance family', value: 'To be provided' },
      { label: 'Country of origin', value: 'To be provided' },
    ],
    reviews: n <= 3 ? demoReviews(slug) : [],
    isDemo: true,
    createdAt: DEMO_DATE - n * 1000,
  };
}

function demoGiftSet(n: number): Product {
  const num = String(n).padStart(2, '0');
  const slug = `demo-gift-set-${num}`;
  const name = `Demo Gift Set ${num}`;
  return {
    id: slug,
    slug,
    name,
    category: (['for-him', 'for-her', 'unisex'] as const)[(n - 1) % 3],
    isGiftSet: true,
    shortDescription: 'Demo gift set — placeholder description until real sets are provided.',
    description: [
      'This is demo content for a gift set. Replace with the real set contents and description.',
    ],
    sizes: [{ label: 'Gift set', price: 28000 + n * 2000 }], // DEMO price
    availability: 'in_stock',
    published: true,
    bestSeller: false,
    signature: false,
    images: [
      { src: `${IMG}/box.svg`, alt: `${name} — demo gift box image` },
      { src: `${IMG}/${bottles[n % bottles.length]}.svg`, alt: `${name} — demo bottle image` },
    ],
    notes: {
      top: ['Demo top note A'],
      middle: ['Demo heart note A'],
      base: ['Demo base note A'],
    },
    specifications: [
      { label: 'Contents', value: 'To be provided' },
      { label: 'Packaging', value: 'To be provided' },
    ],
    reviews: [],
    isDemo: true,
    createdAt: DEMO_DATE - (20 + n) * 1000,
  };
}

export const seedProducts: Product[] = [
  demoFragrance(1, 'for-him', { bestSeller: true }),
  demoFragrance(2, 'for-him', { bestSeller: true }),
  demoFragrance(3, 'for-him', { signature: true }),
  demoFragrance(4, 'for-her', { bestSeller: true }),
  demoFragrance(5, 'for-her', { bestSeller: true, availability: 'low_stock' }),
  demoFragrance(6, 'for-her', { signature: true }),
  demoFragrance(7, 'unisex', { bestSeller: true }),
  demoFragrance(8, 'unisex', { bestSeller: true }),
  demoFragrance(9, 'unisex', { signature: true, availability: 'out_of_stock' }),
  demoGiftSet(1),
  demoGiftSet(2),
  demoGiftSet(3),
];

export const demoTestimonials: Testimonial[] = [
  {
    id: 't1',
    author: 'Demo Customer',
    quote: 'Placeholder testimonial. Real customer words will appear here once collected.',
    isDemo: true,
  },
  {
    id: 't2',
    author: 'Demo Customer',
    quote: 'Placeholder testimonial. This section previews the layout only.',
    isDemo: true,
  },
  {
    id: 't3',
    author: 'Demo Customer',
    quote: 'Placeholder testimonial. Replace with genuine feedback before launch.',
    isDemo: true,
  },
];
