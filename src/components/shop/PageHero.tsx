export default function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="border-b border-gold/20 bg-espresso/30 py-16 sm:py-20">
      <div className="container-luxe text-center">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-4 font-serif text-5xl sm:text-6xl">{title}</h1>
        <div className="mx-auto mt-6 h-px w-24 bg-gold/60" aria-hidden />
        {subtitle && <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-ivory/65">{subtitle}</p>}
      </div>
    </section>
  );
}
