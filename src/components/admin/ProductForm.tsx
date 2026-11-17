'use client';

import { useState } from 'react';
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Plus, Trash2 } from 'lucide-react';
import { slugify } from '@/lib/format';
import { cloudinaryConfigured, uploadImage } from '@/lib/upload';
import type { Availability, Category, Product } from '@/types';

interface SizeRow {
  label: string;
  price: string;
  compareAtPrice: string;
}
interface SpecRow {
  label: string;
  value: string;
}
interface FormState {
  name: string;
  slug: string;
  category: Category;
  isGiftSet: boolean;
  shortDescription: string;
  description: string;
  sizes: SizeRow[];
  availability: Availability;
  published: boolean;
  bestSeller: boolean;
  signature: boolean;
  isDemo: boolean;
  images: { src: string; alt: string }[];
  top: string;
  middle: string;
  base: string;
  ingredients: string;
  specs: SpecRow[];
}

const list = (s: string) =>
  s
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);

function fromProduct(p?: Product): FormState {
  return {
    name: p?.name ?? '',
    slug: p?.slug ?? '',
    category: p?.category ?? 'unisex',
    isGiftSet: p?.isGiftSet ?? false,
    shortDescription: p?.shortDescription ?? '',
    description: p?.description.join('\n\n') ?? '',
    sizes: p?.sizes.map((s) => ({
      label: s.label,
      price: String(s.price),
      compareAtPrice: s.compareAtPrice ? String(s.compareAtPrice) : '',
    })) ?? [{ label: '50ml', price: '', compareAtPrice: '' }],
    availability: p?.availability ?? 'in_stock',
    published: p?.published ?? true,
    bestSeller: p?.bestSeller ?? false,
    signature: p?.signature ?? false,
    isDemo: p?.isDemo ?? false,
    images: p?.images ?? [],
    top: p?.notes.top.join(', ') ?? '',
    middle: p?.notes.middle.join(', ') ?? '',
    base: p?.notes.base.join(', ') ?? '',
    ingredients: p?.ingredients ?? '',
    specs: p?.specifications.length ? p.specifications : [{ label: '', value: '' }],
  };
}

interface Props {
  product?: Product;
  existingSlugs: string[];
  onSave: (product: Product) => Promise<void>;
  onCancel: () => void;
}

export default function ProductForm({ product, existingSlugs, onSave, onCancel }: Props) {
  const editing = Boolean(product);
  const [f, setF] = useState<FormState>(() => fromProduct(product));
  const [slugTouched, setSlugTouched] = useState(editing);
  const [errors, setErrors] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [saving, setSaving] = useState(false);

  const patch = (p: Partial<FormState>) => setF((s) => ({ ...s, ...p }));

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setUploadError('');
    try {
      const added: { src: string; alt: string }[] = [];
      for (const file of Array.from(files)) {
        added.push({ src: await uploadImage(file), alt: '' });
      }
      setF((s) => ({ ...s, images: [...s.images, ...added] }));
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  }

  function addUrl() {
    const url = urlInput.trim();
    if (!/^https?:\/\/|^\//.test(url)) {
      setUploadError('Enter a full image URL (https://…) or a path starting with /.');
      return;
    }
    setUploadError('');
    patch({ images: [...f.images, { src: url, alt: '' }] });
    setUrlInput('');
  }

  function moveImage(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= f.images.length) return;
    const next = [...f.images];
    [next[i], next[j]] = [next[j], next[i]];
    patch({ images: next });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const problems: string[] = [];
    const slug = slugify(f.slug || f.name);
    if (!f.name.trim()) problems.push('Name is required.');
    if (!slug) problems.push('A URL slug is required.');
    if (!editing && existingSlugs.includes(slug)) problems.push('That URL slug is already used by another product.');
    const sizes = f.sizes
      .filter((s) => s.label.trim() || s.price.trim())
      .map((s) => ({
        label: s.label.trim(),
        price: Number(s.price),
        compareAtPrice: s.compareAtPrice.trim() ? Number(s.compareAtPrice) : undefined,
      }));
    if (sizes.length === 0) problems.push('Add at least one size with a price.');
    if (sizes.some((s) => !s.label || !Number.isFinite(s.price) || s.price <= 0)) {
      problems.push('Every size needs a label and a price greater than 0.');
    }
    if (new Set(sizes.map((s) => s.label.toLowerCase())).size !== sizes.length) {
      problems.push('Size labels must be unique.');
    }
    if (f.images.length === 0) problems.push('Add at least one product image.');
    if (!f.shortDescription.trim()) problems.push('A short description is required.');
    setErrors(problems);
    if (problems.length) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const built: Product = {
      id: product?.id ?? slug,
      slug: product?.slug ?? slug,
      name: f.name.trim(),
      category: f.category,
      isGiftSet: f.isGiftSet,
      shortDescription: f.shortDescription.trim(),
      description: f.description
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean),
      sizes,
      availability: f.availability,
      published: f.published,
      bestSeller: f.bestSeller,
      signature: f.signature,
      images: f.images.map((i) => ({ src: i.src, alt: i.alt.trim() || f.name.trim() })),
      notes: { top: list(f.top), middle: list(f.middle), base: list(f.base) },
      ingredients: f.ingredients.trim() || undefined,
      specifications: f.specs.filter((s) => s.label.trim() && s.value.trim()),
      reviews: product?.reviews ?? [],
      isDemo: f.isDemo,
      createdAt: product?.createdAt ?? Date.now(),
    };

    setSaving(true);
    try {
      await onSave(built);
    } catch (err) {
      setErrors([err instanceof Error ? err.message : 'Could not save the product.']);
      setSaving(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  const check = (label: string, key: 'published' | 'bestSeller' | 'signature' | 'isGiftSet' | 'isDemo') => (
    <label className="flex cursor-pointer items-center gap-3 text-sm">
      <input
        type="checkbox"
        checked={f[key]}
        onChange={(e) => patch({ [key]: e.target.checked } as Partial<FormState>)}
        className="h-4 w-4 accent-[#D6A65B]"
      />
      {label}
    </label>
  );

  return (
    <form onSubmit={submit} noValidate className="space-y-12">
      <div className="flex items-end justify-between">
        <h1 className="font-serif text-4xl">{editing ? 'Edit product' : 'Add product'}</h1>
        <button type="button" onClick={onCancel} className="text-xs uppercase tracking-wide2 text-ivory/60 hover:text-gold">
          ← Back to products
        </button>
      </div>

      {errors.length > 0 && (
        <div role="alert" className="border border-crimson/60 bg-crimson/10 px-5 py-4 text-sm">
          <ul className="list-disc space-y-1 pl-5">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <section className="grid gap-5 sm:grid-cols-2">
        <h2 className="font-serif text-2xl sm:col-span-2">Basics</h2>
        <div>
          <label className="field-label" htmlFor="p-name">
            Name
          </label>
          <input
            id="p-name"
            className="field"
            value={f.name}
            onChange={(e) => {
              patch({ name: e.target.value, ...(slugTouched ? {} : { slug: slugify(e.target.value) }) });
            }}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="p-slug">
            URL slug {editing && <span className="normal-case text-ivory/40">(locked)</span>}
          </label>
          <input
            id="p-slug"
            className="field disabled:opacity-50"
            value={f.slug}
            disabled={editing}
            onChange={(e) => {
              setSlugTouched(true);
              patch({ slug: slugify(e.target.value) });
            }}
          />
          <p className="mt-1.5 text-xs text-ivory/40">/products/{slugify(f.slug || f.name) || 'your-slug'}/</p>
        </div>
        <div>
          <label className="field-label" htmlFor="p-cat">
            Category
          </label>
          <select
            id="p-cat"
            className="field bg-obsidian"
            value={f.category}
            onChange={(e) => patch({ category: e.target.value as Category })}
          >
            <option value="for-him">For Him</option>
            <option value="for-her">For Her</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="p-avail">
            Availability
          </label>
          <select
            id="p-avail"
            className="field bg-obsidian"
            value={f.availability}
            onChange={(e) => patch({ availability: e.target.value as Availability })}
          >
            <option value="in_stock">In stock</option>
            <option value="low_stock">Low stock</option>
            <option value="out_of_stock">Out of stock</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-3 sm:col-span-2">
          {check('Published (visible in store)', 'published')}
          {check('Gift set', 'isGiftSet')}
          {check('Best seller', 'bestSeller')}
          {check('Signature fragrance', 'signature')}
          {check('Demo / placeholder', 'isDemo')}
        </div>
        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="p-short">
            Short description
          </label>
          <textarea
            id="p-short"
            rows={2}
            className="field"
            value={f.shortDescription}
            onChange={(e) => patch({ shortDescription: e.target.value })}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="p-desc">
            Detailed description <span className="normal-case text-ivory/40">(leave a blank line between paragraphs)</span>
          </label>
          <textarea
            id="p-desc"
            rows={6}
            className="field"
            value={f.description}
            onChange={(e) => patch({ description: e.target.value })}
          />
        </div>
      </section>

      <section>
        <h2 className="font-serif text-2xl">Sizes &amp; prices (PKR)</h2>
        <div className="mt-5 space-y-3">
          {f.sizes.map((s, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] items-center gap-3">
              <input
                aria-label={`Size ${i + 1} label`}
                className="field"
                placeholder="e.g. 50ml"
                value={s.label}
                onChange={(e) => patch({ sizes: f.sizes.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)) })}
              />
              <input
                aria-label={`Size ${i + 1} price`}
                className="field"
                inputMode="numeric"
                placeholder="Price"
                value={s.price}
                onChange={(e) => patch({ sizes: f.sizes.map((x, j) => (j === i ? { ...x, price: e.target.value } : x)) })}
              />
              <input
                aria-label={`Size ${i + 1} compare-at price`}
                className="field"
                inputMode="numeric"
                placeholder="Was (optional)"
                value={s.compareAtPrice}
                onChange={(e) =>
                  patch({ sizes: f.sizes.map((x, j) => (j === i ? { ...x, compareAtPrice: e.target.value } : x)) })
                }
              />
              <button
                type="button"
                aria-label="Remove size"
                disabled={f.sizes.length === 1}
                onClick={() => patch({ sizes: f.sizes.filter((_, j) => j !== i) })}
                className="p-2 text-ivory/50 hover:text-crimson disabled:opacity-30"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => patch({ sizes: [...f.sizes, { label: '', price: '', compareAtPrice: '' }] })}
          className="mt-4 flex items-center gap-2 text-xs uppercase tracking-wide2 text-gold hover:text-gold-soft"
        >
          <Plus className="h-3.5 w-3.5" /> Add size
        </button>
      </section>

      <section>
        <h2 className="font-serif text-2xl">Images</h2>
        <p className="mt-1 text-xs text-ivory/45">
          The first image is the main image.{' '}
          {cloudinaryConfigured
            ? 'Uploads go to Cloudinary.'
            : 'Cloudinary isn’t configured — uploads are stored in this browser (demo mode only). In production, paste image URLs or configure Cloudinary.'}
        </p>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          {f.images.map((img, i) => (
            <li key={img.src.slice(0, 80) + i} className="flex gap-4 border border-ivory/10 p-3">
              <img src={img.src} alt="" className="h-24 w-20 shrink-0 border border-gold/20 object-cover" />
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <input
                  aria-label={`Alt text for image ${i + 1}`}
                  className="field !py-2 text-xs"
                  placeholder="Alt text (describe the image)"
                  value={img.alt}
                  onChange={(e) => patch({ images: f.images.map((x, j) => (j === i ? { ...x, alt: e.target.value } : x)) })}
                />
                <div className="mt-auto flex items-center gap-1 text-ivory/55">
                  <button type="button" aria-label="Move image earlier" onClick={() => moveImage(i, -1)} className="p-1.5 hover:text-gold">
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button type="button" aria-label="Move image later" onClick={() => moveImage(i, 1)} className="p-1.5 hover:text-gold">
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Remove image"
                    onClick={() => patch({ images: f.images.filter((_, j) => j !== i) })}
                    className="ml-auto p-1.5 hover:text-crimson"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <label className="btn-outline cursor-pointer !px-5 !py-3">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
            {uploading ? 'Uploading…' : 'Upload images'}
            <input
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              disabled={uploading}
              onChange={(e) => {
                void onFiles(e.target.files);
                e.target.value = '';
              }}
            />
          </label>
          <div className="flex flex-1 gap-2 sm:max-w-md">
            <input
              aria-label="Image URL"
              className="field"
              placeholder="…or paste an image URL"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
            />
            <button type="button" onClick={addUrl} className="btn-outline !px-5">
              Add
            </button>
          </div>
        </div>
        {uploadError && (
          <p role="alert" className="field-error">
            {uploadError}
          </p>
        )}
      </section>

      <section className="grid gap-5 sm:grid-cols-3">
        <h2 className="font-serif text-2xl sm:col-span-3">
          Fragrance notes <span className="text-sm text-ivory/40">(comma-separated)</span>
        </h2>
        {(
          [
            ['top', 'Top notes'],
            ['middle', 'Middle notes'],
            ['base', 'Base notes'],
          ] as const
        ).map(([key, label]) => (
          <div key={key}>
            <label className="field-label" htmlFor={`p-${key}`}>
              {label}
            </label>
            <input id={`p-${key}`} className="field" value={f[key]} onChange={(e) => patch({ [key]: e.target.value } as Partial<FormState>)} />
          </div>
        ))}
      </section>

      <section>
        <h2 className="font-serif text-2xl">Ingredients &amp; specifications</h2>
        <div className="mt-5">
          <label className="field-label" htmlFor="p-ing">
            Ingredients (optional)
          </label>
          <textarea id="p-ing" rows={3} className="field" value={f.ingredients} onChange={(e) => patch({ ingredients: e.target.value })} />
        </div>
        <div className="mt-6 space-y-3">
          <p className="field-label">Specifications</p>
          {f.specs.map((s, i) => (
            <div key={i} className="grid grid-cols-[1fr_1.4fr_auto] gap-3">
              <input
                aria-label={`Specification ${i + 1} label`}
                className="field"
                placeholder="e.g. Concentration"
                value={s.label}
                onChange={(e) => patch({ specs: f.specs.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)) })}
              />
              <input
                aria-label={`Specification ${i + 1} value`}
                className="field"
                placeholder="Value"
                value={s.value}
                onChange={(e) => patch({ specs: f.specs.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)) })}
              />
              <button
                type="button"
                aria-label="Remove specification"
                onClick={() => patch({ specs: f.specs.filter((_, j) => j !== i) })}
                className="p-2 text-ivory/50 hover:text-crimson"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => patch({ specs: [...f.specs, { label: '', value: '' }] })}
            className="flex items-center gap-2 text-xs uppercase tracking-wide2 text-gold hover:text-gold-soft"
          >
            <Plus className="h-3.5 w-3.5" /> Add specification
          </button>
        </div>
      </section>

      <div className="flex gap-4 border-t border-ivory/10 pt-8">
        <button type="submit" disabled={saving || uploading} className="btn-gold">
          {saving ? 'Saving…' : editing ? 'Save changes' : 'Create product'}
        </button>
        <button type="button" onClick={onCancel} className="btn-outline">
          Cancel
        </button>
      </div>
    </form>
  );
}
