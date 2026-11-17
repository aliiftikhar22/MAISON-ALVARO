import type { Order, OrderStatus, Product } from '@/types';

/**
 * The single data-access contract used by the whole site.
 * Two implementations exist: `demo` (browser localStorage) and `firebase` (Firestore).
 */
export interface Repository {
  mode: 'demo' | 'firebase';
  listProducts(): Promise<Product[]>;
  saveProduct(product: Product): Promise<void>;
  deleteProduct(id: string): Promise<void>;
  createOrder(order: Order): Promise<void>;
  listOrders(): Promise<Order[]>;
  updateOrderStatus(id: string, status: OrderStatus): Promise<void>;
  addSubscriber(email: string): Promise<void>;
}
