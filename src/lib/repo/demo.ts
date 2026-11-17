import { seedProducts } from '@/data/seed';
import { readJSON, removeKey, STORAGE_KEYS, writeJSON } from '@/lib/storage';
import type { Order, OrderStatus, Product } from '@/types';
import type { Repository } from './types';

function products(): Product[] {
  return readJSON<Product[] | null>(STORAGE_KEYS.demoProducts, null) ?? seedProducts;
}

function persistProducts(list: Product[]) {
  if (!writeJSON(STORAGE_KEYS.demoProducts, list)) {
    throw new Error('Could not save — browser storage is full or unavailable. Try smaller images.');
  }
}

export function resetDemoData() {
  removeKey(STORAGE_KEYS.demoProducts);
  removeKey(STORAGE_KEYS.demoOrders);
}

export const demoRepo: Repository = {
  mode: 'demo',

  async listProducts() {
    return products();
  },

  async saveProduct(product) {
    const list = products().filter((p) => p.id !== product.id);
    persistProducts([product, ...list]);
  },

  async deleteProduct(id) {
    persistProducts(products().filter((p) => p.id !== id));
  },

  async createOrder(order: Order) {
    const orders = readJSON<Order[]>(STORAGE_KEYS.demoOrders, []);
    if (!writeJSON(STORAGE_KEYS.demoOrders, [order, ...orders])) {
      throw new Error('Could not save the order in this browser.');
    }
  },

  async listOrders() {
    return readJSON<Order[]>(STORAGE_KEYS.demoOrders, []);
  },

  async updateOrderStatus(id: string, status: OrderStatus) {
    const orders = readJSON<Order[]>(STORAGE_KEYS.demoOrders, []).map((o) =>
      o.id === id ? { ...o, status } : o,
    );
    writeJSON(STORAGE_KEYS.demoOrders, orders);
  },

  async addSubscriber(email: string) {
    const list = readJSON<string[]>(STORAGE_KEYS.demoSubscribers, []);
    if (!list.includes(email)) writeJSON(STORAGE_KEYS.demoSubscribers, [...list, email]);
  },
};
