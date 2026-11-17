import type { Metadata } from 'next';
import PageHero from '@/components/shop/PageHero';
import ShopBrowser from '@/components/shop/ShopBrowser';

export const metadata: Metadata = {
  title: 'Shop All Fragrances',
  description: 'Browse every Maison Alvaro fragrance — for him, for her, unisex and gift sets.',
  alternates: { canonical: '/shop/' },
};

export default function ShopPage() {
  return (
    <main>
      <PageHero
        eyebrow="Maison Alvaro"
        title="The Collection"
        subtitle="Every fragrance, in one place. Select any fragrance to see its notes, sizes and details."
      />
      <div className="container-luxe py-12 sm:py-16">
        <ShopBrowser />
      </div>
    </main>
  );
}
