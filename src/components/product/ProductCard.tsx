import Link from 'next/link';
import { categoryLabels } from '@/data/seed';
import { formatPKR } from '@/lib/format';
import type { Product } from '@/types';

export const FALLBACK_IMAGE = '/images/placeholder/bottle-a.svg';

export default function ProductCard({ product }: { product: Product }) {
  const href = `/products/${product.slug}/`;
  const from = Math.min(...product.sizes.map((s) => s.price));
  const [first, second] = product.images;
  const soldOut = product.availability === 'out_of_stock';

  return (
    <article className="group">
      <Link href={href} aria-label={`View ${product.name}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden border border-gold/20 bg-espresso/40 transition-colors duration-500 group-hover:border-gold/60">
          <img
            src={first?.src ?? FALLBACK_IMAGE}
            alt={first?.alt ?? product.name}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:scale-[1.03] ${
              second ? 'group-hover:opacity-0' : ''
            } ${soldOut ? 'opacity-60' : ''}`}
          />
          {second && (
            <img
              src={second.src}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-700 group-hover:scale-[1.03] group-hover:opacity-100"
            />
          )}
          <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {product.isDemo && (
              <span className="bg-obsidian/80 px-2 py-1 text-[9px] uppercase tracking-wide2 text-ivory/70">
                Demo
              </span>
            )}
            {soldOut && (
              <span className="bg-crimson px-2 py-1 text-[9px] uppercase tracking-wide2 text-ivory">
                Out of stock
              </span>
            )}
            {product.availability === 'low_stock' && (
              <span className="bg-gold px-2 py-1 text-[9px] uppercase tracking-wide2 text-obsidian">
                Low stock
              </span>
            )}
          </div>
        </div>
        <div className="mt-5 text-center">
          <p className="text-[10px] uppercase tracking-luxe text-ivory/50">
            {product.isGiftSet ? 'Gift Set' : categoryLabels[product.category]}
          </p>
          <h3 className="mt-2 font-serif text-2xl leading-tight text-ivory transition-colors group-hover:text-gold">
            {product.name}
          </h3>
          <p className="mt-2 text-sm text-gold">
            {product.sizes.length > 1 ? 'From ' : ''}
            {formatPKR(from)}
          </p>
        </div>
      </Link>
    </article>
  );
}
