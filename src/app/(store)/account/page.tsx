import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/shop/PageHero';

export const metadata: Metadata = {
  title: 'Account',
  robots: { index: false, follow: true },
};

export default function AccountPage() {
  return (
    <main>
      <PageHero eyebrow="Maison Alvaro" title="Your Account" />
      <section className="container-luxe py-16 sm:py-24">
        <div className="mx-auto max-w-xl border border-gold/25 p-10 text-center">
          <p className="font-serif text-3xl">Guest checkout</p>
          <p className="mt-4 text-sm leading-relaxed text-ivory/60">
            Customer accounts are not available yet. You can order as a guest — pay in cash when your
            order arrives.
          </p>
          <Link href="/shop/" className="btn-gold mt-8">
            Explore Fragrances
          </Link>
        </div>
      </section>
    </main>
  );
}
