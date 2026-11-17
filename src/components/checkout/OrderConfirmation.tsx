'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { formatPKR } from '@/lib/format';
import { readJSON, STORAGE_KEYS } from '@/lib/storage';
import type { Order } from '@/types';

export default function OrderConfirmation() {
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    setOrder(readJSON<Order | null>(STORAGE_KEYS.lastOrder, null));
  }, []);

  if (order === undefined) return <div className="h-72 animate-pulse-soft bg-espresso/40" aria-busy="true" />;

  if (!order) {
    return (
      <div className="py-16 text-center">
        <p className="font-serif text-3xl">No recent order found</p>
        <Link href="/shop/" className="btn-gold mt-8">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl text-center">
      <CheckCircle2 className="mx-auto h-14 w-14 text-gold" strokeWidth={1.2} aria-hidden />
      <h1 className="mt-6 font-serif text-5xl">Thank you, {order.customer.name.split(' ')[0]}.</h1>
      <p className="mt-4 text-sm text-ivory/65">
        Your order has been received. Payment is Cash on Delivery.
      </p>
      <p className="mt-6 text-[11px] uppercase tracking-luxe text-gold">Order number</p>
      <p className="mt-1 font-serif text-3xl tracking-wide">{order.id}</p>

      <div className="mt-10 border border-gold/25 p-7 text-left">
        <ul className="divide-y divide-ivory/10">
          {order.items.map((i) => (
            <li key={i.productId + i.size} className="flex items-center gap-4 py-4">
              <img src={i.image} alt="" className="h-16 w-14 border border-gold/20 object-cover" />
              <div className="flex-1 text-sm">
                <p className="font-serif text-lg leading-tight">{i.name}</p>
                <p className="mt-1 text-xs uppercase tracking-wide2 text-ivory/50">
                  {i.size} × {i.quantity}
                </p>
              </div>
              <p className="text-sm text-gold">{formatPKR(i.unitPrice * i.quantity)}</p>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-ivory/10 pt-4 text-sm">
          <div className="flex justify-between text-ivory/70">
            <dt>Subtotal</dt>
            <dd>{formatPKR(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between text-ivory/70">
            <dt>Delivery</dt>
            <dd>{order.deliveryFee === 0 ? 'Free' : formatPKR(order.deliveryFee)}</dd>
          </div>
          <div className="flex justify-between pt-2 font-serif text-2xl">
            <dt>Total due on delivery</dt>
            <dd className="text-gold">{formatPKR(order.total)}</dd>
          </div>
        </dl>
        <div className="mt-6 border-t border-ivory/10 pt-5 text-sm text-ivory/65">
          <p className="text-[11px] uppercase tracking-wide2 text-ivory/45">Delivering to</p>
          <p className="mt-2">
            {order.customer.name} · {order.customer.phone}
          </p>
          <p>
            {order.address.line1}, {order.address.city}, {order.address.province}
            {order.address.postalCode ? ` ${order.address.postalCode}` : ''}
          </p>
        </div>
      </div>

      <Link href="/shop/" className="btn-outline mt-10">
        Continue shopping
      </Link>
    </div>
  );
}
