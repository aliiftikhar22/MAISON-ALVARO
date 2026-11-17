'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { seedProducts } from '@/data/seed';
import { isFirebaseConfigured } from '@/lib/firebase';
import { getRepo } from '@/lib/repo';
import type { Product } from '@/types';

type Status = 'loading' | 'ready' | 'error';

interface CatalogContextValue {
  /** Published products only (used by listings) */
  products: Product[];
  /** Every product including unpublished (used to tell "unavailable" from "not found") */
  allProducts: Product[];
  status: Status;
  refresh: () => Promise<void>;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  // Demo mode renders the seed immediately (good for SEO/static HTML);
  // Firebase mode waits for Firestore so demo data never flashes in production.
  const [allProducts, setAll] = useState<Product[]>(isFirebaseConfigured ? [] : seedProducts);
  const [status, setStatus] = useState<Status>(isFirebaseConfigured ? 'loading' : 'ready');

  const refresh = useCallback(async () => {
    try {
      const repo = await getRepo();
      const list = await repo.listProducts();
      setAll(list);
      setStatus('ready');
    } catch (err) {
      console.error('Failed to load catalogue', err);
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const products = useMemo(() => allProducts.filter((p) => p.published), [allProducts]);

  const value = useMemo(
    () => ({ products, allProducts, status, refresh }),
    [products, allProducts, status, refresh],
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog(): CatalogContextValue {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used inside CatalogProvider');
  return ctx;
}
