
import Link from 'next/link';
import Image from 'next/image';

export default function Logo() {
  return (
    <Link
      href="/"
      aria-label="Maison Alvaro — home"
      className="flex items-center"
    >
      <Image
        src="/brand/logooo.jpg"
        alt="Maison Alvaro"
        width={220}
        height={80}
        priority
        className="h-12 w-auto object-contain"
      />
    </Link>
  );
}

