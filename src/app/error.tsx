'use client';

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="container-luxe flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="mt-4 font-serif text-5xl">We hit a snag</h1>
      <div className="mt-6 h-px w-20 bg-gold/60" aria-hidden />
      <p className="mt-6 max-w-md text-sm text-ivory/65">Please try again, or return to the homepage.</p>
      <div className="mt-10 flex gap-4">
        <button onClick={reset} className="btn-gold">
          Try again
        </button>
        <a href="/" className="btn-outline">
          Home
        </a>
      </div>
    </main>
  );
}
