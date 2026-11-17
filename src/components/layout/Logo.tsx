import Link from 'next/link';
import { Crown } from 'lucide-react';

export default function Logo() {
  return (
    <Link href="/" aria-label="Maison Alvaro — home" className="flex items-center gap-3">
      <span className="relative grid h-11 w-11 place-items-center border border-gold/60 font-serif text-2xl text-gold">
        <Crown className="absolute -top-2 h-3.5 w-3.5 bg-obsidian px-0.5" aria-hidden />
        MA
      </span>
      <span className="leading-none">
        <span className="block font-serif text-lg tracking-[0.16em] text-gold sm:text-xl">
          MAISON ALVARO
        </span>
        <span className="mt-1.5 hidden text-[8px] uppercase tracking-[0.32em] text-ivory/60 sm:block">
          Luxury, you can feel
        </span>
      </span>
    </Link>
  );
}
