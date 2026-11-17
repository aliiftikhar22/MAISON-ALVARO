'use client';

import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { MAX_QTY, useCart, type CartLine } from '@/context/CartContext';
import { formatPKR } from '@/lib/format';
import QuantitySelector from '@/components/ui/QuantitySelector';

export default function CartLineRow({ line, onNavigate }: { line: CartLine; onNavigate?: () => void }) {
  const { setQuantity, remove } = useCart();
  const { product, size } = line;
  const href = `/products/${product.slug}/`;

  return (
    <li className="flex gap-4 py-5">
      <Link href={href} onClick={onNavigate} className="shrink-0">
        <img
          src={product.images[0]?.src}
          alt={product.images[0]?.alt ?? product.name}
          className="h-28 w-24 border border-gold/20 object-cover"
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link
              href={href}
              onClick={onNavigate}
              className="font-serif text-xl leading-tight text-ivory hover:text-gold"
            >
              {product.name}
            </Link>
            <p className="mt-1 text-xs uppercase tracking-wide2 text-ivory/50">{size.label}</p>
            {!line.available && (
              <p className="mt-1 text-xs text-[#e0636a]">Currently out of stock — remove to continue</p>
            )}
          </div>
          <button
            onClick={() => remove(line.key)}
            aria-label={`Remove ${product.name}`}
            className="p-1 text-ivory/45 transition-colors hover:text-crimson"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-auto flex items-end justify-between pt-3">
          <QuantitySelector
            size="sm"
            min={1}
            max={MAX_QTY}
            value={line.quantity}
            onChange={(q) => setQuantity(line.key, q)}
            label={`Quantity for ${product.name}`}
          />
          <div className="text-right">
            {line.quantity > 1 && (
              <p className="text-[11px] text-ivory/45">{formatPKR(line.unitPrice)} each</p>
            )}
            <p className="text-sm text-gold">{formatPKR(line.lineTotal)}</p>
          </div>
        </div>
      </div>
    </li>
  );
}
