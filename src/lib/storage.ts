/** Safe localStorage helpers (SSR-safe, never throw). */

export function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

/** Returns false when the write failed (private mode, quota exceeded…). */
export function writeJSON(key: string, value: unknown): boolean {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeKey(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

export const STORAGE_KEYS = {
  cart: 'ma.cart.v1',
  recent: 'ma.recent.v1',
  demoProducts: 'ma.demo.products.v1',
  demoOrders: 'ma.demo.orders.v1',
  demoSubscribers: 'ma.demo.subscribers.v1',
  lastOrder: 'ma.lastOrder.v1',
} as const;
