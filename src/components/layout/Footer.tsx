import Link from 'next/link';
import { collections } from '@/data/seed';
import Newsletter from '@/components/home/Newsletter';

export default function Footer() {
  return (
    <footer className="border-t border-gold/30 bg-obsidian">
      <div className="container-luxe grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <img
            src="/brand/logo.jpg"
            alt="Maison Alvaro — Luxury, you can feel."
            className="h-40 w-40 object-contain"
          />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory/60">
            Luxury, you can feel.
          </p>
        </div>

        <div>
          <h3 className="eyebrow">Shop</h3>
          <ul className="mt-5 space-y-3 text-sm text-ivory/75">
            <li>
              <Link href="/shop/" className="link-underline hover:text-gold">
                All Fragrances
              </Link>
            </li>
            {collections.map((c) => (
              <li key={c.slug}>
                <Link href={`/collections/${c.slug}/`} className="link-underline hover:text-gold">
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="eyebrow">Maison Alvaro</h3>
          <ul className="mt-5 space-y-3 text-sm text-ivory/75">
            <li>
              <Link href="/about/" className="link-underline hover:text-gold">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact/" className="link-underline hover:text-gold">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/cart/" className="link-underline hover:text-gold">
                Shopping Bag
              </Link>
            </li>
          </ul>
          <p className="mt-8 text-xs uppercase tracking-wide2 text-gold/80">Payment</p>
          <p className="mt-2 text-sm text-ivory/70">Cash on Delivery</p>
        </div>

        <div>
          <h3 className="eyebrow">Newsletter</h3>
          <p className="mt-5 text-sm leading-relaxed text-ivory/60">
            Be first to hear about new fragrances and private releases.
          </p>
          <div className="mt-5">
            <Newsletter compact />
          </div>
        </div>
      </div>
      <div className="border-t border-ivory/10">
        <div className="container-luxe flex flex-col items-center justify-between gap-2 py-6 text-[11px] uppercase tracking-wide2 text-ivory/40 sm:flex-row">
          <p>© {new Date().getFullYear()} Maison Alvaro. All rights reserved.</p>
          <p>Free delivery across Pakistan</p>
        </div>
      </div>
    </footer>
  );
}
