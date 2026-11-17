import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { collections } from '@/data/seed';

const art: Record<string, string> = {
  'for-him': '/images/placeholder/bottle-c.svg',
  'for-her': '/images/placeholder/bottle-b.svg',
  unisex: '/images/placeholder/bottle-a.svg',
  'gift-sets': '/images/placeholder/box.svg',
};

export default function CollectionGrid({ includeGiftSets = false }: { includeGiftSets?: boolean }) {
  const items = collections.filter((c) => includeGiftSets || !c.giftSets);
  return (
    <div className={`grid gap-5 sm:grid-cols-2 ${items.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
      {items.map((c) => (
        <Link
          key={c.slug}
          href={`/collections/${c.slug}/`}
          className="group relative flex min-h-[180px] items-center overflow-hidden border border-gold/40 bg-obsidian transition-colors duration-500 hover:border-gold"
        >
          <img
            src={art[c.slug]}
            alt=""
            loading="lazy"
            className="h-full w-2/5 self-stretch object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
          />
          <div className="flex-1 px-6 py-6">
            <h3 className="font-serif text-3xl">{c.title}</h3>
            <p className="mt-2 text-[10px] uppercase tracking-luxe text-ivory/60">{c.tagline}</p>
            <span className="mt-5 inline-flex items-center gap-2 border-b border-gold/60 pb-1 text-[10px] uppercase tracking-luxe text-gold transition-all group-hover:gap-3">
              Shop now <ArrowRight className="h-3 w-3" aria-hidden />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
