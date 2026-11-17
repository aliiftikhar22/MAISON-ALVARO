import type { Metadata } from 'next';
import OrderConfirmation from '@/components/checkout/OrderConfirmation';

export const metadata: Metadata = {
  title: 'Order Confirmed',
  robots: { index: false, follow: false },
};

export default function OrderConfirmationPage() {
  return (
    <main className="container-luxe py-16 sm:py-24">
      <OrderConfirmation />
    </main>
  );
}
