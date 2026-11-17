import { Truck } from 'lucide-react';
import { siteConfig } from '@/data/seed';

export default function AnnouncementBar() {
  return (
    <div className="border-b border-gold/30 bg-obsidian">
      <p className="container-luxe flex items-center justify-center gap-3 py-2 text-[10px] uppercase tracking-wide2 text-gold sm:text-[11px]">
        <Truck className="h-3.5 w-3.5" aria-hidden />
        <span>{siteConfig.announcement}</span>
        <span className="text-gold/40" aria-hidden>
          |
        </span>
        <span className="hidden sm:inline">{siteConfig.announcementSecondary}</span>
      </p>
    </div>
  );
}
