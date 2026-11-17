import Link from 'next/link';
import { AlertTriangle, PackageX, SearchX } from 'lucide-react';

export function ProductSkeleton() {
  return (
    <main className="container-luxe py-12" aria-busy="true" aria-label="Loading product">
      <div className="mb-10 h-3 w-56 animate-pulse-soft bg-espresso/70" />
      <div className="grid gap-12 lg:grid-cols-2">
        <div className="flex gap-4">
          <div className="hidden w-20 space-y-3 lg:block">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-24 animate-pulse-soft bg-espresso/60" />
            ))}
          </div>
          <div className="aspect-[4/5] flex-1 animate-pulse-soft border border-gold/10 bg-espresso/50" />
        </div>
        <div className="space-y-5">
          <div className="h-3 w-24 animate-pulse-soft bg-espresso/70" />
          <div className="h-12 w-3/4 animate-pulse-soft bg-espresso/70" />
          <div className="h-8 w-40 animate-pulse-soft bg-espresso/70" />
          <div className="h-24 w-full animate-pulse-soft bg-espresso/50" />
          <div className="h-14 w-full animate-pulse-soft bg-espresso/50" />
        </div>
      </div>
    </main>
  );
}

function StateShell({
  icon,
  title,
  body,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  children?: React.ReactNode;
}) {
  return (
    <main className="container-luxe flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <div className="text-gold" aria-hidden>
        {icon}
      </div>
      <h1 className="mt-6 font-serif text-4xl sm:text-5xl">{title}</h1>
      <div className="mt-6 h-px w-20 bg-gold/60" aria-hidden />
      <p className="mt-6 max-w-md text-sm leading-relaxed text-ivory/65">{body}</p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">{children}</div>
    </main>
  );
}

export function ProductNotFound() {
  return (
    <StateShell
      icon={<SearchX className="h-10 w-10" strokeWidth={1.2} />}
      title="Fragrance not found"
      body="We couldn’t find the fragrance you’re looking for. It may have been moved or the link may be incorrect."
    >
      <Link href="/shop/" className="btn-gold">
        Browse all fragrances
      </Link>
    </StateShell>
  );
}

export function ProductUnavailable() {
  return (
    <StateShell
      icon={<PackageX className="h-10 w-10" strokeWidth={1.2} />}
      title="Currently unavailable"
      body="This fragrance isn’t available at the moment. Explore the rest of the collection while we update our offering."
    >
      <Link href="/shop/" className="btn-gold">
        Browse all fragrances
      </Link>
    </StateShell>
  );
}

export function ProductLoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <StateShell
      icon={<AlertTriangle className="h-10 w-10" strokeWidth={1.2} />}
      title="Something went wrong"
      body="We couldn’t load this fragrance. Please check your connection and try again."
    >
      <button onClick={onRetry} className="btn-gold">
        Try again
      </button>
      <Link href="/shop/" className="btn-outline">
        Back to shop
      </Link>
    </StateShell>
  );
}
