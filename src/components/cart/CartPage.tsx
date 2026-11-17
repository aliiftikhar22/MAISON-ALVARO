'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCatalog } from '@/context/CatalogContext';
import { formatPKR } from '@/lib/format';
import CartLineRow from './CartLineRow';

export default function CartPage() {
  const { lines, subtotal, deliveryFee, total, hydrated } = useCart();
  const { status } = useCatalog();

  if (!hydrated || status === 'loading') {
    return (
      <div className="space-y-4" aria-busy="true">
        {[0, 1].map((i) => (
          <div key={i} className="h-32 animate-pulse-soft bg-espresso/50" />
        ))}
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center py-20 text-center">
        <ShoppingBag className="h-12 w-12 text-gold/60" strokeWidth={1.2} />
        <p className="mt-6 font-serif text-3xl">Your bag is empty</p>
        <p className="mt-3 text-sm text-ivory/55">Discover a fragrance you can feel.</p>
        <Link href="/shop/" className="btn-gold mt-8">
          Explore Fragrances
        </Link>
      </div>
    );
  }

  const blocked = lines.some((l) => !l.available);

  return (
    <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
      <ul className="divide-y divide-ivory/10 border-y border-ivory/10">
        {lines.map((line) => (
          <CartLineRow key={line.key} line={line} />
        ))}
      </ul>

      <aside className="h-fit border border-gold/25 p-7">
        <h2 className="font-serif text-2xl">Order Summary</h2>
        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between text-ivory/70">
            <dt>Subtotal</dt>
            <dd>{formatPKR(subtotal)}</dd>
          </div>
          <div className="flex justify-between text-ivory/70">
            <dt>Delivery</dt>
            <dd>{deliveryFee === 0 ? 'Free' : formatPKR(deliveryFee)}</dd>
          </div>
          <div className="flex justify-between border-t border-ivory/10 pt-4 font-serif text-2xl">
            <dt>Total</dt>
            <dd className="text-gold">{formatPKR(total)}</dd>
          </div>
        </dl>
        <p className="mt-4 text-[11px] uppercase tracking-wide2 text-ivory/45">Payment: Cash on Delivery</p>
        {blocked ? (
          <p className="mt-6 text-sm text-[#e0636a]">Remove out-of-stock items to continue to checkout.</p>
        ) : (
          <Link href="/checkout/" className="btn-gold mt-6 w-full">
            Proceed to Checkout
          </Link>
        )}
        <Link href="/shop/" className="mt-4 block text-center text-xs uppercase tracking-wide2 text-ivory/55 hover:text-gold">
          Continue shopping
        </Link>
      </aside>
    </div>
  );
}
