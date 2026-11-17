import { readJSON, STORAGE_KEYS, writeJSON } from '@/lib/storage';

const MAX = 8;

export function getRecentSlugs(): string[] {
  return readJSON<string[]>(STORAGE_KEYS.recent, []);
}

export function recordRecentlyViewed(slug: string): void {
  const next = [slug, ...getRecentSlugs().filter((s) => s !== slug)].slice(0, MAX);
  writeJSON(STORAGE_KEYS.recent, next);
}
