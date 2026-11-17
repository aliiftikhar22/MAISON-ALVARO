import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { getFirebaseApp } from '@/lib/firebase';
import type { Order, OrderStatus, Product } from '@/types';
import type { Repository } from './types';

async function db() {
  return getFirestore(await getFirebaseApp());
}

/** Firestore rejects `undefined` values — strip them. */
function clean<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export const firebaseRepo: Repository = {
  mode: 'firebase',

  async listProducts() {
    const snap = await getDocs(collection(await db(), 'products'));
    return snap.docs
      .map((d) => ({ ...(d.data() as Product), id: d.id }))
      .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
  },

  async saveProduct(product) {
    await setDoc(doc(await db(), 'products', product.id), clean(product));
  },

  async deleteProduct(id) {
    await deleteDoc(doc(await db(), 'products', id));
  },

  async createOrder(order: Order) {
    await setDoc(doc(await db(), 'orders', order.id), clean(order));
  },

  async listOrders() {
    const q = query(collection(await db(), 'orders'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ ...(d.data() as Order), id: d.id }));
  },

  async updateOrderStatus(id: string, status: OrderStatus) {
    await updateDoc(doc(await db(), 'orders', id), { status });
  },

  async addSubscriber(email: string) {
    await addDoc(collection(await db(), 'subscribers'), { email, createdAt: Date.now() });
  },
};
