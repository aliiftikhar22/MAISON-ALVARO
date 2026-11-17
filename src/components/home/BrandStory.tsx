import Link from 'next/link';

/** Light (Champagne Ivory) section. Copy is intentionally generic — real brand story to be supplied. */
export default function BrandStory() {
  return (
    <section className="bg-ivory py-20 text-obsidian sm:py-28">
      <div className="container-luxe grid items-center gap-14 lg:grid-cols-2">
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="aspect-[4/5] overflow-hidden bg-obsidian">
            <img
              src="/brand/logo.jpg"
              alt="Maison Alvaro monogram"
              loading="lazy"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="absolute -bottom-4 -right-4 hidden h-full w-full border border-gold-deep/60 sm:block" aria-hidden />
        </div>
        <div>
          <p className="eyebrow !text-gold-deep">The House</p>
          <h2 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
            A fragrance beyond <em className="italic text-crimson">the ordinary</em>
          </h2>
          <div className="mt-6 h-px w-24 bg-gold-deep/60" aria-hidden />
          <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-obsidian/75">
            <p>
              Maison Alvaro was created around a single promise: luxury you can feel. Every
              fragrance is meant to be worn, remembered and returned to.
            </p>
            <p className="text-sm italic text-obsidian/50">
              Placeholder copy — the full brand story will be added once it is provided.
            </p>
          </div>
          <Link href="/about/" className="btn-outline-dark mt-10">
            Discover the house
          </Link>
        </div>
      </div>
    </section>
  );
}
