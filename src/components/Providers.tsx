'use client';

import { CartProvider } from '@/context/CartContext';
import { CatalogProvider } from '@/context/CatalogContext';
import CartDrawer from '@/components/cart/CartDrawer';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CatalogProvider>
      <CartProvider>
        {children}
        <CartDrawer />
      </CartProvider>
    </CatalogProvider>
  );
}
