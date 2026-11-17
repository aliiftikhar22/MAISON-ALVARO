import Hero from '@/components/home/Hero';
import SectionHeading from '@/components/ui/SectionHeading';
import CollectionGrid from '@/components/home/CollectionGrid';
import ProductRail from '@/components/home/ProductRail';
import BrandStory from '@/components/home/BrandStory';
import Testimonials from '@/components/home/Testimonials';
import Newsletter from '@/components/home/Newsletter';

export default function HomePage() {
  return (
    <main>
      <Hero />

      <section className="bg-obsidian py-20 sm:py-24">
        <div className="container-luxe">
          <SectionHeading
            title={
              <>
                Shop <em className="italic text-gold">by</em> Collection
              </>
            }
          />
          <div className="mt-14">
            <CollectionGrid />
          </div>
        </div>
      </section>

      <ProductRail
        eyebrow="Most loved"
        title="Best Sellers"
        kind="bestSeller"
        limit={4}
        linkLabel="Shop all fragrances"
        background="bg-espresso/30"
      />

      <ProductRail
        eyebrow="The signature"
        title="Signature Fragrances"
        subtitle="The house signatures — distinctive, memorable, unmistakably Maison Alvaro."
        kind="signature"
        limit={3}
      />

      <BrandStory />

      <ProductRail
        eyebrow="Give luxury"
        title="Luxury Gift Sets"
        kind="giftSet"
        limit={3}
        href="/collections/gift-sets/"
        linkLabel="View all gift sets"
        background="bg-espresso/30"
      />

      <Testimonials />

      <section className="border-t border-gold/20 bg-obsidian py-20 sm:py-24">
        <div className="container-luxe text-center">
          <SectionHeading
            eyebrow="Stay close"
            title="Join the House"
            subtitle="New fragrances and private releases, delivered to your inbox."
          />
          <div className="mt-10">
            <Newsletter />
          </div>
        </div>
      </section>
    </main>
  );
}
