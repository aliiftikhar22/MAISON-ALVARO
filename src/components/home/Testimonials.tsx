import { Quote } from 'lucide-react';
import { demoTestimonials } from '@/data/seed';
import SectionHeading from '@/components/ui/SectionHeading';

/** Placeholder testimonials, clearly labelled. Replace with real customer feedback before launch. */
export default function Testimonials() {
  return (
    <section className="bg-obsidian py-20 sm:py-28">
      <div className="container-luxe">
        <SectionHeading eyebrow="Kind words" title="What our customers say" />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {demoTestimonials.map((t) => (
            <figure key={t.id} className="relative border border-gold/25 px-8 py-10">
              <Quote className="h-6 w-6 text-gold/60" aria-hidden />
              <blockquote className="mt-5 font-serif text-xl leading-relaxed text-ivory/90">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 flex items-center justify-between text-xs uppercase tracking-wide2 text-ivory/50">
                <span>{t.author}</span>
                {t.isDemo && <span className="text-gold/70">Placeholder</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
