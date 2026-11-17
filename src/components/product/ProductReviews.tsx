import { Star } from 'lucide-react';
import type { Review } from '@/types';

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`h-4 w-4 ${n <= rating ? 'fill-gold text-gold' : 'text-ivory/25'}`}
          aria-hidden
        />
      ))}
    </span>
  );
}

export default function ProductReviews({ reviews }: { reviews: Review[] }) {
  const average = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const allDemo = reviews.length > 0 && reviews.every((r) => r.isDemo);

  return (
    <section className="bg-obsidian py-16 sm:py-24" aria-labelledby="reviews-heading">
      <div className="container-luxe">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Customer reviews</p>
            <h2 id="reviews-heading" className="mt-3 font-serif text-4xl sm:text-5xl">
              Reviews
            </h2>
          </div>
          {reviews.length > 0 && (
            <div className="flex items-center gap-3">
              <Stars rating={Math.round(average)} />
              <span className="text-sm text-ivory/70">
                {average.toFixed(1)} · {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </span>
            </div>
          )}
        </div>
        <div className="mt-6 h-px w-full bg-ivory/10" aria-hidden />

        {allDemo && (
          <p className="mt-6 text-xs uppercase tracking-wide2 text-gold/80">
            Sample reviews shown for layout only — not real customer feedback.
          </p>
        )}

        {reviews.length === 0 ? (
          <p className="mt-10 text-center font-serif text-2xl text-ivory/60">No reviews yet.</p>
        ) : (
          <ul className="mt-8 grid gap-6 md:grid-cols-2">
            {reviews.map((r) => (
              <li key={r.id} className="border border-ivory/10 p-7">
                <div className="flex items-center justify-between">
                  <Stars rating={r.rating} />
                  {r.isDemo && (
                    <span className="text-[10px] uppercase tracking-wide2 text-gold/70">Sample</span>
                  )}
                </div>
                {r.title && <h3 className="mt-4 font-serif text-xl">{r.title}</h3>}
                <p className="mt-2 text-sm leading-relaxed text-ivory/70">{r.body}</p>
                <p className="mt-5 text-xs uppercase tracking-wide2 text-ivory/45">
                  {r.author}
                  {r.date ? ` · ${r.date}` : ''}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
