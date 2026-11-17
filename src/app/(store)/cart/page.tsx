import type { Metadata } from 'next';
import CartPage from '@/components/cart/CartPage';

export const metadata: Metadata = {
  title: 'Shopping Bag',
  robots: { index: false, follow: true },
};

export default function Cart() {
  return (
    <main className="container-luxe py-14 sm:py-20">
      <p className="eyebrow">Maison Alvaro</p>
      <h1 className="mt-3 font-serif text-5xl">Shopping Bag</h1>
      <div className="mb-10 mt-6 h-px w-24 bg-gold/60" aria-hidden />
      <CartPage />
    </main>
  );
}
