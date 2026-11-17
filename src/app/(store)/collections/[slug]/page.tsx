import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { collections } from '@/data/seed';
import PageHero from '@/components/shop/PageHero';
import CollectionProducts from '@/components/shop/CollectionProducts';

export const dynamicParams = false;

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = collections.find((x) => x.slug === slug);
  if (!c) return {};
  return {
    title: `${c.title} Fragrances`,
    description: `Maison Alvaro ${c.title} collection — ${c.tagline}`,
    alternates: { canonical: `/collections/${c.slug}/` },
  };
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = collections.find((c) => c.slug === slug);
  if (!collection) notFound();

  return (
    <main>
      <PageHero eyebrow="Collection" title={collection.title} subtitle={collection.tagline} />
      <div className="container-luxe py-12 sm:py-16">
        <CollectionProducts collection={collection} />
      </div>
    </main>
  );
}
