'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { seedProducts } from '@/data/seed';
import { formatPKR } from '@/lib/format';
import { getRepo } from '@/lib/repo';
import { resetDemoData } from '@/lib/repo/demo';
import { useCatalog } from '@/context/CatalogContext';
import type { Product } from '@/types';
import ProductForm from './ProductForm';

const availabilityLabel = { in_stock: 'In stock', low_stock: 'Low stock', out_of_stock: 'Out of stock' } as const;

export default function ProductsAdmin() {
  const { refresh } = useCatalog();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [mode, setMode] = useState<'demo' | 'firebase'>('demo');
  const [editing, setEditing] = useState<Product | 'new' | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setError('');
    try {
      const repo = await getRepo();
      setMode(repo.mode);
      setProducts(await repo.listProducts());
    } catch (e) {
      console.error(e);
      setError('Could not load products. Check your Firebase configuration and that you are signed in as an admin.');
      setProducts([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function save(product: Product) {
    await (await getRepo()).saveProduct(product);
    await Promise.all([load(), refresh()]);
    setEditing(null);
  }

  async function togglePublished(p: Product) {
    try {
      await (await getRepo()).saveProduct({ ...p, published: !p.published });
      await Promise.all([load(), refresh()]);
    } catch {
      setError('Could not update the product.');
    }
  }

  async function remove(p: Product) {
    if (!window.confirm(`Delete “${p.name}”? This cannot be undone.`)) return;
    try {
      await (await getRepo()).deleteProduct(p.id);
      await Promise.all([load(), refresh()]);
    } catch {
      setError('Could not delete the product.');
    }
  }

  async function importDemo() {
    setBusy(true);
    try {
      const repo = await getRepo();
      for (const p of seedProducts) await repo.saveProduct(p);
      await Promise.all([load(), refresh()]);
    } catch {
      setError('Could not import the demo products.');
    } finally {
      setBusy(false);
    }
  }

  async function resetDemo() {
    if (!window.confirm('Reset demo products and orders in this browser?')) return;
    resetDemoData();
    await Promise.all([load(), refresh()]);
  }

  if (editing) {
    return (
      <ProductForm
        product={editing === 'new' ? undefined : editing}
        existingSlugs={(products ?? []).map((p) => p.slug)}
        onSave={save}
        onCancel={() => setEditing(null)}
      />
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl">Products</h1>
          <p className="mt-1 text-sm text-ivory/50">
            {products ? `${products.length} product${products.length === 1 ? '' : 's'}` : 'Loading…'}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {mode === 'demo' && (
            <button onClick={() => void resetDemo()} className="btn-outline !px-4 !py-2.5">
              Reset demo data
            </button>
          )}
          <button onClick={() => setEditing('new')} className="btn-gold !px-5 !py-2.5">
            <Plus className="h-4 w-4" /> Add product
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-6 border border-crimson/60 bg-crimson/10 px-4 py-3 text-sm">
          {error}
        </p>
      )}

      <div className="mt-8 border border-ivory/10">
        {products === null ? (
          <div className="p-10 text-center text-sm text-ivory/50">Loading products…</div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-serif text-2xl">No products yet</p>
            <p className="mt-2 text-sm text-ivory/50">Add your first product, or import the labelled demo catalogue to preview the store.</p>
            <button onClick={() => void importDemo()} disabled={busy} className="btn-outline mt-6">
              {busy ? 'Importing…' : 'Import demo products'}
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-ivory/10">
            {products.map((p) => (
              <li key={p.id} className="grid items-center gap-4 px-5 py-4 md:grid-cols-[auto_1.6fr_1fr_1fr_auto]">
                <img src={p.images[0]?.src} alt="" className="h-16 w-14 border border-gold/20 object-cover" />
                <div>
                  <p className="font-medium">
                    {p.name}
                    {p.isDemo && <span className="ml-2 text-[10px] uppercase tracking-wide2 text-gold/70">Demo</span>}
                  </p>
                  <p className="text-xs text-ivory/45">
                    /products/{p.slug}/ · {p.isGiftSet ? 'Gift set' : p.category}
                  </p>
                </div>
                <p className="text-sm text-gold">
                  {p.sizes.length > 1 ? 'From ' : ''}
                  {formatPKR(Math.min(...p.sizes.map((s) => s.price)))}
                </p>
                <div className="flex flex-col items-start gap-1 text-xs">
                  <span className={p.availability === 'out_of_stock' ? 'text-[#e0636a]' : 'text-ivory/70'}>
                    {availabilityLabel[p.availability]}
                  </span>
                  <button
                    onClick={() => void togglePublished(p)}
                    className={`uppercase tracking-wide2 ${p.published ? 'text-gold' : 'text-ivory/40'} hover:underline`}
                  >
                    {p.published ? 'Published' : 'Hidden'}
                  </button>
                </div>
                <div className="flex items-center gap-1 justify-self-end text-ivory/60">
                  <Link
                    href={`/products/${p.slug}/`}
                    target="_blank"
                    className="px-2 py-1 text-[11px] uppercase tracking-wide2 hover:text-gold"
                  >
                    View
                  </Link>
                  <button onClick={() => setEditing(p)} aria-label={`Edit ${p.name}`} className="p-2 hover:text-gold">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => void remove(p)} aria-label={`Delete ${p.name}`} className="p-2 hover:text-crimson">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
