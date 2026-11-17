'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useState } from 'react';
import { ChevronDown, Menu, Search, ShoppingBag, User } from 'lucide-react';
import { collections } from '@/data/seed';
import { useCart } from '@/context/CartContext';
import Logo from './Logo';
import MobileMenu from './MobileMenu';
import SearchOverlay from './SearchOverlay';

interface NavItem {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
}

const nav: NavItem[] = [
  { href: '/', label: 'Home' },
  {
    href: '/shop/',
    label: 'Shop',
    children: [
      { href: '/shop/', label: 'All Fragrances' },
      { href: '/collections/gift-sets/', label: 'Gift Sets' },
    ],
  },
  {
    href: '/collections/',
    label: 'Collections',
    children: collections
      .filter((c) => !c.giftSets)
      .map((c) => ({ href: `/collections/${c.slug}/`, label: c.title })),
  },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
];

export default function Header() {
  const pathname = usePathname();
  const { count, hydrated, open } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href.replace(/\/$/, ''));

  return (
    <header className="sticky top-0 z-50 border-b border-gold/30 bg-obsidian/95">
      <div className="container-luxe flex h-20 items-center justify-between gap-6">
        <div className="flex items-center gap-4 lg:hidden">
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="p-2 text-ivory/85 hover:text-gold"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <div className="max-lg:absolute max-lg:left-1/2 max-lg:-translate-x-1/2">
          <Logo />
        </div>

        <nav className="hidden items-center gap-9 lg:flex" aria-label="Primary">
          {nav.map((item) => (
            <div key={item.label} className="group relative">
              <Link
                href={item.href}
                className={`flex items-center gap-1.5 py-2 text-[13px] tracking-wide transition-colors hover:text-gold ${
                  isActive(item.href) ? 'text-gold' : 'text-ivory/90'
                }`}
              >
                {item.label}
                {item.children && <ChevronDown className="h-3.5 w-3.5 opacity-70" aria-hidden />}
              </Link>
              {isActive(item.href) && (
                <span className="absolute -bottom-0.5 left-0 h-px w-full bg-gold" aria-hidden />
              )}
              {item.children && (
                <div className="invisible absolute left-1/2 top-full z-10 -translate-x-1/2 pt-5 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <ul className="min-w-[210px] border border-gold/30 bg-obsidian py-3 shadow-2xl shadow-black/60">
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link
                          href={c.href}
                          className="block px-6 py-2.5 text-[13px] text-ivory/85 transition-colors hover:bg-espresso/60 hover:text-gold"
                        >
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-3">
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className="p-2.5 text-ivory/85 transition-colors hover:text-gold"
          >
            <Search className="h-[22px] w-[22px]" strokeWidth={1.5} />
          </button>
          <Link
            href="/account/"
            aria-label="Account"
            className="hidden p-2.5 text-ivory/85 transition-colors hover:text-gold sm:block"
          >
            <User className="h-[22px] w-[22px]" strokeWidth={1.5} />
          </Link>
          <button
            onClick={open}
            aria-label={`Shopping bag, ${hydrated ? count : 0} items`}
            className="relative p-2.5 text-ivory/85 transition-colors hover:text-gold"
          >
            <ShoppingBag className="h-[22px] w-[22px]" strokeWidth={1.5} />
            <span className="absolute right-0 top-0 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-gold px-1 text-[10px] font-semibold text-obsidian">
              {hydrated ? count : 0}
            </span>
          </button>
        </div>
      </div>

      {menuOpen && <MobileMenu onClose={closeMenu} />}
      {searchOpen && <SearchOverlay onClose={closeSearch} />}
    </header>
  );
}
