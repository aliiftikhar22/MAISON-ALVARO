import type { Metadata } from 'next';
import PageHero from '@/components/shop/PageHero';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Maison Alvaro.',
  alternates: { canonical: '/contact/' },
};

export default function ContactPage() {
  return (
    <main>
      <PageHero eyebrow="Maison Alvaro" title="Contact" subtitle="We’d love to hear from you." />
      <section className="container-luxe py-16 sm:py-24">
        <div className="mx-auto max-w-xl border border-gold/25 p-10 text-center">
          <p className="font-serif text-3xl">Contact details coming soon</p>
          <p className="mt-4 text-sm leading-relaxed text-ivory/60">
            Placeholder — phone, email, WhatsApp and address will be published here once they are
            provided. If you have placed an order, we will contact you on the phone number you gave
            at checkout.
          </p>
        </div>
      </section>
    </main>
  );
}
