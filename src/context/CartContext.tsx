'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { siteConfig } from '@/data/seed';
import { readJSON, STORAGE_KEYS, writeJSON } from '@/lib/storage';
import type { Product, ProductSize } from '@/types';
import { useCatalog } from './CatalogContext';

export const MAX_QTY = 10;

interface CartEntry {
  productId: string;
  size: string;
  quantity: number;
}

export interface CartLine {
  key: string;
  product: Product;
  size: ProductSize;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  /** False when the product is out of stock */
  available: boolean;
}

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  /** True once the saved cart has been read from the browser */
  hydrated: boolean;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (productId: string, size: string, quantity?: number) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const keyOf = (productId: string, size: string) => `${productId}::${size}`;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { products, status } = useCatalog();
  const [entries, setEntries] = useState<CartEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setOpen] = useState(false);

  // Load the saved cart once on the client.
  useEffect(() => {
    setEntries(readJSON<CartEntry[]>(STORAGE_KEYS.cart, []));
    setHydrated(true);
  }, []);

  // Persist whenever it changes.
  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEYS.cart, entries);
  }, [entries, hydrated]);

  const byId = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);

  // Drop items whose product/size no longer exists once the catalogue is known.
  useEffect(() => {
    if (!hydrated || status !== 'ready') return;
    setEntries((prev) => {
      const next = prev.filter((e) => byId.get(e.productId)?.sizes.some((s) => s.label === e.size));
      return next.length === prev.length ? prev : next;
    });
  }, [hydrated, status, byId]);

  // Lines always use LIVE catalogue data (price, image, availability).
  const lines = useMemo<CartLine[]>(
    () =>
      entries.flatMap((e) => {
        const product = byId.get(e.productId);
        const size = product?.sizes.find((s) => s.label === e.size);
        if (!product || !size) return [];
        return [
          {
            key: keyOf(e.productId, e.size),
            product,
            size,
            quantity: e.quantity,
            unitPrice: size.price,
            lineTotal: size.price * e.quantity,
            available: product.availability !== 'out_of_stock',
          },
        ];
      }),
    [entries, byId],
  );

  const add = useCallback((productId: string, size: string, quantity = 1) => {
    setEntries((prev) => {
      const existing = prev.find((e) => e.productId === productId && e.size === size);
      if (existing) {
        return prev.map((e) =>
          e === existing ? { ...e, quantity: Math.min(MAX_QTY, e.quantity + quantity) } : e,
        );
      }
      return [...prev, { productId, size, quantity: Math.min(MAX_QTY, Math.max(1, quantity)) }];
    });
  }, []);

  const setQuantity = useCallback((key: string, quantity: number) => {
    setEntries((prev) =>
      prev
        .map((e) => (keyOf(e.productId, e.size) === key ? { ...e, quantity: Math.min(MAX_QTY, quantity) } : e))
        .filter((e) => e.quantity > 0),
    );
  }, []);

  const remove = useCallback((key: string) => {
    setEntries((prev) => prev.filter((e) => keyOf(e.productId, e.size) !== key));
  }, []);

  const clear = useCallback(() => setEntries([]), []);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
    const deliveryFee = lines.length ? siteConfig.deliveryFee : 0;
    return {
      lines,
      count: lines.reduce((sum, l) => sum + l.quantity, 0),
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      hydrated,
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
      add,
      setQuantity,
      remove,
      clear,
    };
  }, [lines, hydrated, isOpen, add, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
