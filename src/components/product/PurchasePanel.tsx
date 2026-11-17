'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Banknote, Check, Truck } from 'lucide-react';
import { categoryLabels, siteConfig } from '@/data/seed';
import { MAX_QTY, useCart } from '@/context/CartContext';
import { formatPKR } from '@/lib/format';
import type { Availability, Product } from '@/types';
import QuantitySelector from '@/components/ui/QuantitySelector';

const availabilityText: Record<Availability, { label: string; dot: string }> = {
  in_stock: { label: 'In stock', dot: 'bg-gold' },
  low_stock: { label: 'Low stock — order soon', dot: 'bg-gold-soft' },
  out_of_stock: { label: 'Out of stock', dot: 'bg-crimson' },
};

export default function PurchasePanel({ product }: { product: Product }) {
  const router = useRouter();
  const { add, open } = useCart();
  const [sizeLabel, setSizeLabel] = useState(product.sizes[0]?.label ?? '');
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const size = product.sizes.find((s) => s.label === sizeLabel) ?? product.sizes[0];
  const soldOut = product.availability === 'out_of_stock';
  const status = availabilityText[product.availability];

  function addToCart() {
    add(product.id, size.label, quantity);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1800);
    open();
  }

  function buyNow() {
    add(product.id, size.label, quantity);
    router.push('/checkout/');
  }

  return (
    <div className="lg:pt-2">
      <p className="eyebrow">{product.isGiftSet ? 'Gift Set' : categoryLabels[product.category]}</p>
      <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">{product.name}</h1>

      <div className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <p className="font-serif text-3xl text-gold">{formatPKR(size.price)}</p>
        {size.compareAtPrice && size.compareAtPrice > size.price && (
          <p className="text-sm text-ivory/45 line-through">{formatPKR(size.compareAtPrice)}</p>
        )}
      </div>

      <p className="mt-6 text-[15px] leading-relaxed text-ivory/75">{product.shortDescription}</p>

      <dl className="mt-7 grid grid-cols-2 gap-6 border-y border-ivory/10 py-6 text-sm">
        <div>
          <dt className="text-[11px] uppercase tracking-wide2 text-ivory/45">Availability</dt>
          <dd className="mt-2 flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${status.dot}`} aria-hidden />
            {status.label}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-wide2 text-ivory/45">Fragrance category</dt>
          <dd className="mt-2">{product.isGiftSet ? 'Gift Set' : categoryLabels[product.category]}</dd>
        </div>
      </dl>

      <fieldset className="mt-7">
        <legend className="text-[11px] uppercase tracking-wide2 text-ivory/45">
          Size: <span className="text-ivory">{size.label}</span>
        </legend>
        <div className="mt-3 flex flex-wrap gap-3">
          {product.sizes.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => setSizeLabel(s.label)}
              aria-pressed={s.label === size.label}
              className={`min-w-[96px] border px-5 py-3 text-sm transition-colors ${
                s.label === size.label
                  ? 'border-gold bg-gold/10 text-gold'
                  : 'border-ivory/25 text-ivory/80 hover:border-gold/60'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-7">
        <p className="mb-3 text-[11px] uppercase tracking-wide2 text-ivory/45">Quantity</p>
        <QuantitySelector value={quantity} onChange={setQuantity} max={MAX_QTY} disabled={soldOut} />
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <button onClick={addToCart} disabled={soldOut} className="btn-outline">
          {justAdded ? (
            <>
              <Check className="h-4 w-4" /> Added
            </>
          ) : soldOut ? (
            'Unavailable'
          ) : (
            'Add to Cart'
          )}
        </button>
        <button onClick={buyNow} disabled={soldOut} className="btn-gold">
          Buy Now
        </button>
      </div>

      <ul className="mt-9 space-y-4 border-t border-ivory/10 pt-7 text-sm text-ivory/70">
        <li className="flex gap-3">
          <Truck className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
          <span>
            {siteConfig.deliveryFee === 0
              ? 'Free delivery across Pakistan.'
              : `Delivery across Pakistan: ${formatPKR(siteConfig.deliveryFee)}.`}{' '}
            <span className="text-ivory/45">Delivery timeframe is confirmed when your order is processed.</span>
          </span>
        </li>
        <li className="flex gap-3">
          <Banknote className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
          <span>Payment: Cash on Delivery — pay when your order arrives.</span>
        </li>
      </ul>
    </div>
  );
}
