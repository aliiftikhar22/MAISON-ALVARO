'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Banknote, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCatalog } from '@/context/CatalogContext';
import { formatPKR, generateOrderId } from '@/lib/format';
import { getRepo } from '@/lib/repo';
import { STORAGE_KEYS, writeJSON } from '@/lib/storage';
import type { Order } from '@/types';

const provinces = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Islamabad Capital Territory',
  'Gilgit-Baltistan',
  'Azad Jammu & Kashmir',
];

interface FormState {
  name: string;
  phone: string;
  email: string;
  line1: string;
  city: string;
  province: string;
  postalCode: string;
  notes: string;
  website: string; // honeypot
}

type Errors = Partial<Record<keyof FormState, string>>;

const empty: FormState = {
  name: '',
  phone: '',
  email: '',
  line1: '',
  city: '',
  province: 'Punjab',
  postalCode: '',
  notes: '',
  website: '',
};

function validate(f: FormState): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 2) e.name = 'Please enter your full name.';
  if (!/^\+?\d{10,14}$/.test(f.phone.replace(/[\s\-()]/g, ''))) {
    e.phone = 'Please enter a valid phone number (e.g. 03XX XXXXXXX).';
  }
  if (f.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) {
    e.email = 'Please enter a valid email address.';
  }
  if (f.line1.trim().length < 8) e.line1 = 'Please enter your full delivery address.';
  if (f.city.trim().length < 2) e.city = 'Please enter your city.';
  return e;
}

export default function CheckoutForm() {
  const router = useRouter();
  const { lines, subtotal, deliveryFee, total, hydrated, clear } = useCart();
  const { status } = useCatalog();
  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  if (!hydrated || status === 'loading') {
    return <div className="h-96 animate-pulse-soft bg-espresso/40" aria-busy="true" />;
  }

  if (lines.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="font-serif text-3xl">Your bag is empty</p>
        <p className="mt-3 text-sm text-ivory/55">Add a fragrance to continue to checkout.</p>
        <Link href="/shop/" className="btn-gold mt-8">
          Explore Fragrances
        </Link>
      </div>
    );
  }

  const blocked = lines.some((l) => !l.available);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting || blocked) return;
    setSubmitError('');
    if (form.website) return; // bot

    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0];
      document.getElementById(`f-${first}`)?.focus();
      return;
    }

    const order: Order = {
      id: generateOrderId(),
      createdAt: Date.now(),
      status: 'pending',
      paymentMethod: 'cod',
      customer: {
        name: form.name.trim(),
        phone: form.phone.replace(/[\s\-()]/g, ''),
        ...(form.email.trim() ? { email: form.email.trim() } : {}),
      },
      address: {
        line1: form.line1.trim(),
        city: form.city.trim(),
        province: form.province,
        ...(form.postalCode.trim() ? { postalCode: form.postalCode.trim() } : {}),
        ...(form.notes.trim() ? { notes: form.notes.trim() } : {}),
      },
      items: lines.map((l) => ({
        productId: l.product.id,
        slug: l.product.slug,
        name: l.product.name,
        size: l.size.label,
        unitPrice: l.unitPrice,
        quantity: l.quantity,
        image: l.product.images[0]?.src ?? '',
      })),
      subtotal,
      deliveryFee,
      total,
    };

    setSubmitting(true);
    try {
      await (await getRepo()).createOrder(order);
      writeJSON(STORAGE_KEYS.lastOrder, order);
      clear();
      router.push('/order-confirmation/');
    } catch (err) {
      console.error(err);
      setSubmitError('We couldn’t place your order. Please check your connection and try again.');
      setSubmitting(false);
    }
  }

  const field = (key: keyof FormState) => ({
    id: `f-${key}`,
    value: form[key],
    onChange: set(key),
    'aria-invalid': Boolean(errors[key]) || undefined,
    'aria-describedby': errors[key] ? `e-${key}` : undefined,
    className: `field ${errors[key] ? '!border-[#e0636a]' : ''}`,
  });
  const err = (key: keyof FormState) =>
    errors[key] ? (
      <p id={`e-${key}`} className="field-error" role="alert">
        {errors[key]}
      </p>
    ) : null;

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-12">
        <section aria-labelledby="contact-h">
          <h2 id="contact-h" className="font-serif text-3xl">
            Contact
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="f-name" className="field-label">
                Full name
              </label>
              <input {...field('name')} autoComplete="name" />
              {err('name')}
            </div>
            <div>
              <label htmlFor="f-phone" className="field-label">
                Phone number
              </label>
              <input {...field('phone')} type="tel" inputMode="tel" autoComplete="tel" placeholder="03XX XXXXXXX" />
              {err('phone')}
            </div>
            <div>
              <label htmlFor="f-email" className="field-label">
                Email (optional)
              </label>
              <input {...field('email')} type="email" autoComplete="email" />
              {err('email')}
            </div>
          </div>
        </section>

        <section aria-labelledby="delivery-h">
          <h2 id="delivery-h" className="font-serif text-3xl">
            Delivery address
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="f-line1" className="field-label">
                Address
              </label>
              <input {...field('line1')} autoComplete="street-address" placeholder="House / street / area" />
              {err('line1')}
            </div>
            <div>
              <label htmlFor="f-city" className="field-label">
                City
              </label>
              <input {...field('city')} autoComplete="address-level2" />
              {err('city')}
            </div>
            <div>
              <label htmlFor="f-province" className="field-label">
                Province / territory
              </label>
              <select {...field('province')} className="field bg-obsidian">
                {provinces.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="f-postalCode" className="field-label">
                Postal code (optional)
              </label>
              <input {...field('postalCode')} autoComplete="postal-code" inputMode="numeric" />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="f-notes" className="field-label">
                Order notes (optional)
              </label>
              <textarea {...field('notes')} rows={3} placeholder="Delivery instructions, landmarks…" />
            </div>
          </div>
          {/* Honeypot — hidden from people, filled by bots */}
          <div className="absolute -left-[9999px]" aria-hidden>
            <label htmlFor="f-website">Website</label>
            <input id="f-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} />
          </div>
        </section>

        <section aria-labelledby="payment-h">
          <h2 id="payment-h" className="font-serif text-3xl">
            Payment
          </h2>
          <div className="mt-6 flex items-start gap-4 border border-gold bg-gold/5 p-5">
            <input
              type="radio"
              name="payment"
              id="pay-cod"
              checked
              readOnly
              className="mt-1 h-4 w-4 accent-[#D6A65B]"
            />
            <label htmlFor="pay-cod" className="flex-1">
              <span className="flex items-center gap-2 font-medium">
                <Banknote className="h-4 w-4 text-gold" aria-hidden /> Cash on Delivery
              </span>
              <span className="mt-1 block text-sm text-ivory/60">
                Pay in cash when your order arrives. No online payment is required.
              </span>
            </label>
          </div>
        </section>
      </div>

      <aside className="h-fit border border-gold/25 p-7 lg:sticky lg:top-28">
        <h2 className="font-serif text-2xl">Order Summary</h2>
        <ul className="mt-6 divide-y divide-ivory/10">
          {lines.map((l) => (
            <li key={l.key} className="flex gap-4 py-4">
              <img
                src={l.product.images[0]?.src}
                alt=""
                className="h-20 w-16 border border-gold/20 object-cover"
              />
              <div className="flex-1 text-sm">
                <p className="font-serif text-lg leading-tight">{l.product.name}</p>
                <p className="mt-1 text-xs uppercase tracking-wide2 text-ivory/50">
                  {l.size.label} × {l.quantity}
                </p>
                {!l.available && <p className="mt-1 text-xs text-[#e0636a]">Out of stock</p>}
              </div>
              <p className="text-sm text-gold">{formatPKR(l.lineTotal)}</p>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-3 border-t border-ivory/10 pt-5 text-sm">
          <div className="flex justify-between text-ivory/70">
            <dt>Subtotal</dt>
            <dd>{formatPKR(subtotal)}</dd>
          </div>
          <div className="flex justify-between text-ivory/70">
            <dt>Delivery</dt>
            <dd>{deliveryFee === 0 ? 'Free' : formatPKR(deliveryFee)}</dd>
          </div>
          <div className="flex justify-between border-t border-ivory/10 pt-4 font-serif text-2xl">
            <dt>Total</dt>
            <dd className="text-gold">{formatPKR(total)}</dd>
          </div>
        </dl>

        {blocked && (
          <p className="mt-5 text-sm text-[#e0636a]">
            Some items are out of stock. <Link href="/cart/" className="underline">Update your bag</Link> to continue.
          </p>
        )}
        {submitError && (
          <p role="alert" className="mt-5 text-sm text-[#e0636a]">
            {submitError}
          </p>
        )}

        <button type="submit" disabled={submitting || blocked} className="btn-gold mt-6 w-full">
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Placing order…
            </>
          ) : (
            'Place Order — Cash on Delivery'
          )}
        </button>
        <p className="mt-4 text-center text-[11px] leading-relaxed text-ivory/45">
          By placing your order you agree to pay the total above in cash on delivery.
        </p>
      </aside>
    </form>
  );
}
