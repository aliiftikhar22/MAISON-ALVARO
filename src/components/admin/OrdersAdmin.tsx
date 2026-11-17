'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronDown, Download, RefreshCw } from 'lucide-react';
import { formatDate, formatPKR } from '@/lib/format';
import { getRepo } from '@/lib/repo';
import type { Order, OrderStatus } from '@/types';

const statuses: { id: OrderStatus; label: string; tone: string }[] = [
  { id: 'pending', label: 'Pending', tone: 'bg-gold/15 text-gold' },
  { id: 'confirmed', label: 'Confirmed', tone: 'bg-ivory/10 text-ivory' },
  { id: 'shipped', label: 'Shipped', tone: 'bg-espresso text-gold-soft' },
  { id: 'delivered', label: 'Delivered', tone: 'bg-[#1f3a2a] text-[#8fd1a6]' },
  { id: 'cancelled', label: 'Cancelled', tone: 'bg-crimson/30 text-[#f0a0a4]' },
];

const tone = (s: OrderStatus) => statuses.find((x) => x.id === s)?.tone ?? '';

function toCsv(orders: Order[]): string {
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const header = ['Order', 'Date', 'Status', 'Name', 'Phone', 'Email', 'Address', 'City', 'Province', 'Items', 'Total (PKR)', 'Notes'];
  const rows = orders.map((o) =>
    [
      o.id,
      new Date(o.createdAt).toISOString(),
      o.status,
      o.customer.name,
      o.customer.phone,
      o.customer.email ?? '',
      o.address.line1,
      o.address.city,
      o.address.province,
      o.items.map((i) => `${i.name} (${i.size}) x${i.quantity}`).join('; '),
      o.total,
      o.address.notes ?? '',
    ]
      .map(esc)
      .join(','),
  );
  return [header.map(esc).join(','), ...rows].join('\n');
}

export default function OrdersAdmin() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError('');
    try {
      setOrders(await (await getRepo()).listOrders());
    } catch (e) {
      console.error(e);
      setError('Could not load orders. Check your Firebase configuration and that you are signed in as an admin.');
      setOrders([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function changeStatus(order: Order, status: OrderStatus) {
    setSavingId(order.id);
    const previous = order.status;
    setOrders((list) => list?.map((o) => (o.id === order.id ? { ...o, status } : o)) ?? null);
    try {
      await (await getRepo()).updateOrderStatus(order.id, status);
    } catch (e) {
      console.error(e);
      setOrders((list) => list?.map((o) => (o.id === order.id ? { ...o, status: previous } : o)) ?? null);
      setError('Could not update the order status. Please try again.');
    } finally {
      setSavingId(null);
    }
  }

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders?.length ?? 0 };
    statuses.forEach((s) => (c[s.id] = orders?.filter((o) => o.status === s.id).length ?? 0));
    return c;
  }, [orders]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (orders ?? []).filter(
      (o) =>
        (filter === 'all' || o.status === filter) &&
        (!q ||
          [o.id, o.customer.name, o.customer.phone, o.address.city].join(' ').toLowerCase().includes(q)),
    );
  }, [orders, filter, query]);

  function exportCsv() {
    const blob = new Blob([toCsv(visible)], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `maison-alvaro-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl">Orders</h1>
          <p className="mt-1 text-sm text-ivory/50">All orders are Cash on Delivery.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => void load()} className="btn-outline !px-4 !py-2.5">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
          <button onClick={exportCsv} disabled={!visible.length} className="btn-outline !px-4 !py-2.5">
            <Download className="h-3.5 w-3.5" /> CSV
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter by status">
        {[{ id: 'all' as const, label: 'All' }, ...statuses].map((s) => (
          <button
            key={s.id}
            onClick={() => setFilter(s.id)}
            aria-pressed={filter === s.id}
            className={`px-4 py-2 text-[11px] uppercase tracking-wide2 transition-colors ${
              filter === s.id ? 'bg-gold text-obsidian' : 'border border-ivory/20 text-ivory/70 hover:border-gold/60'
            }`}
          >
            {s.label} <span className="opacity-60">({counts[s.id] ?? 0})</span>
          </button>
        ))}
      </div>

      <div className="mt-5">
        <label htmlFor="order-search" className="sr-only">
          Search orders
        </label>
        <input
          id="order-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by order number, name, phone or city"
          className="field max-w-md"
        />
      </div>

      {error && (
        <p role="alert" className="mt-6 border border-crimson/60 bg-crimson/10 px-4 py-3 text-sm">
          {error}
        </p>
      )}

      <div className="mt-8 border border-ivory/10">
        {orders === null ? (
          <div className="p-10 text-center text-sm text-ivory/50">Loading orders…</div>
        ) : visible.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-serif text-2xl">No orders to show</p>
            <p className="mt-2 text-sm text-ivory/50">
              {orders.length === 0 ? 'Orders will appear here as customers place them.' : 'No orders match this filter.'}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-ivory/10">
            {visible.map((o) => {
              const open = openId === o.id;
              return (
                <li key={o.id}>
                  <div className="grid items-center gap-3 px-5 py-4 md:grid-cols-[1.2fr_1.3fr_0.8fr_1fr_auto]">
                    <div>
                      <p className="font-medium">{o.id}</p>
                      <p className="text-xs text-ivory/45">{formatDate(o.createdAt)}</p>
                    </div>
                    <div className="text-sm">
                      <p>{o.customer.name}</p>
                      <p className="text-xs text-ivory/50">
                        {o.customer.phone} · {o.address.city}
                      </p>
                    </div>
                    <p className="text-sm text-gold">{formatPKR(o.total)}</p>
                    <div>
                      <label htmlFor={`st-${o.id}`} className="sr-only">
                        Status for {o.id}
                      </label>
                      <select
                        id={`st-${o.id}`}
                        value={o.status}
                        disabled={savingId === o.id}
                        onChange={(e) => void changeStatus(o, e.target.value as OrderStatus)}
                        className={`w-full border border-ivory/15 px-3 py-2 text-xs uppercase tracking-wide2 focus:border-gold focus:outline-none ${tone(o.status)}`}
                      >
                        {statuses.map((s) => (
                          <option key={s.id} value={s.id} className="bg-obsidian text-ivory">
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => setOpenId(open ? null : o.id)}
                      aria-expanded={open}
                      aria-label={open ? 'Hide order details' : 'Show order details'}
                      className="justify-self-end p-2 text-ivory/60 hover:text-gold"
                    >
                      <ChevronDown className={`h-5 w-5 transition-transform ${open ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {open && (
                    <div className="grid gap-8 border-t border-ivory/10 bg-espresso/20 px-5 py-6 md:grid-cols-2">
                      <div>
                        <p className="text-[11px] uppercase tracking-wide2 text-ivory/45">Items</p>
                        <ul className="mt-3 space-y-3">
                          {o.items.map((i) => (
                            <li key={i.productId + i.size} className="flex items-center gap-3 text-sm">
                              <img src={i.image} alt="" className="h-14 w-12 border border-gold/20 object-cover" />
                              <span className="flex-1">
                                {i.name}
                                <span className="block text-xs text-ivory/50">
                                  {i.size} × {i.quantity} @ {formatPKR(i.unitPrice)}
                                </span>
                              </span>
                              <span className="text-gold">{formatPKR(i.unitPrice * i.quantity)}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4 space-y-1 border-t border-ivory/10 pt-3 text-sm text-ivory/70">
                          <p className="flex justify-between">
                            <span>Subtotal</span>
                            <span>{formatPKR(o.subtotal)}</span>
                          </p>
                          <p className="flex justify-between">
                            <span>Delivery</span>
                            <span>{o.deliveryFee === 0 ? 'Free' : formatPKR(o.deliveryFee)}</span>
                          </p>
                          <p className="flex justify-between font-medium text-ivory">
                            <span>Collect on delivery</span>
                            <span className="text-gold">{formatPKR(o.total)}</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-sm">
                        <p className="text-[11px] uppercase tracking-wide2 text-ivory/45">Customer</p>
                        <p className="mt-3">{o.customer.name}</p>
                        <p>
                          <a href={`tel:${o.customer.phone}`} className="text-gold hover:underline">
                            {o.customer.phone}
                          </a>
                        </p>
                        {o.customer.email && <p className="text-ivory/70">{o.customer.email}</p>}
                        <p className="mt-6 text-[11px] uppercase tracking-wide2 text-ivory/45">Delivery address</p>
                        <p className="mt-3 text-ivory/80">
                          {o.address.line1}
                          <br />
                          {o.address.city}, {o.address.province}
                          {o.address.postalCode ? ` ${o.address.postalCode}` : ''}
                        </p>
                        {o.address.notes && (
                          <>
                            <p className="mt-6 text-[11px] uppercase tracking-wide2 text-ivory/45">Customer notes</p>
                            <p className="mt-3 text-ivory/80">{o.address.notes}</p>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
