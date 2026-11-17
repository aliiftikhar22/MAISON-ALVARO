import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/shop/PageHero';

export const metadata: Metadata = {
  title: 'About',
  description: 'The house of Maison Alvaro — luxury, you can feel.',
  alternates: { canonical: '/about/' },
};

export default function AboutPage() {
  return (
    <main>
      <PageHero eyebrow="The House" title="About Maison Alvaro" subtitle="Luxury, you can feel." />
      <section className="container-luxe grid items-center gap-14 py-16 sm:py-24 lg:grid-cols-2">
        <img
          src="/brand/logo.jpg"
          alt="Maison Alvaro monogram"
          className="mx-auto w-full max-w-md border border-gold/20"
        />
        <div className="space-y-5 text-[15px] leading-relaxed text-ivory/75">
          <p>
            Maison Alvaro was created around a single promise: luxury you can feel. Every fragrance
            is meant to be worn, remembered and returned to.
          </p>
          <p className="text-sm italic text-ivory/45">
            Placeholder copy — the full brand story, founding details and craftsmanship notes will be
            added once they are provided.
          </p>
          <Link href="/shop/" className="btn-gold mt-4">
            Explore the collection
          </Link>
        </div>
      </section>
    </main>
  );
}
