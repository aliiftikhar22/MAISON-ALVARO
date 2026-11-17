interface Props {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: 'center' | 'left';
  tone?: 'dark' | 'light';
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  tone = 'dark',
}: Props) {
  const light = tone === 'light';
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow && <p className={`eyebrow ${light ? '!text-gold-deep' : ''}`}>{eyebrow}</p>}
      <h2
        className={`mt-3 font-serif text-4xl leading-tight sm:text-5xl ${
          light ? 'text-obsidian' : 'text-ivory'
        }`}
      >
        {title}
      </h2>
      <div
        className={`mt-5 h-px w-24 bg-gold/60 ${align === 'center' ? 'mx-auto' : ''}`}
        aria-hidden
      />
      {subtitle && (
        <p className={`mt-5 text-sm leading-relaxed ${light ? 'text-obsidian/70' : 'text-ivory/65'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
