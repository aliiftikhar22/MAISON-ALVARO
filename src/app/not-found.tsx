import Link from 'next/link';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function NotFound() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="container-luxe flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-4 font-serif text-6xl">Page not found</h1>
        <div className="mt-6 h-px w-20 bg-gold/60" aria-hidden />
        <p className="mt-6 max-w-md text-sm text-ivory/65">
          The page you’re looking for doesn’t exist or has moved.
        </p>
        <Link href="/" className="btn-gold mt-10">
          Back to home
        </Link>
      </main>
      <Footer />
    </>
  );
}
