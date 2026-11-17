import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-gold/20 bg-obsidian">
      {/* Neutral stage: espresso glow + crimson accent, no photography yet */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            'radial-gradient(60% 70% at 75% 50%, rgba(48,32,27,0.95) 0%, rgba(9,7,7,0) 70%), radial-gradient(30% 40% at 95% 20%, rgba(158,23,29,0.35) 0%, rgba(9,7,7,0) 70%)',
        }}
      />
      <div className="container-luxe relative grid min-h-[560px] items-center gap-10 py-16 lg:min-h-[640px] lg:grid-cols-[1.05fr_1fr] lg:py-0">
        <div className="animate-fade-up">
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-gold/60" aria-hidden />
            <p className="eyebrow">Maison Alvaro</p>
          </div>
          <h1 className="mt-8 font-serif text-6xl leading-[0.98] sm:text-7xl lg:text-[5.5rem]">
            <span className="block text-gold">Luxury,</span>
            <span className="block text-ivory">You Can Feel.</span>
          </h1>
          <div className="mt-8 flex items-center gap-4">
            <span className="h-px w-10 bg-gold/50" aria-hidden />
            <p className="text-[11px] uppercase tracking-luxe text-ivory/75">
              A fragrance beyond the ordinary
            </p>
          </div>
          <Link href="/shop/" className="btn-outline mt-10">
            Explore Collection
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[460px] border border-gold/30">
            <img
  src="/images/hero-banner.jpeg"
  alt="Maison Alvaro luxury perfume collection"
  className="h-full w-full object-cover"
/>
          </div>
        </div>
      </div>
    </section>
  );
}
