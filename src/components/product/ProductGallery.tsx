'use client';

import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import type { ProductImage } from '@/types';
import { FALLBACK_IMAGE } from './ProductCard';

export default function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const list = images.length ? images : [{ src: FALLBACK_IMAGE, alt: name }];
  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [origin, setOrigin] = useState('50% 50%');
  const [lightbox, setLightbox] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  const current = list[Math.min(index, list.length - 1)];
  const go = useCallback(
    (dir: 1 | -1) => {
      setIndex((i) => (i + dir + list.length) % list.length);
      setZoomed(false);
    },
    [list.length],
  );

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(false);
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightbox, go]);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  }

  return (
    <div className="flex flex-col-reverse gap-4 lg:flex-row">
      {list.length > 1 && (
        <div
          className="flex gap-3 overflow-x-auto lg:max-h-[640px] lg:w-20 lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden"
          role="tablist"
          aria-label="Product images"
        >
          {list.map((img, i) => (
            <button
              key={img.src + i}
              role="tab"
              aria-selected={i === index}
              aria-label={`Show image ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-20 w-16 shrink-0 overflow-hidden border transition-colors lg:h-24 lg:w-20 ${
                i === index ? 'border-gold' : 'border-ivory/15 hover:border-gold/60'
              }`}
            >
              <img src={img.src} alt="" className="h-full w-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      <div className="relative flex-1">
        <div
          className="relative aspect-[4/5] cursor-zoom-in overflow-hidden border border-gold/25 bg-espresso/40"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onMouseMove={onMove}
          onClick={() => setLightbox(true)}
        >
          <img
            src={current.src}
            alt={current.alt || name}
            className="h-full w-full object-cover transition-transform duration-300 ease-out"
            style={{
              transform: hovering ? 'scale(2)' : 'scale(1)',
              transformOrigin: origin,
            }}
          />
        </div>
        <button
          onClick={() => setLightbox(true)}
          aria-label="Open image viewer"
          className="absolute right-3 top-3 grid h-10 w-10 place-items-center bg-obsidian/80 text-ivory/80 transition-colors hover:text-gold"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        {list.length > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center bg-obsidian/70 text-ivory/80 hover:text-gold lg:hidden"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center bg-obsidian/70 text-ivory/80 hover:text-gold lg:hidden"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-[90] bg-black/95" role="dialog" aria-modal aria-label="Image viewer">
          <button
            onClick={() => setLightbox(false)}
            aria-label="Close viewer"
            className="absolute right-4 top-4 z-10 p-3 text-ivory/80 hover:text-gold"
          >
            <X className="h-7 w-7" />
          </button>
          {list.length > 1 && (
            <>
              <button
                onClick={() => go(-1)}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 z-10 -translate-y-1/2 p-3 text-ivory/80 hover:text-gold"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                onClick={() => go(1)}
                aria-label="Next image"
                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 p-3 text-ivory/80 hover:text-gold"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}
          <div className="h-full w-full overflow-auto">
            <div className={`flex min-h-full items-center justify-center ${zoomed ? '' : 'p-6'}`}>
              <img
                src={current.src}
                alt={current.alt || name}
                onClick={() => setZoomed((z) => !z)}
                className={`${
                  zoomed ? 'w-[200%] max-w-none cursor-zoom-out sm:w-[160%]' : 'max-h-[90vh] max-w-full cursor-zoom-in'
                } object-contain`}
              />
            </div>
          </div>
          <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-luxe text-ivory/50">
            {index + 1} / {list.length} · Click image to {zoomed ? 'zoom out' : 'zoom in'}
          </p>
        </div>
      )}
    </div>
  );
}
