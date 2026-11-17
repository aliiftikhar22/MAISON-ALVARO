'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { ShoppingBag, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPKR } from '@/lib/format';
import CartLineRow from './CartLineRow';

export default function CartDrawer() {
  const { isOpen, close, lines, subtotal, deliveryFee, total } = useCart();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, close]);

  if (!isOpen) return null;
  const blocked = lines.some((l) => !l.available);

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal aria-label="Shopping bag">
      <div className="absolute inset-0 bg-black/70" onClick={close} aria-hidden />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md animate-slide-in flex-col border-l border-gold/30 bg-obsidian">
        <div className="flex items-center justify-between border-b border-ivory/10 px-6 py-5">
          <h2 className="font-serif text-2xl">Shopping Bag</h2>
          <button onClick={close} aria-label="Close bag" className="p-2 text-ivory/70 hover:text-gold">
            <X className="h-5 w-5" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
            <ShoppingBag className="h-10 w-10 text-gold/60" strokeWidth={1.2} />
            <p className="font-serif text-2xl">Your bag is empty</p>
            <p className="text-sm text-ivory/55">Discover a fragrance you can feel.</p>
            <Link href="/shop/" onClick={close} className="btn-outline mt-2">
              Explore Fragrances
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-ivory/10 overflow-y-auto px-6">
              {lines.map((line) => (
                <CartLineRow key={line.key} line={line} onNavigate={close} />
              ))}
            </ul>
            <div className="space-y-3 border-t border-ivory/10 px-6 py-6">
              <div className="flex justify-between text-sm text-ivory/70">
                <span>Subtotal</span>
                <span>{formatPKR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-ivory/70">
                <span>Delivery</span>
                <span>{deliveryFee === 0 ? 'Free' : formatPKR(deliveryFee)}</span>
              </div>
              <div className="flex justify-between border-t border-ivory/10 pt-3 font-serif text-2xl">
                <span>Total</span>
                <span className="text-gold">{formatPKR(total)}</span>
              </div>
              <p className="text-[11px] uppercase tracking-wide2 text-ivory/45">Payment: Cash on Delivery</p>
              {blocked ? (
                <p className="text-xs text-[#e0636a]">Remove out-of-stock items to continue to checkout.</p>
              ) : (
                <Link href="/checkout/" onClick={close} className="btn-gold w-full">
                  Checkout
                </Link>
              )}
              <Link href="/cart/" onClick={close} className="btn-outline w-full">
                View Bag
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
