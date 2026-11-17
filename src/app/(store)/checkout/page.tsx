import type { Metadata } from 'next';
import Link from 'next/link';
import CheckoutForm from '@/components/checkout/CheckoutForm';

export const metadata: Metadata = {
  title: 'Checkout',
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <main className="container-luxe py-14 sm:py-20">
      <Link href="/cart/" className="text-[11px] uppercase tracking-wide2 text-ivory/50 hover:text-gold">
        ← Back to bag
      </Link>
      <h1 className="mt-5 font-serif text-5xl">Checkout</h1>
      <div className="mb-12 mt-6 h-px w-24 bg-gold/60" aria-hidden />
      <CheckoutForm />
    </main>
  );
}
