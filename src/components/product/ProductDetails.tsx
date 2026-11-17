import type { FragranceNotes, Product } from '@/types';

function NoteRow({ label, notes }: { label: string; notes: string[] }) {
  if (!notes.length) return null;
  return (
    <div className="grid grid-cols-[96px_1fr] items-baseline gap-4 border-b border-obsidian/10 py-5 last:border-b-0">
      <dt className="text-[11px] uppercase tracking-luxe text-gold-deep">{label}</dt>
      <dd className="flex flex-wrap gap-2">
        {notes.map((n) => (
          <span key={n} className="border border-obsidian/20 px-3 py-1.5 font-serif text-lg">
            {n}
          </span>
        ))}
      </dd>
    </div>
  );
}

export function FragranceNotesBlock({ notes }: { notes: FragranceNotes }) {
  if (!notes.top.length && !notes.middle.length && !notes.base.length) return null;
  return (
    <div>
      <h3 className="font-serif text-3xl">Fragrance notes</h3>
      <dl className="mt-4 border-t border-obsidian/15">
        <NoteRow label="Top" notes={notes.top} />
        <NoteRow label="Middle" notes={notes.middle} />
        <NoteRow label="Base" notes={notes.base} />
      </dl>
    </div>
  );
}

/** Light (Champagne Ivory) section: description, notes, ingredients, specifications. */
export default function ProductDetails({ product }: { product: Product }) {
  return (
    <section className="bg-ivory py-16 text-obsidian sm:py-24" aria-labelledby="details-heading">
      <div className="container-luxe grid gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="eyebrow !text-gold-deep">The fragrance</p>
          <h2 id="details-heading" className="mt-3 font-serif text-4xl sm:text-5xl">
            Description
          </h2>
          <div className="mt-6 h-px w-20 bg-gold-deep/60" aria-hidden />
          <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-obsidian/75">
            {product.description.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {product.ingredients && (
            <div className="mt-12">
              <h3 className="font-serif text-3xl">Ingredients</h3>
              <p className="mt-4 text-sm leading-relaxed text-obsidian/70">{product.ingredients}</p>
            </div>
          )}
        </div>

        <div className="space-y-14">
          <FragranceNotesBlock notes={product.notes} />

          {product.specifications.length > 0 && (
            <div>
              <h3 className="font-serif text-3xl">Specifications</h3>
              <dl className="mt-4 border-t border-obsidian/15">
                {product.specifications.map((s) => (
                  <div
                    key={s.label}
                    className="grid grid-cols-[1fr_1.2fr] gap-4 border-b border-obsidian/10 py-4 text-sm"
                  >
                    <dt className="text-obsidian/55">{s.label}</dt>
                    <dd>{s.value}</dd>
                  </div>
                ))}
                <div className="grid grid-cols-[1fr_1.2fr] gap-4 border-b border-obsidian/10 py-4 text-sm">
                  <dt className="text-obsidian/55">Available sizes</dt>
                  <dd>{product.sizes.map((s) => s.label).join(', ')}</dd>
                </div>
              </dl>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
