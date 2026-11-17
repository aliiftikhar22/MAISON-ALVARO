import type { Metadata } from 'next';
import PageHero from '@/components/shop/PageHero';
import CollectionGrid from '@/components/home/CollectionGrid';

export const metadata: Metadata = {
  title: 'Collections',
  description: 'Shop Maison Alvaro by collection — For Him, For Her, Unisex and Gift Sets.',
  alternates: { canonical: '/collections/' },
};

export default function CollectionsPage() {
  return (
    <main>
      <PageHero eyebrow="Maison Alvaro" title="Collections" subtitle="Find the fragrance that feels like you." />
      <div className="container-luxe py-16">
        <CollectionGrid includeGiftSets />
      </div>
    </main>
  );
}
